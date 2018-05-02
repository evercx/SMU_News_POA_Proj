

$(function () {
	//$("tbody").empty();
	

	//获取海事大学相关数据
	//查询字符串需要通过data字段传参,不能使用字符串拼接的方式。在IE11下不支持字符串拼接!
	$.ajax({
		url:'/api/v1/newsnumber',
		type:'GET',
		data:{"query":'{"Uname":"上海海事大学"}'},
		async:false,
		success:function(data,status){
			console.log(data)
			var study= {
				total:data[0].studyNumber[3],
				postive:data[0].studyNumber[2],
				neutral:data[0].studyNumber[1],
				negative:data[0].studyNumber[0]
			};
			var activity = {
				total:data[0].activityNumber[3],
				postive:data[0].activityNumber[2],
				neutral:data[0].activityNumber[1],
				negative:data[0].activityNumber[0]
			};
			var entrance = {
				total:data[0].entranceNumber[3],
				postive:data[0].entranceNumber[2],
				neutral:data[0].entranceNumber[1],
				negative:data[0].entranceNumber[0]
			};
			var social = {
				total:data[0].socialNumber[3],
				postive:data[0].socialNumber[2],
				neutral:data[0].socialNumber[1],
				negative:data[0].socialNumber[0],
			};

			$("#smu").empty();
			$("#smu").append(createSMUTr(study,activity,entrance,social));
		}
	});


	var originData = {
		total:0,
		postive:0,
		neutral:0,
		negative:0
	};

	//渲染5个高校信息
	for (var i = 0;i<5;i++){
		$("tbody").append(createNewsNumberTr(i,originData,originData,originData,originData));
		$("#select"+i).get(0).selectedIndex = i;
	};
	$(".form-control").append(createCollegesOptions());

	//给当前选项值赋初值
	for (var i = 0;i<5;i++){
		$("#select"+i).get(0).selectedIndex = i;
		$("#select"+i).parent().parent(".result").attr("name",$("#select"+i).val());
		var queryString = {"query":'{"Uname":"'+$("#select"+i+" option:selected").text()+'"}'};
		var url = '/api/v1/newsnumber';
		$.ajax({
			url:url,
			type:'GET',
			async:false,
			data:queryString,
			success:function(data){
				var study= {
					total:data[0].studyNumber[3],
					postive:data[0].studyNumber[2],
					neutral:data[0].studyNumber[1],
					negative:data[0].studyNumber[0]
				};
				var activity = {
					total:data[0].activityNumber[3],
					postive:data[0].activityNumber[2],
					neutral:data[0].activityNumber[1],
					negative:data[0].activityNumber[0]
				};
				var entrance = {
					total:data[0].entranceNumber[3],
					postive:data[0].entranceNumber[2],
					neutral:data[0].entranceNumber[1],
					negative:data[0].entranceNumber[0]
				};
				var social = {
					total:data[0].socialNumber[3],
					postive:data[0].socialNumber[2],
					neutral:data[0].socialNumber[1],
					negative:data[0].socialNumber[0],
				};
				updateCollegesNumber($("#select"+i),study,activity,entrance,social)

			}
		});

	};



	// $(".result").dblclick(function(){
	// 	var correntCollegeName = $(this).attr("name");
	// 	window.location.href="/news?type="+correntCollegeName;
	// });

	$("select").change(function(){
		var object = $(this);
		var en = $(this).val();
		var ch = school_list[en];
		$(this).parent().parent(".result").attr("name",en);
		var queryString = {"query":'{"Uname":"'+ch+'"}'};
		$.ajax({
			url:'/api/v1/newsnumber',
			type:'GET',
			data:queryString,
			success:function(data){
				console.log(data);
				var study= {
					total:data[0].studyNumber[3],
					postive:data[0].studyNumber[2],
					neutral:data[0].studyNumber[1],
					negative:data[0].studyNumber[0]
				};
				var activity = {
					total:data[0].activityNumber[3],
					postive:data[0].activityNumber[2],
					neutral:data[0].activityNumber[1],
					negative:data[0].activityNumber[0]
				};
				var entrance = {
					total:data[0].entranceNumber[3],
					postive:data[0].entranceNumber[2],
					neutral:data[0].entranceNumber[1],
					negative:data[0].entranceNumber[0]
				};
				var social = {
					total:data[0].socialNumber[3],
					postive:data[0].socialNumber[2],
					neutral:data[0].socialNumber[1],
					negative:data[0].socialNumber[0],
				};
				updateCollegesNumber(object,study,activity,entrance,social)
			}
		})
	});


	$("button").click(function(){
		var correntCollegeName = $(this).parent().parent(".result").attr("name");
		window.location.href="/news?type="+correntCollegeName;
	});

});



