

// //输入框数据的Vue实例
// var inputFormApp = new Vue({
// 	el:"#inputForm",
// 	data:{
// 		textarea:'helloworld'
// 	},
// 	methods: {
// 	},
// 	computed:{
// 	}
// });
//
// //输出框数据的Vue实例
// var inputFormApp = new Vue({
// 	el:"#outputForm",
// 	data:{
// 		textarea:'helloworld'
// 	},
// 	methods: {
// 	},
// 	computed:{
// 	}
// });

var formApp = new Vue({
    el:"#form",
    data:{
        inputContent:'',
        outputObj:{
            code:"0",
            sentiment:'',
            classification:''
        },
        loading:false
    },
    computed:{
        outputContent:function(){
            if(this.outputObj.code === "0") return '';
            if(this.outputObj.code === "200"){
                var str = '';
                str += "<br><br><br><h2 style='text-align:center;'>新闻类别:"+this.outputObj.classification+"</h2><br>";
                str += "<h2 style='text-align:center;'>情感分类:"+this.outputObj.sentiment+"</h2><br>";
                return str;

            }else{
                return "<br><br><br><br><br><h2 style='text-align:center;'>分析失败 请重试</h2><br>";

            }

        }
    },
    methods:{
        analyzeText:function(){
            var _self = this;
            if(_self.inputContent.trim() === ''){
                alert("请填写文本");
                return;
            }
            this.loading = true;
			var requestConfig = {
				method: 'post',
				url: '/api/analyze',
                data:{
                    "text":_self.inputContent
                },
                headers: {
                    'Content-Type': 'application/json'
                }
			};
			axios(requestConfig).then(function (res) {
                console.log(res.data);
				_self.loading = false;
                _self.outputObj.code = res.data.code;
                if(res.data.code === "200"){
                    _self.outputObj.sentiment = res.data.result.sentiment;
                    _self.outputObj.classification = res.data.result.classification;
                }
			}).catch(function(){
                _self.loading = false;
            })
        }
    }
});