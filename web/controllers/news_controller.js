/**
 * Created by EVERCX on 2017/4/23.
 */

var mongoose = require('mongoose');
var newsModel = require('../js_models/news');

exports.getNewsInfo = function(req,res){

    var query = {};

    if(decodeURI(req.query.uname))
        query.Uname = decodeURI(req.query.uname);
    if(req.query.classification)
        query.classification = req.query.classification;
    if(req.query.abbr)
        query.abbr = req.query.abbr;
    if(req.query.sentiment)
        query.sentiment = req.query.sentiment;

    newsModel.find(query,function(err,result){

        if(err){
            console.log(err);
            res.send({
                code:"500",
                msg:"查询失败"
            }).end();
        }

        res.send(result).end();
    })
}