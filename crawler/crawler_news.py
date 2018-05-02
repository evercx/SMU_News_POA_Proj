import sys
sys.path.append('../')

from config.database import get_database_dict_info
from config.university_list import get_university_list
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from readability import Document
import html2text
import json

MAX_PAGE_NUMBERS = 39


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
        response = requests.get(url, headers=request_headers)

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


def request_baidu_news(university_name,start_page,end_page,university_abbr):

    # 请求地址模板
    base_url = "http://news.baidu.com/ns?word={university_name}&pn={pn}&rn=20&cl=2"

    user_agent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'

    request_headers = {'User-Agent': user_agent}

    news_documents_list = []

    for i in range(start_page,end_page):

        pn = i * 20 - 20

        url = base_url.format(university_name=university_name, pn=pn)

        response = requests.get(url, headers=request_headers)

        # 拿到 BS4 的解析结果
        soup = BeautifulSoup(response.text,'lxml')

        for j in range(1,21):

            id = str(j + pn)

            result_div = soup.find(id=id)

            if not result_div:
                break

            media_date_text = result_div.p.text
            index_of_year = media_date_text.find("20")

            title = result_div.a.text
            url = result_div.a['href']
            media = media_date_text[0:index_of_year - 2]
            date = media_date_text[index_of_year:]

            body = get_website_body_from_html(url)

            current_news = {
                "title":title,
                "url":url,
                "media":media,
                "Uname":university_name,
                "date":date,
                "abbr":university_abbr,
                "body":body
            }

            if(filter(current_news) == "true"):
                news_documents_list.append(current_news)
        print(university_name," 新闻的第",i,"页爬取结束")


    print("完成了",university_name,"的新闻信息爬取,共 ",str(len(news_documents_list))," 条")

    return news_documents_list


def save_newslist_to_db():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    conn = MongoClient(db_config["host"],db_config["port"])

    NewsPOA = conn.NewsPOA

    NewsPOA["newslist"].drop()

    for i in range(0,len(university_list)):
    # for i in range(0,1):

        uni = university_list[i]
        news_documents_list = request_baidu_news(uni["zh_name"],1,MAX_PAGE_NUMBERS,uni["en_name"])
        NewsPOA["newslist"].insert(news_documents_list)
        print(uni["zh_name"],"的新闻列表保存成功")

    print("新闻全部爬取完毕")

# save_newslist_to_db()

def save_newslist_into_file():

    university_list = get_university_list()
    for i in range(0,len(university_list)):

        uni = university_list[i]
        news_documents_list = request_baidu_news(uni["zh_name"],1,MAX_PAGE_NUMBERS,uni["en_name"])

        news_path = "./news_result/" + uni["zh_name"] + ".json"
        with open(news_path, 'w', encoding='utf-8') as json_file:
            json.dump(news_documents_list, json_file, ensure_ascii=False)

            print(uni["zh_name"],"的新闻列表保存成功")



# save_newslist_into_file()







