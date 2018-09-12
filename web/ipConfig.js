/**
 * Created by evercx on 16/9/20.
 */

var mongo = {
    user: "newsUser",
    pwd: "1310724518",
    host: "127.0.0.1",
    port: "27017"
};

var IPAddress = {
    mongodb:'mongodb://' + mongo.user + ':' 
    + mongo.pwd + '@' + mongo.host + ':' + mongo.port + '/NewsPOA2/'
};

//exports.db = PSOCFI_DB;
module.exports = IPAddress;
