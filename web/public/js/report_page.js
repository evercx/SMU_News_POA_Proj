//侧边栏的Vue实例
var sideListApp = new Vue({
    el:"#sideBar",
    data:{
        universityList:[
            {
                name: "上海海事大学",
                isActive: true
            },

            {
                name: "上海交通大学",
                isActive: false
            },

            {
                name: "同济大学",
                isActive: false
            },

            {
                name: "复旦大学",
                isActive: false
            },

            {
                name: "华东师范大学",
                isActive: false
            },

            {
                name: "上海大学",
                isActive: false
            },

            {
                name: "华东理工大学",
                isActive: false
            },

            {
                name: "东华大学",
                isActive: false
            },

            {
                name: "上海财经大学",
                isActive: false
            },

            {
                name: "上海外国语大学",
                isActive: false
            },

            {
                name: "华东政法大学",
                isActive: false
            },

            {
                name: "上海师范大学",
                isActive: false
            },

            {
                name: "上海理工大学",
                isActive: false
            },

            {
                name: "上海海洋大学",
                isActive: false
            },

            {
                name: "上海中医药大学",
                isActive: false
            },

            {
                name: "上海音乐学院",
                isActive: false
            },

            {
                name: "上海戏剧学院",
                isActive: false
            },

            {
                name: "上海对外经贸大学",
                isActive: false
            },

            {
                name: "上海电机学院",
                isActive: false
            },

            {
                name: "上海工程技术大学",
                isActive: false
            }
        ],
        currentUniversity:"上海海事大学"
    },
    methods:{
        selectUniversity:function(universityName){
            changeActiveStatusByUniversityName(this.universityList,universityName,true);
            this.currentUniversity = universityName;
            universityTitleApp.initTitle(this.currentUniversity);//初始化标题幕布
            formApp.initSettings();//初始化搜索框设置
            chartsApp.initCharts(universityName);//初始化图表数据
        }
    },
    computed:{

    }
});

//标题幕布的Vue实例
var universityTitleApp =new Vue({
    el:"#universityTitle",
    data:{
        title:sideListApp.currentUniversity,
        subtitle:''

    },
    created:function(){
        var _self = this;
        axios({
            method: 'get',
            url: '/api/v1/news/count',
            params:{
                query:{
                    "Uname":_self.title
                }
            }
        }).then(function(res){
            _self.subtitle = "当前系统中共有"+res.data.count+"条新闻数据......";
        })
    },
    computed:{},
    methods:{
        updateSubtitle:function(universityName){
            var _self = this;
            axios({
                method: 'get',
                url: '/api/v1/news/count',
                params:{
                    query:{
                        "Uname":universityName
                    }
                }
            }).then(function(res){
                _self.subtitle = "当前系统中共有"+res.data.count+"条新闻数据......";
            })
        },
        initTitle:function(title){
            this.title = title;
            this.updateSubtitle(this.title);
        }

    },
})

//表格数据的Vue实例
var newsListApp = new Vue({
    el:"#newsListApp",
    data:{
        tableData:[]
    },
    methods: {
        handleEdit(index, row) {
            window.location.href = row.url;
        }
    },
    computed:{
        tableList:function(){

            var list = this.tableData;

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
            for(i in list){
                list[i].classification = classificationDict[list[i].classification];
                list[i].sentiment = sentimentDict[list[i].sentiment];
            };

            return list;
        }
    }
})


//搜索条件的表单Vue实例
var formApp = new Vue({
    el:"#formApp",
    data:{
        formInline:{
            classification:'~',
            sentiment:'~'
        }
    },
    methods: {
        onSubmit() {
            paginationApp.search();
        },
        initSettings(){
            // this.formInline.classification = '~';
            // this.formInline.sentiment = '~';
            // paginationApp.search();
        }
    }
});



function changeActiveStatusByUniversityName(list,name,status){

    if(status){
        for(i in list){
            if(list[i].isActive === true){
                list[i].isActive = false
            }
        }
        for(i in list){

            if(list[i].name === name){
                console.log(list[i])
                list[i].isActive = status
                console.log(list[i])
            }
        }
    }
}



