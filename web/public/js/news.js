

$(function(){
	var correntCollegeName = getQueryString("type");
	if(correntCollegeName in school_list){
		$(".page-header h1").text(school_list[correntCollegeName] + "新闻动态");
	}else{
		window.location.href="/404";
	}

	var queryString = {"query":'{"school":"'+school_list[correntCollegeName]+'"}'}

	$.ajax({
		url:'api/v1/news',
		type:'GET',
		async:false,
		data:queryString,
		success:function(data,status){
			if(status === 'success'){
				for(var i = 0;i < data.length; i++){
					$(".col-md-8").append(createNewsDiv(data[i].title,data[i].url,data[i].date,classification[data[i].classification]));
				}
			}else{
				window.location.href="/404";
			}

		}
	})
	
})

$(function(){
	
	var originClassName = '';

	$(".panel").hover(function(){
		originClassName = $(this).attr("class");
		$(this).attr("class","panel panel-danger");
	}	
	,function(){
		$(this).attr("class",originClassName);
	})

	$(".panel").click(function(){
		var url = $(this).attr("url");
		window.location.href = url;
	})
})





//参数分别为：新闻标题、新闻地址、新闻发布时间、新闻类别
function createNewsDiv(title,url,date,classification){

	var divString = '';

	divString = '<div class="panel panel-primary" url="'+url+'">'
				+'<div class="panel-heading">'
				+'<h3 class="panel-title">'
				+'发布于：'
				+date
				+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				+'分类：'
				+classification
				+'</h3>'
				+'</div>'
				+'<div class="panel-body">'
				+'<h4>'
				+title
				+'</div>'
				+'</div>';
	return divString;
}






