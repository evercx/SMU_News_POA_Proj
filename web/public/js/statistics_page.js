
var paginationApp= new Vue({
	el: '#paginationApp',
	data : {
		totalNumbers:20,
		pageSize:5
	},
	methods:{
		handleCurrentChange(val) {
			//this.currentPage = val;
			var requestConfig = {
				method: 'get',
				url: '/api/v1/newsnumber',
				params:{
					limit:paginationApp.pageSize,
					skip:(val-1) * this.pageSize
				}
			}
			axios(requestConfig).then(function (res) {
				tableListApp.dataList = res.data;
			})
		}
	}
});


var tableListApp = new Vue({
	el:"#tableList",
	data:{
		dataList:[]
	},
	created:function() {
		var _self = this;
		var requestConfig = {
			method: 'get',
			url: '/api/v1/newsnumber',
			params:{
				limit:paginationApp.pageSize
			}
		}
		axios(requestConfig).then(function (res) {
			_self.dataList = res.data;
		})
	}
})





function getSocialCount(){
	return axios({
		method: 'get',
		url: '/api/v1/news/count',
		params:{
			query:{
				"classification":"social"
			}
		}
	})
}
function getActivityCount(){
	return axios({
		method: 'get',
		url: '/api/v1/news/count',
		params:{
			query:{
				"classification":"activity"
			}
		}
	})
}
function getEntranceCount(){
	return axios({
		method: 'get',
		url: '/api/v1/news/count',
		params:{
			"query":{
				"classification":"entrance"
			}
		}
	})
}
function getStudyCount(){
	return axios({
		method: 'get',
		url: '/api/v1/news/count',
		params:{
			query:{
				"classification":"study"
			}
		}
	})
}

var initNewsProportionChart = function(){
	var newsProportionOption = {

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
					{value:335, name:'社会新闻'},
					{value:310, name:'招生考试'},
					{value:234, name:'社团活动'},
					{value:135, name:'学习学术'},
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
	axios.all([getSocialCount(),getActivityCount(),getEntranceCount(),getStudyCount()])
		.then(axios.spread(function(socialRes,activityRes,entranceRes,studyRes){

			newsProportionChart.setOption({
				series : [
					{
						type: 'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:[
							{value:socialRes.data.count, name:'社会新闻'},
							{value:entranceRes.data.count, name:'招生考试'},
							{value:activityRes.data.count, name:'社团活动'},
							{value:studyRes.data.count, name:'学习学术'},
						]
					}
				]
			})
		}));

	newsProportionChart.setOption(newsProportionOption);
}();


var initNewsProportionChart = function(){
	var sentimentProportionOption = {

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
	axios({
		method: 'get',
		url: '/api/v1/newsnumber'
	}).then(function(res){

		var PosList = [0,0,0,0];
		var NeuList = [0,0,0,0];
		var NegList = [0,0,0,0];

		for(var index in res.data){

			PosList[0] = PosList[0] + res.data[index].socialNumber[2];
			PosList[1] = PosList[1] + res.data[index].entranceNumber[2];
			PosList[2] = PosList[2] + res.data[index].activityNumber[2];
			PosList[3] = PosList[3] + res.data[index].studyNumber[2];

			NeuList[0] = NeuList[0] + res.data[index].socialNumber[1];
			NeuList[1] = NeuList[1] + res.data[index].entranceNumber[1];
			NeuList[2] = NeuList[2] + res.data[index].activityNumber[1];
			NeuList[3] = NeuList[3] + res.data[index].studyNumber[1];

			NegList[0] = NegList[0] + res.data[index].socialNumber[0];
			NegList[1] = NegList[1] + res.data[index].entranceNumber[0];
			NegList[2] = NegList[2] + res.data[index].activityNumber[0];
			NegList[3] = NegList[3] + res.data[index].studyNumber[0];
		};


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
					data:PosList
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
					data: NeuList
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
					data: NegList
				}
			]
		})
	})
	sentimentProportionChart.setOption(sentimentProportionOption);

}();


