var App = {
	apiBasePath: "/api/", 	//接口地址
	// apiBasePath:"http://okyc-bus.utools.club/api/",
	rootPath: getRootPath(),				//项目根目录地址
	filePath: '/upload/',
	timestamp: ((Date.parse(new Date())) / 1000).toString(),	//时间戳
};

/* 获取url地址参数  */
function getQueryString(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
};
//查看帮助
$(".right p:last-child ").click(function(){
	if(localStorage.getItem("userErr") == 403){
		layer.msg('请登录后查看！', {
			icon: 5
		});
	}else{
		openUrl('userHelp.html');
	}
})
// 使用jQuery处理:  
function imgError(image){  
	$(image).attr("src","http://tc.lihail.cn/kong.png"); 
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
			if(rsp.code == 200){
				def.resolve(rsp);
			}else if(rsp.code == 403) {
				localStorage.setItem("userErr",rsp.code);
				$(".topLoginBox").show().find("a").show();
				$(".userTop").hide();
			}else{
				layer.msg(rsp.msg, {
					icon: 5
				});
			}
		}, function (error) {
			if (error.status == 504) {
				layer.msg('请求超时，请重试!', {
					icon: 5
				});
			} else if (error.responseText) {
				var err = JSON.parse(error.responseText);
				var code = err.code; // 错误码
				var emsg = err.msg; // 错误内容提示（字符串）
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
					case 10009: // 10009 创建支付信息失败
						layer.msg(emsg+'，请联系管理员！', {
							icon: 5
						});
						break;
				}
			}
			def.reject(error);
			setTimeout(function () {
				layer.close(loading);
			}, 100)
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


//收藏
function addFavorite() {
	var url = window.location;
	var title = document.title;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("360se") > -1) {
		layer.msg("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
	} else if (ua.indexOf("msie 8") > -1) {
		window.external.AddToFavoritesBar(url, title); //IE8
	} else if (document.all) { //IE类浏览器
		try {
			window.external.addFavorite(url, title);
		} catch (e) {
			layer.msg('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
		}
	} else if (window.sidebar) { //firfox等浏览器；
		window.sidebar.addPanel(title, url, "");
	} else {
		layer.msg('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
	}
};

// 引入公共的底部
$("#footer").load("../page/footer.html");

//搜索切换
$(".searchBox .toptab span").click(function () {
	$(this).addClass("active").siblings().removeClass("active");
});
// 点击头部搜索
$(".searchBox .search span").click(function () {
	var key = $(".searchBox .search input").val();
	var _index = $(".searchBox .toptab .active").index();
	if(key){
		if(_index == 0){
			openUrl('drugList.html?key='+encodeURI(encodeURI(key))+'&index='+_index+'')
		}else if(_index == 1){
			openUrl('materialsList.html?key='+encodeURI(encodeURI(key))+'&index='+_index+'')
		}else{
			openUrl('facilityList.html?key='+encodeURI(encodeURI(key))+'&index='+_index+'')
		}
	}else{
		layer.msg('请先输入关键词！', {
			icon: 5
		});
	};
})

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
		data[x] = '会员可见';
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
function FunNull(data) {
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
			data[x] = FunNull(data[x])
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
		}else{
			layer.msg(data.msg, {
				icon: 5
			});
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
	get_user_info();
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
			localStorage.removeItem("userErr");
		}
	}, function (err) {
		
	})
};

//当页面加载状态为完全结束时进入 
// document.onreadystatechange = function () {
// 	if (document.readyState == "complete") {
	//20分钟更新一次token
	//setInterval(function () {
		update_token();
	//},30000);
	// }
// }
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
		if(data.code == 200) {//直接输出资源文件
			location.href = ''+App.apiBasePath+'resource/download?id='+id+'';
		}else if(data.code == 403){
			layer.msg('请先登录！', {
				icon: 5
			},function(){
				location.href = 'login.html';
			});
		}else if(data.code == 10007){
			location.href = 'buyBook.html?id='+id+'&operationType=download';
		}else if(data.code == 0){
			location.href = ''+App.apiBasePath+'resource/download?id='+id+'';
		}else if(data.code == 10011){//未提交报名材料,跳转到报名材料提交页
			layer.open({
				type: 1,
				shade: false,
				title: '申请下载', //不显示标题
				area: ['550px'], //宽高
				content: $('.application'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
				cancel: function(){
					
				}
			});
		}else if(data.code == 10012){//报名材料审核中
			layer.msg(data.msg, {
				icon: 5
			});
		}else{
			layer.msg(data.msg, {
				icon: 5
			});
		}
	}, function(err) {
		
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
		}else{
			layer.msg(data.msg, {
				icon: 5
			});
		}
	}, function(err) {
		
	})
};

