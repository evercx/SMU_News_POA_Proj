/***********************************************************
 Author:  刘敏杰              Date:  2016/09/20
 Description:   把schema对象模型，编译成一个Model对象；
 Function List:  connect()方法：在mongoose模块级别下导出，连接到
 config所设置的数据库；
 model()方法: 编译模型；
 ***********************************************************/


var mongoose = require('mongoose');
var collegesSchema = require('../schemas/colleges');
var collegesModel = mongoose.model('colleges',collegesSchema,'universitylist');

module.exports = collegesModel;