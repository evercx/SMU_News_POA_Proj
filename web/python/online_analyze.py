import sys
import os
sys.path.append('../')
from text_classification.predict import predict_news_category_and_sentiment


def read_file(path):

    f = open(path,"r",encoding="utf-8")
    content = f.read()
    f.close()
    return content



content = read_file(os.getcwd() +'/python/text.txt')

result = predict_news_category_and_sentiment(content)

analyze_result = {
    "sentiment": result["news_sentiment"],
    "classification": result["news_category"]
}

print(analyze_result)