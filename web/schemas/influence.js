/*****************************************************************************************************************
 Author:  刘敏杰             Date:  2016/09/20
 Description:  高校新闻详情表
 ********************************************************************************************************************/

var mongoose = require('mongoose');
var influenceSchema = new mongoose.Schema({
    Uname:{     //大学名称
        type:String
    },
    media:{   //媒体
        type:String
    },
    score:{     //分数
        type:Number
    }
});



module.exports = influenceSchema;