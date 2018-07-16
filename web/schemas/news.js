/*****************************************************************************************************************
 Author:  刘敏杰             Date:  2016/09/20
 Description:  高校新闻详情表
 ********************************************************************************************************************/

var mongoose = require('mongoose');
var newsSchema = new mongoose.Schema({
    Uname:{     //大学名称
        type:String
    },
    classification:{   //分类名称
        type:String
    },
    title:{     //新闻标题
        type:String
    },
    url:{     //新闻地址
        type:String
    },
    date:{     //新闻发布时间
        type:String
    },
    body:{     //新闻正文
        type:String
    },
    sentiment:{     //情感分类
        type:String
    },
    abbr:{     //学校的英文缩写
        type:String
    },
    media:{
        type:String
    }
});



module.exports = newsSchema;