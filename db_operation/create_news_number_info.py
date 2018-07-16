import sys
sys.path.append('../')

from config.functions import load_json_file,seg_chinese_text
from config.university_list import get_university_list
from config.database import get_database_dict_info
from text_classification.predict import predict_news_category_and_sentiment
from pymongo import MongoClient


def create_news_numbers_info():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    conn = MongoClient("121.42.236.250", 27034)

    NewsPOA = conn.NewsPOA
    news_number_list = []

    for uni in university_list:

        studyNumberList = []
        activityNumberList = []
        entranceNumberList = []
        socialNumberList = []

        studyNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "study", "sentiment": "-1"}).count())
        studyNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "study", "sentiment": "0"}).count())
        studyNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "study", "sentiment": "1"}).count())
        studyNumberList.append(studyNumberList[0] + studyNumberList[1] + studyNumberList[2])

        activityNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "activity", "sentiment": "-1"}).count())
        activityNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "activity", "sentiment": "0"}).count())
        activityNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "activity", "sentiment": "1"}).count())
        activityNumberList.append(activityNumberList[0] + activityNumberList[1] + activityNumberList[2])


        entranceNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "entrance", "sentiment": "-1"}).count())
        entranceNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "entrance", "sentiment": "0"}).count())
        entranceNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "entrance", "sentiment": "1"}).count())
        entranceNumberList.append(entranceNumberList[0] + entranceNumberList[1] + entranceNumberList[2])

        socialNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "social", "sentiment": "-1"}).count())
        socialNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "social", "sentiment": "0"}).count())
        socialNumberList.append(NewsPOA["news"].find({"Uname": uni["zh_name"], "classification": "social", "sentiment": "1"}).count())
        socialNumberList.append(socialNumberList[0] + socialNumberList[1] + socialNumberList[2])

        news_number_list.append({"Uname":uni["zh_name"],"abbr":uni["en_name"],"studyNumber":studyNumberList,"activityNumber":activityNumberList,"entranceNumber":entranceNumberList,"socialNumber":socialNumberList})

    NewsPOA["newsNumber"].drop()
    NewsPOA["newsNumber"].insert(news_number_list)
    print("新闻数量表保存成功")



if __name__ == '__main__':
    create_news_numbers_info()