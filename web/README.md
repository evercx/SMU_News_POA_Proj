# 上海海事大学舆情分析系统

## 介绍

该舆情分析系统基于近几年各大高校的动态新闻进行分类、情感分析。


2018.9.15更新
运行text_classification/update_news.py完成一站式新闻更新（运行前请跟新config/database.py中的数据库信息），具体包含如下操作：

1. save_newslist_to_db()：
爬取新闻，若爬取的新闻url存在相同，则更新该新闻的ranking；否则，插入一条新的新闻。

2. predict_in_db():
对于新插入的新闻进行预测。

3. compute_score()：
相当于运行db_operation/compute_media_influence_score.py，重新缓存影响力分数。
这里的影响力分数计算方法已进发生改变，加入新闻日期作为一个权重。

