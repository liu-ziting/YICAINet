var App = {
	modulePath:getRootPath()+"/mobile/GzbApp/module/",		//模块地址
	moduleIndex:getRootPath()+"/mobile/GzbApp/",	    	//模块地址
	apiBasePath:getRootPath()+"/service/v1/", 				//接口地址
	rootPath:getRootPath()+"/mobile/GzbApp/",				//项目根目录地址
	filePath:getRootPath(),									//附件地址
	timestamp:((Date.parse(new Date()))/1000).toString(),	//时间戳
	debug:"no"												//是否开启调试 yes/no
};
/* H5调试工具  */
if(App.debug == "yes"){
	$.ajax({
	   url: App.rootPath+'/js/eruda.js',
	   async: false,
	   dataType: "script",
	   success: function () {
	   	eruda.init();
	   }
	});
};

/* 获取url地址参数  */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/** ajax封装
    url: 请求接口地址,
    type: 请求类型 POST GET,
    json: 数据请求方式,
    mask: 是否有loading,
    data: 请求参数
 */
var http = {
	ajax(options) {
		var loading = '';
		let def = $.Deferred();
		if(options.mask) {
			loading = layer.msg('加载中，请稍后..', {
				icon: 16,
				shade: 0.01,
				time: 0
			});
		}
		$.ajax({
			url: '' + options.url,
			data: options.data,
			type: options.type,
			headers: {
				'x-auth-token': ''
			},
			contentType: options.json ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded'
		}).then(function(rsp) {
			def.resolve(rsp);
			setTimeout(function() {
				layer.close(loading);
			}, 100)
		}, function(error) {
			if(error.status == 504) {
				layer.msg('请求超时，请重试', {
					icon: 5
				});
			} else if(error.responseText) {
				var err = JSON.parse(error.responseText);
				var code = err.code; // 错误码
				var emsg = err.message; // 错误内容提示（字符串）
				console.log(err)
				switch(code) {
					case 2022: // 2022 掉线，重新登录
						layer.msg(emsg, {
							icon: 5
						}, function() {
							location.href = '/login.html';
						});
						break;
				}
			}
			def.reject(error);
			setTimeout(function() {
				layer.close(loading);
			}, 100)
		});
		return def;
	}
}
/* ajax调用 */
function types(){
	http.ajax({
		url: 'https://www.mxnzp.com/api/news/types',
		type: 'POST',
		json: false,
		mask: true, //是否有loading,
		data: {
	
		}
	}).then(function(data) {
		console.log(data);
		// 成功回调，data是成功回调参数
	}, function(err) {
		console.log(err);
		// 错误回调，err是错误回调参数
	})
};


/* 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS” */
function getNowFormatDate() { 
    var date = new Date(); 
    var seperator1 = "-"; 
    var seperator2 = ":"; 
    var month = date.getMonth() + 1; 
    var strDate = date.getDate(); 
    if (month >= 1 && month <= 9) { 
        month = "0" + month; 
    } 
    if (strDate >= 0 && strDate <= 9) { 
        strDate = "0" + strDate; 
    } 
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate 
            + " " + date.getHours() + seperator2 + date.getMinutes();
            //+ seperator2 + date.getSeconds(); 
    return currentdate; 
};


/* 获取当前项目根路径  */
function getRootPath(){
	// 获取当前网址
    var curWwwPath=window.document.location.href;
    // 获取主机地址之后的目录
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    // 获取主机地址
    var localhostPaht=curWwwPath.substring(0,pos);
    // 获取带"/"的项目名
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return (localhostPaht+projectName);
};

/* 判断是从哪个平台打开的页面 */
function parseUA() {
  var u = navigator.userAgent;
  var u2 = navigator.userAgent.toLowerCase();
  return { //移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1,
    //IE内核
    presto: u.indexOf('Presto') > -1,
    //opera内核
    webKit: u.indexOf('AppleWebKit') > -1,
    //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
    //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    //android终端或uc浏览器
    iPhone: u.indexOf('iPhone') > -1,
    //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1,
    //是否iPad
    webApp: u.indexOf('Safari') == -1,
    //是否web应该程序，没有头部与底部
    iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
    weixin: u2.match(/MicroMessenger/i) == "micromessenger",
    ali: u.indexOf('AliApp') > -1,
  };
}