function createSMUTr(class1,class2,class3,class4){

	var divString = '';

	divString =
		 '<td>&nbsp;&nbsp;上海海事大学</td>'
		+'<td class="active">'+class1.total+'</td>'+'<td class="success">'+class1.postive+'</td>'+'<td class="info">'+class1.neutral+'</td>'+'<td class="danger">'+class1.negative+'</td>'
		+'<td class="active">'+class2.total+'</td>'+'<td class="success">'+class2.postive+'</td>'+'<td class="info">'+class2.neutral+'</td>'+'<td class="danger">'+class2.negative+'</td>'
		+'<td class="active">'+class3.total+'</td>'+'<td class="success">'+class3.postive+'</td>'+'<td class="info">'+class3.neutral+'</td>'+'<td class="danger">'+class3.negative+'</td>'
		+'<td class="active">'+class4.total+'</td>'+'<td class="success">'+class4.postive+'</td>'+'<td class="info">'+class4.neutral+'</td>'+'<td class="danger">'+class4.negative+'</td>'
		+'<td class="warning"><button type="button" class="btn btn-primary btn-sm">动态</button></td>'
	return divString;
}


//参数分别为：选择框的索引一般从0开始、学习学术的数据（含积极(postive)，中性(neutral)，消极(negative)三个字段的js对象，(后同))、招生考试的数据、社团活动的数据、社会新闻的数据
function createNewsNumberTr(selectIndex,class1,class2,class3,class4){

	var divString = '';

	divString = '<tr name="" class="result">'
				+'<td><select class="form-control" id="select'+selectIndex+'" style="width:100%"></select></td>'
				+'<td class="active">'+class1.total+'</td>'+'<td class="success">'+class1.postive+'</td>'+'<td class="info">'+class1.neutral+'</td>'+'<td class="danger">'+class1.negative+'</td>'
				+'<td class="active">'+class2.total+'</td>'+'<td class="success">'+class2.postive+'</td>'+'<td class="info">'+class2.neutral+'</td>'+'<td class="danger">'+class2.negative+'</td>'
				+'<td class="active">'+class3.total+'</td>'+'<td class="success">'+class3.postive+'</td>'+'<td class="info">'+class3.neutral+'</td>'+'<td class="danger">'+class3.negative+'</td>'
				+'<td class="active">'+class4.total+'</td>'+'<td class="success">'+class4.postive+'</td>'+'<td class="info">'+class4.neutral+'</td>'+'<td class="danger">'+class4.negative+'</td>'
				+'<td class="warning"><button type="button" class="btn btn-primary btn-sm">动态</button></td>'
				+'</tr>';
	return divString;
}



function createCollegesOptions(){

	var optionString = '';

	for(o in school_list){
		if( school_list[o] === "上海海事大学"){
			continue;
		}
		optionString += '<option value="'+o+'">'+school_list[o]+'</option>';
	}

	return optionString;
}

//参数分别为：选择框的当前对象(一般在select的change事件里直接传入$(this))、学习学术的数据（含积极(postive)，中性(neutral)，消极(negative)三个字段的js对象，(后同))、招生考试的数据、社团活动的数据、社会新闻的数据
function updateCollegesNumber(selectObject,class1,class2,class3,class4){


	var dataTdClass1 = selectObject.parent('td').next();
	var dataTdClass2 = dataTdClass1.next().next().next().next();
	var dataTdClass3 = dataTdClass2.next().next().next().next();
	var dataTdClass4 = dataTdClass3.next().next().next().next();

	dataTdClass1.text(class1.total);
	dataTdClass1.next().text(class1.postive);
	dataTdClass1.next().next().text(class1.neutral);
	dataTdClass1.next().next().next().text(class1.negative);

	dataTdClass2.text(class2.total);
	dataTdClass2.next().text(class2.postive);
	dataTdClass2.next().next().text(class2.neutral);
	dataTdClass2.next().next().next().text(class2.negative);

	dataTdClass3.text(class3.total);
	dataTdClass3.next().text(class3.postive);
	dataTdClass3.next().next().text(class3.neutral);
	dataTdClass3.next().next().next().text(class3.negative);

	dataTdClass4.text(class4.total);
	dataTdClass4.next().text(class4.postive);
	dataTdClass4.next().next().text(class4.neutral);
	dataTdClass4.next().next().next().text(class4.negative);

}
