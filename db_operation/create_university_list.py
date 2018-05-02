
import sys
sys.path.append('../')

from config.functions import load_json_file,seg_chinese_text
from config.university_list import get_university_list
from config.database import get_database_dict_info
from text_classification.predict import predict_news_category_and_sentiment
from pymongo import MongoClient


def insert_university_list():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    conn = MongoClient(db_config["host"],db_config["port"])

    NewsPOA = conn.NewsPOA

    NewsPOA["universitylist"].insert(university_list)
    print("学校列表表创建成功")


if __name__ == '__main__':

    insert_university_list()
