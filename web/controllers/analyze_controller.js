/**
 * Created by EVERCX on 2017/5/9.
 */

var fs = require('fs');
var exec = require('child_process').exec;
var filePath = './python/online_analyze.py';

var commandConfig = require('../command_config');

var command = commandConfig.pythonCommand + filePath;

exports.doTextAnalyze = function(req,res){

    if(!req.body.text){

        res.send({
            code:'400',
            msg:"参数无效 请重试"
        }).end();

        return;
    }

    fs.writeFile('./python/text.txt',req.body.text,function(err){
        if(err) {
            console.error(err);
            res.send({
                code:'500',
                msg:"解析失败 请重试"
            }).end();
            return;
        } else {
            exec(command,function(err,stdout,stderr){
                    if(err)
                    {
                        console.log('stderr',err);
                        res.send({
                            code:'500',
                            msg:"解析失败 请重试"
                        }).end();
                        return;
                    }
                    if(stdout)
                    {

                        // console.log(stdout)
                        // console.log(typeof(stdout));

                        var obj = eval('(' + stdout+ ')');

                        var classificationDict = {
                            "study":"学习学术",
                            "activity":"社团活动",
                            "entrance":"招生考试",
                            "social":"社会新闻"
                        };
                        var sentimentDict = {
                            "1":"正面情感",
                            "0":"中性情感",
                            "-1":"负面情感"
                        };
                        resObj = {};
                        resObj.sentiment = sentimentDict[obj.sentiment];
                        resObj.classification = classificationDict[obj.classification];
                        res.send({
                            code:'200',
                            result:resObj
                        }).end();
                    }
            })
        }
    });
    
};