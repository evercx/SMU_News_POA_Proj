# 上海海事大学舆情分析系统

## 介绍

该舆情分析系统基于近几年各大高校的动态新闻进行分类、情感分析。


2018.9.15更新
运行text_classification/update_news.py完成一站式新闻更新（运行前请跟新config/database.py中的数据库信息），具体包含如下操作：

1. save_newslist_to_db()：
为数据库中所有新闻设置属性visited为False，同时重新爬取新闻，若爬取的新闻url存在相同，则更新该新闻的ranking，并设置visited为True；否则，插入一条新的新闻，其中visited属性也为True。

2. punish_unvisited()：
对于所有剩下的visited属性为False的新闻，其ranking乘2作为惩罚。

3. delete_low_ranked()：
删除ranking大于1200的旧闻（已经不能算是新闻了）

4. predict_in_db():
对于新插入的新闻进行预测

5. compute_score()：
相当于运行db_operation/compute_media_influence_score.py，重新缓存影响力分数。
这里的影响力分数计算方法已进发生改变，加入新闻日期作为一个权重。