//新闻图表的Vue实例
var chartsApp = new Vue({
    el:"#chartsApp",
    data:{
        universityNewsInfo: {
            socialNumber:[0,0,0,0],
            entranceNumber:[0,0,0,0],
            activityNumber:[0,0,0,0],
            studyNumber:[0,0,0,0]
        },
        reportTitle:"舆情分析报告"
    },
    methods: {
        initCharts(universityName){
            var _self = this;
        	_self.reportTitle = universityTitleApp.title + "的舆情分析报告";
            _self.createNewsProportionChart();
            _self.createSentiementProportionChart();
            _self.createSentimentMediaRankChart();
            _self.createMediaInfluenceRank();

        },

        createNewsProportionChart(){

            var _self = this;
            var option = {
                title : {
                    text: '各分类下新闻所占比',
                    x:'center',
                    textStyle: {
                        color: '#ff6600'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['社会新闻','招生考试','社团活动','学习学术']
                },
                series : [
                    {
                        //name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:_self.universityNewsInfo.socialNumber[3], name:'社会新闻'},
                            {value:_self.universityNewsInfo.entranceNumber[3], name:'招生考试'},
                            {value:_self.universityNewsInfo.activityNumber[3], name:'社团活动'},
                            {value:_self.universityNewsInfo.studyNumber[3], name:'学习学术'},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            var newsProportionChart = echarts.init(document.getElementById('newsProportion'),'shine');
            newsProportionChart.setOption(option);
            var _self = this;
            axios({
                method: 'get',
                url: '/api/v1/newsnumber',
                params:{
                    query:{
                        "Uname":universityTitleApp.title
                    }
                }
            }).then(function(res){

                newsProportionChart.setOption({
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:res.data[0].socialNumber[3], name:'社会新闻'},
                                {value:res.data[0].entranceNumber[3], name:'招生考试'},
                                {value:res.data[0].activityNumber[3], name:'社团活动'},
                                {value:res.data[0].studyNumber[3], name:'学习学术'},
                            ]
                        }
                    ]
                })
            });
        },
        createSentiementProportionChart(){

            var _self = this;
            var option = {

                title : {
                    text: '各分类下文本情感倾向比例',
                    x:'center',
                    textStyle: {
                        color: '#ff6600'
                    }
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    left:'left',
                    data: ['正面情感', '中性情感','负面情感']
                },
                grid: {
                    left: '10%',
                    right: '4%',
                    bottom: '2%',
                    containLabel: true
                },
                xAxis:  {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: ['社会新闻','招生考试','社团活动','学习学术']
                },
                series: [
                    {
                        name: '正面情感',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 302, 301, 334]
                    },
                    {
                        name: '中性情感',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 132, 101, 134]
                    },
                    {
                        name: '负面情感',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [220, 182, 191, 234]
                    }
                ]
            };
            var sentimentProportionChart = echarts.init(document.getElementById('sentimentProportion'),'shine');
            sentimentProportionChart.setOption(option);
            var _self = this;
            axios({
                method: 'get',
                url: '/api/v1/newsnumber',
                params:{
                    query:{
                        "Uname":universityTitleApp.title
                    }
                }
            }).then(function(res){

                console.log(res.data)

                sentimentProportionChart.setOption({
                    series : [
                        {
                            name: '正面情感',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [res.data[0].socialNumber[2], res.data[0].entranceNumber[2], res.data[0].activityNumber[2], res.data[0].studyNumber[2]]
                        },
                        {
                            name: '中性情感',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [res.data[0].socialNumber[1], res.data[0].entranceNumber[1], res.data[0].activityNumber[1], res.data[0].studyNumber[1]]
                        },
                        {
                            name: '负面情感',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [res.data[0].socialNumber[0], res.data[0].entranceNumber[0], res.data[0].activityNumber[0], res.data[0].studyNumber[0]]
                        }
                    ]
                })
            });
        },

        createSentimentMediaRankChart(){

            var _self = this;
            var option = {


                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ["a","b","c"],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name : "正面新闻量",
                        type : 'bar',
                        barWidth : '60%',
                        data : [0,0,0]
                    }
                ]
            };
            var postiveMediaRankChart = echarts.init(document.getElementById('postiveMediaRank'),'shine');
            var neuMediaRankChart = echarts.init(document.getElementById('neuMediaRank'),'shine');
            var negMediaRankChart = echarts.init(document.getElementById('negMediaRank'),'shine');
            postiveMediaRankChart.setOption(option);
            neuMediaRankChart.setOption(option);
            negMediaRankChart.setOption(option);
            axios({
                method: 'get',
                url: '/api/sentimentrank',
				headers:{
                	"Content-type":"applicatoin/json"
				},
                params:{

                        "Uname":universityTitleApp.title,
						"sentiment":"1",
						"limit":5

                }
            }).then(function(res){
				var mediaList = [];
                var mediaTotalList = [];

                for(var i = 0; i < res.data.length;i++){
                	mediaList.push(res.data[i]["_id"]);
                	mediaTotalList.push(res.data[i]["total"]);
				}
                postiveMediaRankChart.setOption({
                    color: ['#66CD00'],
                    title:{
                        text:'报道正面新闻的媒体排名',
                        x:"center",
                        textStyle:{
                            color:"#ff6600"
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : mediaList,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],

                    series : [
                        {
                            name : "正面新闻量",
                            type : 'bar',
                            barWidth : '60%',
                            data : mediaTotalList
                        }
                    ]
                })
            });

            axios({
                method: 'get',
                url: '/api/sentimentrank',
                headers:{
                    "Content-type":"applicatoin/json"
                },
                params:{

                    "Uname":universityTitleApp.title,
                    "sentiment":"0",
                    "limit":5

                }
            }).then(function(res){
                var mediaList = [];
                var mediaTotalList = [];

                for(var i = 0; i < res.data.length;i++){
                    mediaList.push(res.data[i]["_id"]);
                    mediaTotalList.push(res.data[i]["total"]);
                }
                neuMediaRankChart.setOption({
                    color: ['#7EC0EE'],
                    title:{
                        text:'报道中性新闻的媒体排名',
                        x:"center",
                        textStyle:{
                            color:"#ff6600"
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : mediaList,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],

                    series : [
                        {
                            name : "中性新闻量",
                            type : 'bar',
                            barWidth : '60%',
                            data : mediaTotalList
                        }
                    ]
                })
            });

            axios({
                method: 'get',
                url: '/api/sentimentrank',
                headers:{
                    "Content-type":"applicatoin/json"
                },
                params:{

                    "Uname":universityTitleApp.title,
                    "sentiment":"-1",
                    "limit":5

                }
            }).then(function(res){
                var mediaList = [];
                var mediaTotalList = [];

                for(var i = 0; i < res.data.length;i++){
                    mediaList.push(res.data[i]["_id"]);
                    mediaTotalList.push(res.data[i]["total"]);
                }
                negMediaRankChart.setOption({
					color:["#FF6347"],
                    title:{
                        text:'报道负面新闻的媒体排名',
                        x:"center",
                        textStyle:{
                            color:"#ff6600"
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : mediaList,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    series : [
                        {
                            name : "负面新闻量",
                            type : 'bar',
                            barWidth : '60%',
                            data : mediaTotalList
                        }
                    ]
                })
            });
        },

        createMediaInfluenceRank(){
            var _self = this;
            var option = {

                color: ['#CD0000'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ["a","b","c"],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name : "正面新闻量",
                        type : 'bar',
                        barWidth : '60%',
                        data : [0,0,0]
                    }
                ]
            };
            var mediaInfluenceRankChart = echarts.init(document.getElementById('mediaInfluenceRank'),'shine');
            mediaInfluenceRankChart.setOption(option);

            axios({
                method: 'get',
                url: '/api/mediainfluence',
                headers:{
                    "Content-type":"applicatoin/json"
                },
                params:{
                    "Uname":universityTitleApp.title,
                    "limit":5
                }
            }).then(function(res){
                var mediaList = [];
                var mediaScoreList = [];

                for(var i = 0; i < res.data.length;i++){
                    mediaList.push(res.data[i]["media"]);
                    mediaScoreList.push(res.data[i]["score"]);
                }
                mediaInfluenceRankChart.setOption({
                    title:{
                        text:'媒体扩散的影响力排名',
                        x:"center",
                        textStyle:{
                            color:"#ff6600"
                        }
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : mediaList,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],

                    series : [
                        {
                            name : "影响力分数",
                            type : 'bar',
                            barWidth : '60%',
                            data : mediaScoreList
                        }
                    ]
                })
            });

		}
    }
});

// formApp.initSettings();
chartsApp.initCharts();








