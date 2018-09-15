


def get_database_dict_info():

    db = {
        "host" : "127.0.0.1",
        "port" : 27017,
        "username": "newsUser",
        "password": "Aa12345678",

        # 用户账号所属的数据库
        "user_database": "NewsPOA2",

        # 要获得数据的数据库
        "target_database": "NewsPOA2",
        
        "auth_mechanism": "SCRAM-SHA-1"
    }

    return db
