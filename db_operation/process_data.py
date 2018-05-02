import sys
sys.path.append('../')

from config.functions import load_json_file,seg_chinese_text
from config.university_list import get_university_list
from config.database import get_database_dict_info
from text_classification.predict import predict_news_category_and_sentiment
from pymongo import MongoClient



def predict_poa_result_from_documnet_dict(document_dict):

    predicted_result = predict_news_category_and_sentiment(document_dict["body"])

    document_dict["classification"] = predicted_result["news_category"]
    document_dict["sentiment"] = predicted_result["news_sentiment"]

    return document_dict




def save_result_poa_list_to_db():

    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    conn = MongoClient(db_config["host"],db_config["port"])

    NewsPOA = conn.NewsPOA

    NewsPOA["news"].drop()



    for i in range(len(university_list)):

        uni = university_list[i]
        print("开始", uni["zh_name"])
        json_path = "../news_result/"+ uni["zh_name"] + ".json"
        current_uni_news_list = load_json_file(json_path)
        result_uni_news_list = []

        for j in range(len(current_uni_news_list)):
            result_uni_news_list.append(predict_poa_result_from_documnet_dict(current_uni_news_list[j]))


        NewsPOA["news"].insert(result_uni_news_list)
        print(uni["zh_name"], "的新闻分析完毕，共有", str(len(result_uni_news_list)), "条")



save_result_poa_list_to_db()
