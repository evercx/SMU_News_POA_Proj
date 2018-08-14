var urlParams = new URLSearchParams(window.location.search);



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



//标题幕布的Vue实例
var reportDetailTitleApp = new Vue({
	el: "#reportDetailTitle",
	data: {
		title: '',
	},
	created: function(){
		switch_sentiment = {
			"1": "正面",
			"0": "中性",
			"-1": "负面",
			"~": "所有"
		}
		this.title = urlParams.get("media") + " 对 " + urlParams.get("Uname") + " 的"
				+ switch_sentiment[String(urlParams.get("sentiment"))] + "报道"
	},
})



//搜索条件的表单Vue实例
var formApp = new Vue({
	el:"#formApp",
	data:{},
	methods: {
		onSubmit() {
			paginationApp.search();
		}
	}
});



//分页条Vue实例
var paginationApp= new Vue({
	el: '#paginationApp',
	data : {
		totalNumbers:0,
		pageSize:7,
		currentPage:1,
		queryOptions:{}
	},
	created: function(){
		this.queryOptions.media = urlParams.get("media")
		this.queryOptions.Uname = urlParams.get("Uname")
		this.queryOptions.sentiment = String(urlParams.get("sentiment"))
	},
	methods:{
		handleCurrentChange(val) {
			this.currentPage = val;
			var requestConfig = {
				method: 'get',
				url: '/api/v1/news',
				params:{
					limit:paginationApp.pageSize,
					skip:(val-1) * this.pageSize,
					sort:"-date",
					query:{
						"media":this.queryOptions.media,
						"sentiment":this.queryOptions.sentiment,
						"Uname":this.queryOptions.Uname
					}
				}
			}
			axios(requestConfig).then(function (res) {
				newsListApp.tableData = res.data;
			})
		},
		search(){
			var requestConfig = {
				method: 'get',
				url: '/api/v1/news/count',
				params:{
					query:{
						"media":this.queryOptions.media,
						"sentiment":this.queryOptions.sentiment,
						"Uname":this.queryOptions.Uname
					}
				}
			}
			axios(requestConfig).then(function (res) {
				paginationApp.totalNumbers = res.data.count;
			});

			this.currentPage = 1;
			var requestConfig = {
				method: 'get',
				url: '/api/v1/news',
				params:{
					limit:paginationApp.pageSize,
					skip:(this.currentPage-1) * this.pageSize,
					sort:"-date",
					query:{
						"media":this.queryOptions.media,
						"sentiment":this.queryOptions.sentiment,
						"Uname":this.queryOptions.Uname
					}
				}
			};
			axios(requestConfig).then(function (res) {
				newsListApp.tableData = res.data;
			});
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


paginationApp.search()
