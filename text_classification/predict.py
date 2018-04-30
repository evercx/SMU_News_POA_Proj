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
    # string = "本市举办“上海市第五届大学生模拟法庭竞赛“活动 - 滚动热点"

    result = predict_news_category_and_sentiment(string)
    print(result)