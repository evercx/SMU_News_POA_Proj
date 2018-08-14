//colleges表插入数据shell


var array = [
	{"zh_colleges":"上海交通大学","en_colleges":"sjtu"},
	{"zh_colleges":"同济大学","en_colleges":"tongji"},
	{"zh_colleges":"复旦大学","en_colleges":"fudan"},
	{"zh_colleges":"华东师范大学","en_colleges":"ecnu"},
	{"zh_colleges":"上海大学","en_colleges":"shu"},
	{"zh_colleges":"华东理工大学","en_colleges":"ecust"},
	{"zh_colleges":"东华大学","en_colleges":"dhu"},
	{"zh_colleges":"上海财经大学","en_colleges":"shufe"},
	{"zh_colleges":"上海外国语大学","en_colleges":"shisu"},
	{"zh_colleges":"华东政法大学","en_colleges":"ecupl"},
	{"zh_colleges":"上海师范大学","en_colleges":"shnu"},
	{"zh_colleges":"上海理工大学","en_colleges":"usst"},
	{"zh_colleges":"上海海事大学","en_colleges":"smu"},
	{"zh_colleges":"上海海洋大学","en_colleges":"shou"},
	{"zh_colleges":"上海中医药大学","en_colleges":"shutcm"},
	{"zh_colleges":"上海体育学院","en_colleges":"sus"},
	{"zh_colleges":"上海音乐学院","en_colleges":"shcmusic"},
	{"zh_colleges":"上海戏剧学院","en_colleges":"sta"},
	{"zh_colleges":"上海对外经贸大学","en_colleges":"shift"},
	{"zh_colleges":"上海电机学院","en_colleges":"sdju"},
	{"zh_colleges":"上海工程技术大学","en_colleges":"sues"},
	{"zh_colleges":"上海科技大学","en_colleges":"shanghaitech"},
	{"zh_colleges":"大连海事大学","en_colleges":"dlmu"},
	{"zh_colleges":"武汉理工大学","en_colleges":"whut"},
	{"zh_colleges":"集美大学","en_colleges":"jmu"},
	{"zh_colleges":"中国海洋大学","en_colleges":"ouc"}
];

for (var i = 0;i<array.length;i++){
	db.colleges.insert(
		array[i]
	)
}

//data表中插入数据

var school_list={
	'smu':'上海海事大学',
	'sjtu':'上海交通大学',
	'tongji':'同济大学',
	'fudan':'复旦大学',
	'ecnu':'华东师范大学',
	'shu':'上海大学',
	'ecust':'华东理工大学',
	'dhu':'东华大学',
	'shufe':'上海财经大学',
	'shisu':'上海外国语大学',
	'ecupl':'华东政法大学',
	'shnu':'上海师范大学',
	'usst':'上海理工大学',
	'shou':'上海海洋大学',
	'shutcm':'上海中医药大学',
	'sus':'上海体育学院',
	'shcmusic':'上海音乐学院',
	'sta':'上海戏剧学院',
	'shift':'上海对外经贸大学',
	'sdju':'上海电机学院',
	'sues':'上海工程技术大学',
	'shanghaitech':'上海科技大学',
	'dlmu':'大连海事大学',
	'whut':'武汉理工大学',
	'jmu':'集美大学',
	'ouc':'中国海洋大学'
};


for(var o in school_list){
	db.data.insert(
		{"school":school_list[o],"study":0,"activity":1,"entrance":2,"social":3}
	)
}


//school表中插入数据

var school_list={
	'smu':'上海海事大学',
	'sjtu':'上海交通大学',
	'tongji':'同济大学',
	'fudan':'复旦大学',
	'ecnu':'华东师范大学',
	'shu':'上海大学',
	'ecust':'华东理工大学',
	'dhu':'东华大学',
	'shufe':'上海财经大学',
	'shisu':'上海外国语大学',
	'ecupl':'华东政法大学',
	'shnu':'上海师范大学',
	'usst':'上海理工大学',
	'shou':'上海海洋大学',
	'shutcm':'上海中医药大学',
	'sus':'上海体育学院',
	'shcmusic':'上海音乐学院',
	'sta':'上海戏剧学院',
	'shift':'上海对外经贸大学',
	'sdju':'上海电机学院',
	'sues':'上海工程技术大学',
	'shanghaitech':'上海科技大学',
	'dlmu':'大连海事大学',
	'whut':'武汉理工大学',
	'jmu':'集美大学',
	'ouc':'中国海洋大学'
};


for(var o in school_list){
	db.school.insert(
		{
			"school":school_list[o],
			"classification":"study",
			"title":"《微微一笑很倾城》取景地曝光 华东政法大学--湖北频道--人民网",
			"url":"http://hb.people.com.cn/n2/2016/0914/c192237-29004324-4.html",
			"date":"2016年09月14日 14:00"
		}
	)
}

