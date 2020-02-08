// 搜索
$(".searchBox .search span").click(function () {
	var key = $(".searchBox .search input").val();
	if(key){
		if($(".searchBox .toptab .active").index() == 0){
			openUrl('page/drugList.html?key='+encodeURI(encodeURI(key))+'')
		}else{
			openUrl('page/materialsList.html?key='+encodeURI(encodeURI(key))+'')
		}
	}else{
		layer.msg('请先输入关键词！', {
			icon: 5
		});
	};
})

//采购信息类型
purchasingInformation();
function purchasingInformation() {
    http.ajax({
        url: 'news/news_class_list',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            type: "招标采购信息"
        }
    }).then(function (data) {
        if (data.code == 200) {
            var iHTML = ""
            for (var i = 0; i < data.data.items.length; i++) {
                iHTML += '<li id="' + data.data.items[i].id + '"><p>' + data.data.items[i].name + '</p></li>'
            };
            $("#pfTitleList").append(iHTML);
            $("#pfTitleList li:first-child").addClass("layui-this");
            purchasingInformationList(data.data.items[0].id);
            $("#pfTitleList li").click(function () {
                var typeId = $(this).attr("id");
                purchasingInformationList(typeId);
            })
        }
    }, function (err) {

    });
};
//采购信息列表
function purchasingInformationList(typeId) {
    document.getElementById("pfList").innerHTML = "";
    var indexLoad = layer.load(2, { shade: false });
    http.ajax({
        url: 'news/get_news_list_by_type_id',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            typeId: typeId,
            pageNo: 1,
            pageSize: 7,
            purchaseStatus: "",
            openTime: "",
            endTime: "",
            searchkey: "",
        }
    }).then(function (data) {
        if (data.code == 200) {
            layer.close(indexLoad);
            var iHTML = ""
            for (var i = 0; i < data.data.items.length; i++) {
                iHTML += "<li id=" + data.data.items[i].id + ">";
                if (data.data.items[i].purchaseStatus == '' || data.data.items[i].purchaseStatus == null) {
                    if (data.data.items[i].questionType == '更正公告') {
                        iHTML += "<span style='color: #DC824D;'>【" + data.data.items[i].questionType + "】</span>";
                    } else if (data.data.items[i].questionType == '澄清及答复公告') {
                        iHTML += "<span style='color: #F13333;'>【" + data.data.items[i].questionType + "】</span>";
                    } else {
                        iHTML += "<span style='margin-right: 0px;'>&nbsp;</span>";
                    }
                } else if (data.data.items[i].questionType == '' || data.data.items[i].questionType == null) {
                    if (data.data.items[i].purchaseStatus == '正在报名') {
                        iHTML += "<span style='color: #DC824D;'>【" + data.data.items[i].purchaseStatus + "】</span>";
                    } else {
                        iHTML += "<span style='color: #F13333;'>【" + data.data.items[i].purchaseStatus + "】</span>";
                    }
                } else if (data.data.items[i].questionType == null || data.data.items[i].purchaseStatus == null) {
                    alert(1)
                    iHTML += "<span style='dispaly:none'></span>";
                }

                iHTML += "<p>" + data.data.items[i].title + "</p><time>";
                iHTML += "<i><img src=\"img/rq.png\" />发布：" + data.data.items[i].createDate.slice(0, 10) + "</i>";
                if(typeId =='23' || typeId == '24'){}else{
                    iHTML += "<i>截至：" + data.data.items[i].endTime.slice(0, 10) + "</i>";
                    iHTML += "<i>开标：" + data.data.items[i].openTime.slice(0, 10) + "</i>";
                };
                iHTML += " </time></li>";
            };
            $("#pfList").append(iHTML);
            $("#pfList li").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl('../page/callForBids.html?purchaseId=' + purchaseId + '&typeId=' + typeId + '');
            })
        }
    }, function (err) {

    });
}
//耗材信息
appliance_list();
function appliance_list() {
    var queryDrug = {
        "key": "",
        "pageNo":1,
        "pageSize":2,
        "pruductTypeIdList": []
    };
    http.ajax({
        url: 'product/appliance_list',
        type: 'POST',
        json: true,
        mask: false,
        data: JSON.stringify(queryDrug)
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = ""
            for (var i = 0; i < data.data.items.length; i++) {
                iHTML += "<div class=\"box\">"+
                "<div class=\"leftimg\">"+
                // "<img src=\"img/temporary/ypic.png\" />"+
                "</div>"+
                "<div class=\"rightBox\">"+
                "<h3 onclick=\"openUrl(\'page/materialsDetails.html?id="+data.data.items[i].id+"\')\">"+data.data.items[i].applianceName+"</h3>"+
                "<p>批准文号："+data.data.items[i].approvalNumber+"</p>"+
                "<p>生产厂家："+JSON.parse(data.data.items[i].manufacturer).name+"</p>"+
                "<p>型号："+data.data.items[i].model+"</p>"+
                "</div>"+
                "</div>";
            };
            $("#consumableBox").append(iHTML);

        }
    }, function (err) {

    });
};

