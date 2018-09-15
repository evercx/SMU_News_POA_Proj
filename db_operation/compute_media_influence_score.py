import sys
sys.path.append('../')

from config.functions import load_json_file,seg_chinese_text
from config.university_list import get_university_list
from config.database import get_database_dict_info
from pymongo import MongoClient
from datetime import datetime
import math



def compute_score():
    # 获取学校列表，数据库配置信息
    university_list = get_university_list()
    db_config = get_database_dict_info()

    #建立数据库连接
    conn = MongoClient(
        db_config["host"], db_config["port"],
        username=db_config["username"],
        password=db_config["password"],
        authSource=db_config["user_database"],
        authMechanism=db_config["auth_mechanism"]
    )

    NewsPOA = conn[db_config["target_database"]]
    NewsPOA["influence"].drop()

    for uni in university_list:
        uni_name = uni['zh_name']

        uni_news_list = NewsPOA["newslist"].find({"Uname":uni_name})
        print("开始计算 ",uni_name,"的数据...")
        score = {}
        for news in uni_news_list:
            delta_days = datetime.now() - datetime.strptime(news["date"], "%Y年%m月%d日 %H:%M")
            delta_days = delta_days.days
            
            # sigmoid函数的变种（自制）
            weight_ranking = 2/(1+math.exp(float(news["ranking"])/100))
            weight_date = 2/(1+math.exp(delta_days/500))
            if score.get(news["media"]) is not None:
                score[news["media"]] += weight_ranking*weight_date
            else:
                score[news["media"]] = weight_ranking*weight_date

        score_list = []
        for key,value in score.items():

            current = {
                "Uname":uni_name,
                "media":key,
                "score":value
            }

            score_list.append(current)

        NewsPOA["influence"].insert(score_list)
        print(uni_name,"的数据保存完毕")



if __name__ == '__main__':

    compute_score()






