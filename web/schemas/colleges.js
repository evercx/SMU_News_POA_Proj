/*****************************************************************************************************************
 Author:  刘敏杰             Date:  2016/09/20
 Description:  大学中英文映射表
 ********************************************************************************************************************/

var mongoose = require('mongoose');
var collegeSchema = new mongoose.Schema({
    zh_name:{     //大学中文名
        type:String
    },
    en_name:{     //大学英文名
        type:String
    }
});



module.exports = collegeSchema;