//药品信息
drug_list();
function drug_list() {
    var queryDrug = {
        "key": "",
        "pageNo":1,
        "pageSize":2,
        "pruductTypeIdList": []
    };
    http.ajax({
        url: 'product/drug_list',
        type: 'POST',
        json: true,
        mask: false,
        data: JSON.stringify(queryDrug)
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = ""
            for (var i = 0; i < data.data.items.length; i++) {
                iHTML += "<div class=\"box\">"+
                "<div class=\"leftimg\">"+
                // "<img src=\"img/temporary/ypic.png\" />"+
                "</div>"+
                "<div class=\"rightBox\">"+
                "<h3 onclick=\"openUrl(\'page/drugDetails.html?id="+data.data.items[i].id+"\')\">"+data.data.items[i].commonName+"</h3>"+
                "<p>生产厂家："+JSON.parse(data.data.items[i].manufacturer).name+"</p>"+
                "<p>规格："+data.data.items[i].specification+"</p>"+
                "<p>剂型："+data.data.items[i].dosageForm+"</p>"+
                "</div>"+
                "</div>";
            };
            $("#drugBox").append(iHTML);
        }
    }, function (err) {

    });
};

//设备信息
equipment_list();
function equipment_list() {
    var queryDrug = {
        "key": "",
        "pageNo":1,
        "pageSize":2,
        "pruductTypeIdList": []
    };
    http.ajax({
        url: 'product/equipment_list',
        type: 'POST',
        json: true,
        mask: false,
        data: JSON.stringify(queryDrug)
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = ""
            for (var i = 0; i < data.data.items.length; i++) {
                iHTML += "<div class=\"box\">"+
                "<div class=\"leftimg\">"+
                // "<img src=\"img/temporary/ypic.png\" />"+
                "</div>"+
                "<div class=\"rightBox\">"+
                "<h3 onclick=\"openUrl(\'page/facilityDetails.html?id="+data.data.items[i].id+"\')\">"+data.data.items[i].equipmentName+"</h3>"+
                "<p>生产厂家："+JSON.parse(data.data.items[i].manufacturer).name+"</p>"+
                "<p>设备型号："+data.data.items[i].model+"</p>"+
                "<p>品牌："+data.data.items[i].brand+"</p>"+
                "</div>"+
                "</div>";
            };
            $("#equipmentBox").append(iHTML);
        }
    }, function (err) {

    });
};

//政策信息
lawsAndRegulations();
function lawsAndRegulations() {
    http.ajax({
        url: 'news/get_news_list_by_type_id',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            typeId: 10,
            pageNo: 1,
            pageSize: 6,
            purchaseStatus:"",
            openTime:"",
            endTime:"",
            searchkey:""
        }
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = "";
            var leftHTML = "";
            leftHTML += "<h1>"+data.data.items[0].title+"</h1>"+
            "<p>"+data.data.items[0].remark+"</p>"+
            "<time><i class=\"layui-icon layui-icon-date\"></i>  "+
            "<span>"+data.data.items[0].createDate.slice(0, 10)+"</span><br />"+
            "<a href='page/policy.html?policyId="+data.data.items[0].id+"'><img src=\"img/xq.png\"/>查看详情</a>"+
            "</time>";

            for (var i = 1; i < data.data.items.length; i++) {
                iHTML+='<li id='+data.data.items[i].id+'><i>▪</i>'+data.data.items[i].title+'<span>'+data.data.items[0].createDate.slice(0, 10)+'</span><p>'+data.data.items[i].remark+'</p></li>'
            };
            $(".policy .left").append(leftHTML);
            $(".policy .middle ul").append(iHTML);
            $(".policy .middle ul li:nth-child(1)").addClass("active");

            //政策法规鼠标悬停
			$(".policy .middle li").hover(function(){
				$(this).addClass("active").siblings().removeClass("active");
            })
            $(".policy .middle ul li").click(function(){
				var policyId = $(this).attr("id");
				openUrl('page/policy.html?policyId='+policyId+'');
            });
        }
    }, function (err) {

    });
};