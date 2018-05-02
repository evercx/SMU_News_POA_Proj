# -*- coding:utf-8 -*-
# import mod_config
import os
import sys
import jieba
# from pymongo import MongoClient
import  cPickle as pickle
import numpy as np
from sklearn.externals import joblib

def readFile(path):

    f = open(path,"r")
    content = f.read()
    f.close()
    return content


def readBunchObj(path):

    file_Obj = open(path,"rb")
    bunch = pickle.load(file_Obj)
    file_Obj.close()
    return bunch

def seg_ChineseText(text):

    str = text.strip().replace("\r\n","").strip()
    text_seg = " ".join(jieba.cut(str))

    return text_seg


def get_tfidf(text_seg,typeDict):



    docs = []
    docs.append(text_seg)

    count_vect = readBunchObj(typeDict["count_vect_Path"])
    tfidf_transformer = readBunchObj(typeDict["tfidf_Path"])

    X_new_counts = count_vect.transform(docs)
    X_new_tfidf = tfidf_transformer.transform(X_new_counts)

    return X_new_tfidf


def get_predictedResult(tfidf,typeDict):

    clf = joblib.load(typeDict["save_model_Path"])
    result = clf.predict(tfidf)

    # 从numpy数组格式的结果提取出索引数值
    result_index = result[0]

    predictedResult = typeDict["categories"][result_index]


    return predictedResult


def get_ModelType_Info():


    return {

        "sentiment":{
            "categories": ["-1", "0", "1"],
            "load_Files_Path": './sentiment_seg_data/',
            "save_model_Path": os.getcwd() +'/python/models/sentiment_model.m',
            "count_vect_Path": os.getcwd() +'/python/wordbag/sentiment_count_vect.dat',
            "tfidf_Path": os.getcwd() +'/python/wordbag/sentiment_tfidf.dat'
        },

        "classification":{
            "categories": ["activity", "entrance", "social","study"],
            "load_Files_Path": './classification_seg_data/',
            "save_model_Path": os.getcwd() +'/python/models/classification_model.m',
            "count_vect_Path": os.getcwd() +'/python/wordbag/classification_count_vect.dat',
            "tfidf_Path": os.getcwd() +'/python/wordbag/classification_tfidf.dat'
        },
    }

def main():

    Dict = get_ModelType_Info()
    text_seg = seg_ChineseText(readFile(os.getcwd() +'/python/text.txt'));

    #print sys.argv[1]
    # print text_seg.encode('utf-8')

    # print Dict

    tfidf_sentiment = get_tfidf(text_seg, Dict["sentiment"])
    tfidf_classification = get_tfidf(text_seg, Dict["classification"])

    sentimentResult = get_predictedResult(tfidf_sentiment, Dict["sentiment"])
    classificationResult = get_predictedResult(tfidf_classification, Dict["classification"])

    Result = {
        "sentiment":sentimentResult,
        "classification":classificationResult,
        # "text":sys.argv[1]
    }

    print Result

main()