var express = require('express');
var path = require('path');
var router = express.Router();
var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');
var ipConfig = require('../ipConfig');

var collegesModel = require('../models/colleges');
var newsNumberModel = require('../models/newsNumber');
var newsModel = require('../models/news');
var newsController = require('../controllers/news_controller');
var analyzeController  =require('../controllers/analyze_controller');

mongoose.connect(ipConfig.mongodb);

//接口过滤中间件,只允许GET操作,防止对数据库的修改操作
router.use('/api/v1/*',function(req,res,next){
    if(req.method !== 'GET'){
      console.log("\n\n当前操作不是get,其操作为: "+req.method);
      res.send({msg:"无权限对数据进行修改操作"});
    }else{
        console.log(req.method);
      next();
    }
 });

router.get('/api/news',newsController.getNewsInfo);
router.post('/api/analyze',analyzeController.doTextAnalyze);


restify.serve(router,collegesModel);
restify.serve(router,newsNumberModel);
restify.serve(router,newsModel);

module.exports = router;