//友情链接
friendLinkList();
function friendLinkList(){
	http.ajax({
		url: 'friend_link/list',
		type: 'GET',
		json: false,
		mask: false,
		data: {
			pageNo:'1',
			pageSize:'7'
		}
	}).then(function(data) {
		if(data.code == 200) {
			var innerHTML = ""
			for (var i = 0; i < data.data.items.length; i++) {
				innerHTML +='<a target="_blank" href="'+data.data.items[i].url+'">'+data.data.items[i].webName+'</a>';
			};
			$("#linkList").append(innerHTML);
		}
	}, function(err) {
		
	})
};

//采购活动
function rchasingActivities(){
	http.ajax({
		url: 'news/get_news_list_by_type_id',
		type: 'GET',
		json: false,
		mask: false,
		data: {
			typeId: 20,
			pageNo: 1,
			pageSize: 10,
			purchaseStatus:"",
			openTime:"",
			endTime:"",
			searchkey:""
		}
	}).then(function(data) {
		if(data.code == 200) {
			var innerHTML = ""
			for (var i = 0; i < data.data.items.length; i++) {
				innerHTML +='<li id="'+data.data.items[i].id+'"><span>'+(i+1)+'</span><p>'+data.data.items[i].title+'</p></li>'
			};
			$("#rchasingActivitiesList").append(innerHTML);
			$("#rchasingActivitiesList li").click(function(){
				var purchaseId = $(this).attr("id");
				openUrl('purchase.html?purchaseId='+purchaseId+'');
			})
		}
	}, function(err) {
		
	})
};

//招标信息
function biddingAcAtivities(){
	http.ajax({
		url: 'news/get_news_list_by_type_id',
		type: 'GET',
		json: false,
		mask: false,
		data: {
			typeId: 7,
			pageNo: 1,
			pageSize: 10,
			purchaseStatus:"",
			openTime:"",
			endTime:"",
			searchkey:""
		}
	}).then(function(data) {
		if(data.code == 200) {
			var innerHTML = ""
			for (var i = 0; i < data.data.items.length; i++) {
				innerHTML +='<li id="'+data.data.items[i].id+'"><span>'+(i+1)+'</span><p>'+data.data.items[i].title+'</p></li>'
			};
			$("#rchasingActivitiesList").append(innerHTML);
			$("#rchasingActivitiesList li").click(function(){
				var purchaseId = $(this).attr("id");
				openUrl('callForBids.html?purchaseId='+purchaseId+'');
			})
		}
	}, function(err) {
		
	})
};

function IsPC(){
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//分享到微信
function weixin(_this) {
	var url = "http://web.okyc.net"+$(_this).attr("id");
	console.log(url)
    layer.open({
        type: 1,
        skin: 'layui-layer-demo', //样式类名
        closeBtn: 1, //不显示关闭按钮
        anim: 1,
        title: '扫一扫分享朋友圈', //不显示标题
        shadeClose: true, //开启遮罩关闭
        content: ' <div id="code" style="padding: 10px;"></div>'
    });
    $('#code').qrcode({text: url});
}


//分享到新浪微博
function shareToXl(_this) {
	var title = $(_this).attr("bt");
	var url = "http://web.okyc.net"+$(_this).attr("id");
	var picurl = $(_this).parent(".imgbox").find("img").attr("src");
    var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
    window.open(sharesinastring, 'newwindow', 'height=400,width=400,top=100,left=100');
}

//分享到qq空间
function shareToQq(_this) {
	var title = $(_this).attr("bt");
	var url = "http://web.okyc.net"+$(_this).attr("id");
	var picurl = $(_this).parent(".imgbox").find("img").attr("src");
	var summary = $(_this).parent("p").text();
    var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + summary + '&title=' + title + '&url=' + url + '&pics=' + picurl;
    window.open(shareqqzonestring, 'newwindow', 'height=400,width=400,top=100,left=100');
}