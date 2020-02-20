var App = {
	apiBasePath: "http://okyc-business.utools.club/", 	//接口地址
	rootPath: getRootPath(),				//项目根目录地址
	pagePath:getRootPath()+'/mobile/page/',
	filePath: 'http://okyc-business.utools.club/',
	timestamp: ((Date.parse(new Date())) / 1000).toString(),	//时间戳
};
// H5调试工具
// $.ajax({
// 	url: App.rootPath + '/mobile/js/eruda.js',
// 	async: false,
// 	dataType: "script",
// 	success: function () {
// 		eruda.init();
// 	}
// });
/* 获取url地址参数  */
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
};
// 使用jQuery处理:  
function imgError(image){  
    $(image).attr("src", getRootPath()+"/img/kong.png");  
}  
/* 打开新页面 */
function openUrl(url,type) {
	if (!type) {
		window.location.href = url;
	} else {
		window.open(url)
	};
};
/** ajax封装
    url: 请求接口地址,
    type: 请求类型 POST GET,
    json: 数据请求方式,
    mask: 是否有loading,
    data: 请求参数
 */
var http = {
	ajax:function(options){
		var loading = '';
		var def = $.Deferred();
		if (options.mask) {
			loading = layer.msg('加载中，请稍后...', {
				icon: 16,
				shade: 0.01,
				time: 0
			});
		}
		$.ajax({
			url: App.apiBasePath + options.url,
			data: options.data,
			type: options.type,
			xhrFields:{
				withCredentials:true 
			},
			contentType: options.json ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded',
		}).then(function (rsp) {
			def.resolve(rsp);
			setTimeout(function () {
				layer.close(loading);
			}, 100)
			// 引入公共的底部
			$("#footer").load(App.pagePath+"footerH5.html");
			console.log(App.pagePath+"footerH5.html")
		}, function (error) {
			if (error.status == 504) {
				layer.msg('请求超时，请重试!', {
					icon: 5
				});
			} else if (error.responseText) {
				var err = JSON.parse(error.responseText);
				var code = err.code; // 错误码
				var emsg = err.message; // 错误内容提示（字符串）
				switch (code) {
					case 500: // 500 服务器错误
						layer.msg('服务器发生错误，请联系管理员！', {
							icon: 5
						});
						break;
					case 403: // 403 未登录
//						layer.msg('登录失效，请重新登录！', {
//							icon: 5
//						},function(){
//							location.href = 'login.html';
//						});
						break;
					case 401: // 401 登录失败
						layer.msg('登录失败！', {
							icon: 5
						});
						break;
					case 10002: // 10002 注册失败
						layer.msg('用户注册失败！', {
							icon: 5
						});
						break;
					case 10000: // 10000 手机号已存在
						layer.msg('手机号已存在！', {
							icon: 5
						});
						break;
					case 10001: // 10001 验证码发送失败
						layer.msg('验证码发送失败！', {
							icon: 5
						});
						break;
					case 10003: // 10003 更改手机号失败
						layer.msg('更改手机号失败', {
							icon: 5
						});
						break;
					case 10004: // 10004 更新失败
						layer.msg('更新失败', {
							icon: 5
						});
						break;
				}
			}
			def.reject(error);
			setTimeout(function () {
				layer.close(loading);
			}, 100);
			
		});
		return def;
	}
}


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
function getRootPath() {
	// 获取当前网址
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
};


// 展开导航栏
$(".header .more").click(function () {
	if ($(this).siblings("section").hasClass("openBox")) {
		$(this).siblings("section").removeClass("openBox")
	} else {
		$(this).siblings("section").addClass("openBox")
	}
});

//表单重新渲染
function renderForm() {
	layui.use('form', function() {
		var form = layui.form;
		form.render();
	});
};

//处理返回的数据为null时候，设置为暂无
function beNull(data) {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 '暂无'
		data[x] = '暂无';
		} else {
		// if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
		// 	data[x] = data[x].map(z => {
		// 	return beNull(z);
		// 	});
		// }
		if(typeof(data[x]) === 'object'){ // 是json 递归继续处理
			data[x] = beNull(data[x])
		}
		}
	}
	return data;
};

//获取手机验证码
function send_verify_code(phone,type) {
	http.ajax({
		url: 'user/send_verify_code',
		type: 'POST',
		json: false,
		mask: true,
		data: {
			phone: phone,
			type: type,
		}
	}).then(function (data) {
		if (data.code == 200) {
			layer.msg('验证码发送成功！');
		}
	}, function (err) {
		console.log(err);
	})
};

//获取用户详情
// if(localStorage.getItem("phone")){
// 	$(".topLoginBox").show().find("a").hide();
// 	$(".userTop").show().css("margin-left","0");
// }else{
// get_user_info();
// }

function get_user_info() {
	http.ajax({
		url: 'user/get_user_info',
		type: 'GET',
		json: false,
		mask: false,
	}).then(function (data) {
		if (data.code == 200) {
			$(".topLoginBox").show().find("a").hide();
			$(".userTop").show().css("margin-left","0");
			localStorage.setItem("phone",data.data.phone);
		}
	}, function (err) {
		if (err.status) {
			$(".topLoginBox").show().find("a").show();
			$(".userTop").hide();
		}
	})
};

//当页面加载状态为完全结束时进入 
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
	//20分钟更新一次token
	//setInterval(function () {
		update_token();
	//},30000);
	}
}
//更新用户token
function update_token(){
	http.ajax({
		url: 'user/update_token',
		type: 'GET',
		json: false,
		mask: false,
	}).then(function (data) {
		if (data.code == 200) {
			
		}
	}, function (err) {
		if(err.status == 403){
			$(".topLoginBox").show().find("a").show();
			$(".userTop").hide();
		}
	})
};

//验证码倒计时
function countDownCode(){
    var num = 60;
    var timer = setInterval(function () {
        if (num > 1) {
            num--;
			$(".getCode").text("重新发送(" + num + ")").attr("disabled", "disabled");
			$(".getCode").css('background', '#B8B8B8');
        } else {
			$(".getCode").text("获取短信验证码").removeAttr("disabled");
			$(".getCode").css('background', '#195edd');
            clearInterval(timer);
        }
    }, 1000)
}

//标书下载
function download(id){
	http.ajax({
		url: 'resource/download',
		type: 'GET',
		json: false,
		mask: true,
		data: {
			id:id
		}
	}).then(function(data) {
		if(data.code == 200) {
			
		}
	}, function(err) {
		if(err.status == 403){
			layer.msg('请先登录！', {
				icon: 5
			},function(){
				location.href = 'login.html';
			});
		}else if(err.status == 10007){
			location.href = 'buyBook.html?id='+id+'&operationType=download';
		}
	})
};

//退出登录接口
function logout(){
	http.ajax({
		url: 'user/logout',
		type: 'GET',
		json: false,
		mask: true,

	}).then(function(data) {
		if(data.code == 200) {
			layer.msg('退出成功！');
			location.href = 'login.html';
		}
	}, function(err) {
		
	})
};


