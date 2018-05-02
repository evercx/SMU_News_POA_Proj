/*****************************************************************************************************************
 Author:  刘敏杰             Date:  2016/09/20
 Description: 高校新闻数据分析表
 ********************************************************************************************************************/

var mongoose = require('mongoose');
var newNumberSchema = new mongoose.Schema({

    Uname:{     //大学名称
        type:String
    },
    abbr:{     //
        type:String
    },
    studyNumber:{     //学习分类
        type:[]
    },
    activityNumber:{     //活动分类
        type:[]
    },
    entranceNumber:{     //入学分类
        type:[]
    },
    socialNumber:{     //社会分类
        type:[]
    }
});



module.exports = newNumberSchema;