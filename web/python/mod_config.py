# -*- coding:utf-8 -*-

import ConfigParser
import os

# 获取config配置文件

def getConfig(section,key):

    config = ConfigParser.ConfigParser()
    path = os.path.split(os.path.realpath(__file__))[0] + '/app.conf'       #os.path.split(os.path.realpath(__file__))[0]得到当前文件模块的目录
    config.read(path)
    return config.get(section,key)

def get_University_list():

     return [
                {
                    "zh_name": "上海海事大学",
                    "en_name": "smu"
                },

                {
                    "zh_name": "上海交通大学",
                    "en_name": "sjtu"
                },

                {
                    "zh_name": "同济大学",
                    "en_name": "tongji"
                },

                {
                    "zh_name": "复旦大学",
                    "en_name": "fudan"
                },

                {
                    "zh_name": "华东师范大学",
                    "en_name": "ecnu"
                },

                {
                    "zh_name": "上海大学",
                    "en_name": "shu"
                },

                {
                    "zh_name": "华东理工大学",
                    "en_name": "ecust"
                },

                {
                    "zh_name": "东华大学",
                    "en_name": "dhu"
                },

                {
                    "zh_name": "上海财经大学",
                    "en_name": "shufe"
                },

                {
                    "zh_name": "上海外国语大学",
                    "en_name": "shisu"
                },

                {
                    "zh_name": "华东政法大学",
                    "en_name": "ecupl"
                },

                {
                    "zh_name": "上海师范大学",
                    "en_name": "shnu"
                },

                {
                    "zh_name": "上海理工大学",
                    "en_name": "usst"
                },

                {
                    "zh_name": "上海海洋大学",
                    "en_name": "shou"
                },

                {
                    "zh_name": "上海中医药大学",
                    "en_name": "shutcm"
                },

                {
                    "zh_name": "上海音乐学院",
                    "en_name": "sus"
                },

                {
                    "zh_name": "上海戏剧学院",
                    "en_name": "sta"
                },

                {
                    "zh_name": "上海对外经贸大学",
                    "en_name": "shift"
                },

                {
                    "zh_name": "上海电机学院",
                    "en_name": "sdju"
                },

                {
                    "zh_name": "上海工程技术大学",
                    "en_name": "sues"
                }
            ]



def get_ModelType_Info():
    print os.getcwd();

    return {

        "sentiment":{
            "categories": ["-1", "0", "1"],
            "load_Files_Path": './sentiment_seg_data/',
            "save_model_Path": './models/sentiment_model.m',
            "count_vect_Path": './wordbag/sentiment_count_vect.dat',
            "tfidf_Path": './wordbag/sentiment_tfidf.dat'
        },

        "classification":{
            "categories": ["activity", "entrance", "social","study"],
            "load_Files_Path": './classification_seg_data/',
            "save_model_Path": './models/classification_model.m',
            "count_vect_Path": './wordbag/classification_count_vect.dat',
            "tfidf_Path": './wordbag/classification_tfidf.dat'
        },
    }