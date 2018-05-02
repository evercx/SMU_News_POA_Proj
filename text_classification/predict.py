import sys
sys.path.append('../')
from text_classification.news_category_train import predict_news_category
from text_classification.news_sentiment_train import predict_news_sentiment



def predict_news_category_and_sentiment(string):

    sentiment_result = predict_news_sentiment(string)
    category_result = predict_news_category(string)

    return {
        "news_sentiment":sentiment_result,
        "news_category": category_result
    }


if __name__ == '__main__':

    string = "2017上海海事大学研究生入学考试简章"
    string = "上海海事大学一名教师春节在海南三亚海滩溺亡"
    string2 = "上海海事大学14名学生期末考试作弊将受开除学籍等处分"

    result = predict_news_category_and_sentiment(string)
    print(result)

    print(predict_news_category_and_sentiment(string2))