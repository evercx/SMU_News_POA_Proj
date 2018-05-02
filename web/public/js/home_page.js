


axios.get('/api/v1/news/count').then(function(res){
	$("#numbers").text(res.data.count)
})

setInterval(function(){

	str = "截止" +new Date().toLocaleString() + " 系统共采集了"+$("#numbers").text()+"条数据";
	$("#info").text(str)
},1000)
