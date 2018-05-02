import sys
sys.path.append('../')

from config.functions import load_json_file,seg_chinese_text
from config.university_list import get_university_list
from config.database import get_database_dict_info
from text_classification.predict import predict_news_category_and_sentiment
from pymongo import MongoClient
from db_operation.create_news_number_info import create_news_numbers_info



def judge_url_in_list(news_list,url):

    for i in range(len(news_list)):

        if news_list[i]["url"] == url:
            return True

    return False



def add_negative_news_from_old_db():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    new_conn = MongoClient(db_config["host"],db_config["port"])

    old_conn = MongoClient("121.42.236.250",27034)

    old_neg_news_cursor = old_conn.ResultPOA["news"].find({"sentiment": "-1"})

    old_neg_news_list = [ item for item in old_neg_news_cursor]

    new_neg_news_cursor = new_conn.NewsPOA["news"].find({"sentiment": "-1"})

    new_neg_news_list = [item for item in new_neg_news_cursor]

    add_neg_list = []

    for i in range(len(old_neg_news_list)):

        current_news = old_neg_news_list[i]
        current_news_url = current_news["url"]

        if judge_url_in_list(new_neg_news_list,current_news_url) == False:

            current_news["media"] = "unkown"
            add_neg_list.append(current_news)

    new_conn.NewsPOA["news"].insert(add_neg_list)

    create_news_numbers_info()

    new_conn.close()
    old_conn.close()



if __name__ == '__main__':
    add_negative_news_from_old_db()

