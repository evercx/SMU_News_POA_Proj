import sys, os
root_folder = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_folder)

from config.database import get_database_dict_info
from config.university_list import get_university_list
from text_classification.news_sentiment_train import predict_news_sentiment
from text_classification.news_category_train import predict_news_category
from db_operation.compute_media_influence_score import compute_score
from config.functions import *
from sklearn.externals import joblib
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
# pip install readability/readability-lxml/readability-api
from readability.readability import Document         
import html2text
import json
import threading
import time

MAX_PAGE_NUMBERS = 2


def connect_newslist():
    db_config = get_database_dict_info()
    conn = MongoClient(
        db_config["host"], db_config["port"],
        username=db_config["username"],
        password=db_config["password"],
        authSource=db_config["user_database"],
        authMechanism=db_config["auth_mechanism"]
    )
    newslist = conn[db_config["target_database"]]["newslist"]
    
    return newslist


# 过滤一些无效的新闻数据
def filter(doc):
    if doc["body"] == "error":
        return "false"

    if len(doc["body"]) <= 50:
        return "false"

    if len(doc["date"]) <= 10:
        return "false"

    if doc["body"].find('ä') != -1:
        return "false"

    if doc["title"].find('ä') != -1:
        return "false"

    return "true"


# 提取各种网页中的主体正文
def get_website_body_from_html(url):

    user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    request_headers = {'User-Agent': user_agent}

    try:
        response = requests.get(url, headers=request_headers, timeout=300)

        # print("url", url)
        # print(response.headers['content-type'])
        # print(response.encoding)
        # print(response.apparent_encoding)
        # print(requests.utils.get_encodings_from_content(response.text))

        html = response.text

        # 判定编码，解决爬取中文网页乱码问题
        # 乱码解决方法：http://blog.chinaunix.net/uid-13869856-id-5747417.html

        if response.encoding == 'ISO-8859-1':
            encodings = requests.utils.get_encodings_from_content(response.text)
            if encodings:
                encoding = encodings[0]
            else:
                encoding = response.apparent_encoding
            content = response.content      # bytes流

            if encoding == 'gb2312' or encoding == 'GB2312' or ((encoding == 'gbk' or encoding == 'GBK') and (response.apparent_encoding == 'GB2312' or response.apparent_encoding == 'gb2312')):
                html = content.decode("gb2312", 'replace')
            else:
                html = content.decode(encoding, 'replace').encode('utf-8', 'replace')

        readable_article = Document(html).summary()
        body = html2text.html2text(readable_article)

    except BaseException as e:
        print('Download error', e)
        body = "false"


    return body


def request_baidu_news(university_name,start_page,end_page,university_abbr,collection):

    # 请求地址模板
    base_url = "http://news.baidu.com/ns?word={university_name}&pn={pn}&rn=20&cl=2"

    user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'

    request_headers = {'User-Agent': user_agent}

    insert_count = [0]

    threads = []

    for i in range(start_page,end_page):

        pn = i * 20 - 20

        url = base_url.format(university_name=university_name, pn=pn)

        response = requests.get(url, headers=request_headers)

        # 拿到 BS4 的解析结果
        soup = BeautifulSoup(response.text,'lxml')

        for j in range(1,21):

            id_of_news = j + pn

            result_div = soup.find(id=id_of_news)

            if not result_div:
                break

            # 为了实现多线程而增加的函数get_detail_news
            thread = threading.Thread(
                target=get_detail_news,
                args=(
                    result_div, id_of_news, university_name, 
                    university_abbr, insert_count,
                    collection
                )
            )
            threads.append(thread)
            thread.start()
    

    for thread in threads:
        print("剩余:" + str(threading.active_count()))
        thread.join(60)

    print("完成了",university_name,"的新闻信息爬取,共新插入 ",str(insert_count[0])," 条")


# 为了多线程而增加的函数
def get_detail_news(result_div, id_of_news, university_name, 
                    university_abbr, insert_count, collection):
    url = result_div.a['href']
    if collection.find_one({"url": url}):
        collection.update_one(
            {"url": url},
            {"$set": {"ranking": id_of_news}}
        )
        print("thread" + str(id_of_news) + " of " + university_name + " is updated")
        return

    media_date_text = result_div.p.text
    index_of_year = media_date_text.find("20")

    title = result_div.a.text
    
    media = media_date_text[0:index_of_year - 2]
    date = media_date_text[index_of_year:]

    body = get_website_body_from_html(url)

    current_news = {
        "title": title.replace(" \r\t\n", "").strip(),
        "url": url,
        "media": media.replace(" \r\t\n", "").strip(),
        "Uname": university_name.replace(" \r\t\n", "").strip(),
        "date": date.replace("\r\t\n", "").strip(),
        "abbr": university_abbr,
        "body": body,
        "ranking": id_of_news,
        "classification": None,
        "sentiment": None,
    }
    if(filter(current_news) == "true"):
        collection.insert_one(current_news)
        insert_count[0] += 1
        print("thread" + str(id_of_news) + " of " + university_name + " is inserted")


def save_newslist_to_db():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    
    newslist = connect_newslist()

    for i in range(0,len(university_list)):
        uni = university_list[i]
        request_baidu_news(uni["zh_name"],1,MAX_PAGE_NUMBERS,uni["en_name"],newslist)
        print(uni["zh_name"],"的新闻列表处理成功")

    print("新闻全部爬取完毕")


# 对新加入的新闻进行预测
def predict_in_db():
    sentiment_config = get_news_sentiment_config()
    category_config = get_news_category_config()

    sentiment_count_vect = read_bunch_obj(sentiment_config["count_vect_path"])
    sentiment_tfidf_transformer = read_bunch_obj(sentiment_config["tfidf_path"])
    sentiment_clf = joblib.load(sentiment_config["save_model_path"])

    category_count_vect = read_bunch_obj(category_config["count_vect_path"])
    category_tfidf_transformer = read_bunch_obj(category_config["tfidf_path"])
    category_clf = joblib.load(category_config["save_model_path"])

    newslist = connect_newslist()

    count = 0
    for data in newslist.find(
        {
            "$or": [
                {"sentiment": None},
                {"classification": None}
            ]
        }
    ):
        text = data["title"] + " " + data["body"]
        text = seg_chinese_text(text)

        news_sentiment_counts = sentiment_count_vect.transform([text])
        news_sentiment_tfidf = sentiment_tfidf_transformer.transform(news_sentiment_counts)
        sentiment_result = sentiment_clf.predict(news_sentiment_tfidf)

        news_category_counts = category_count_vect.transform([text])
        news_category_tfidf = category_tfidf_transformer.transform(news_category_counts)
        category_result = category_clf.predict(news_category_tfidf)

        newslist.update_one(
            {"_id": data["_id"]},
            {
                "$set": {
                    "sentiment": sentiment_config["categories"][sentiment_result[0]],
                    "classification": category_config["categories"][category_result[0]]
                }
            }
        )
        count += 1
        print("完成预测第", count, "条新加入的新闻")
    print("已完成所有", count, "条新加入的新闻")



if __name__ == "__main__":
    # 1.爬取新闻
    save_newslist_to_db()

    # 2.预测新加入的新闻
    predict_in_db()

    # 3.重新计算媒体得分
    compute_score()
