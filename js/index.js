// 搜索
$(".searchBox .search span").click(function () {
    var key = $(".searchBox .search input").val();
    if (key) {
        if ($(".searchBox .toptab .active").index() == 0) {
            openUrl('page/drugList.html?key=' + encodeURI(encodeURI(key)) + '')
        } else {
            openUrl('page/materialsList.html?key=' + encodeURI(encodeURI(key)) + '')
        }
    } else {
        layer.msg('请先输入关键词！', {
            icon: 5
        });
    };
})
//轮播图
bannerList();
function bannerList() {
    http.ajax({
        url: 'banner/banner_list',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            type: "首页",
            pageNo: 1,
            pageSize: 6,
        }
    }).then(function (data) {
        if (data.code == 200) {
            var result = data.data.items;
            var iHTML = ""
            for (var i = 0; i < result.length; i++) {
                iHTML += '<div><a href="'+ result[i].url+'"><img src="'+ App.filePath+result[i].image.newFilename+'"/></a></div>'
            };
            $("#bannerList").append(iHTML);
            layui.use(['carousel'], function () {
                var carousel = layui.carousel
                //首页轮播
                carousel.render({
                    elem: '#banner'
                    , arrow: 'hover'
                    , width: '840'
                    , height: '402'
                    , indicator: 'none'
                });
            });
        }
    }, function (err) {

    });
};
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
            var result = data.data.items;
            var iHTML = ""
            for (var i = 0; i < result.length; i++) {
                iHTML += '<li id="' + result[i].id + '"><p>' + result[i].name + '</p></li>'
            };
            $("#pfTitleList").append(iHTML);
            $("#pfTitleList li:first-child").addClass("layui-this");
            purchasingInformationList(result[0].id);
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
            var iHTML = "";
            var result = data.data.items;
            for (var i = 0; i < result.length; i++) {
                iHTML += "<li id=" + result[i].id + ">";
                if (result[i].purchaseStatus == '' || result[i].purchaseStatus == null) {
                    if (result[i].questionType == '更正公告') {
                        iHTML += "<span style='color: #DC824D;'>【" + result[i].questionType + "】</span>";
                    } else if (result[i].questionType == '澄清及答复公告') {
                        iHTML += "<span style='color: #F13333;'>【" + result[i].questionType + "】</span>";
                    } else {
                        iHTML += "<span style='margin-right: 0px;'>&nbsp;</span>";
                    }
                } else if (result[i].questionType == '' || result[i].questionType == null) {
                    if (result[i].purchaseStatus == '正在报名') {
                        iHTML += "<span style='color: #DC824D;'>【" + result[i].purchaseStatus + "】</span>";
                    } else {
                        iHTML += "<span style='color: #F13333;'>【" + result[i].purchaseStatus + "】</span>";
                    }
                } else if (result[i].questionType == null || result[i].purchaseStatus == null) {
                    alert(1)
                    iHTML += "<span style='dispaly:none'></span>";
                }

                iHTML += "<p>" + result[i].title + "</p><time>";
                iHTML += "<i><img src=\"img/rq.png\" />发布：" + result[i].createDate.slice(0, 10) + "</i>";
                if (typeId == '23' || typeId == '24') { } else {
                    iHTML += "<i>截至：" + result[i].endTime.slice(0, 10) + "</i>";
                    iHTML += "<i>开标：" + result[i].openTime.slice(0, 10) + "</i>";
                };
                iHTML += " </time></li>";
            };
            $("#pfList").append(iHTML);
            $("#pfList li").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl('page/callForBids.html?purchaseId=' + purchaseId + '&typeId=' + typeId + '');
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
        "pageNo": 1,
        "pageSize": 2,
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
            var iHTML = "";
            var result = data.data.items;
            for (var i = 0; i < result.length; i++) {
                iHTML += "<div class=\"box\">" +
                    "<div class=\"leftimg\">" +
                    "<img onerror='imgError(this)' src=\"" + App.filePath+result[i].image.newFilename + "\" />"+
                    "</div>" +
                    "<div class=\"rightBox\">" +
                    "<h3 onclick=\"openUrl(\'page/materialsDetails.html?id=" + result[i].id + "\')\">" + result[i].applianceName + "</h3>" +
                    "<p>批准文号：" + result[i].approvalNumber + "</p>" +
                    "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>" +
                    "<p>型号：" + result[i].model + "</p>" +
                    "</div>" +
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
        "pageNo": 1,
        "pageSize": 2,
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
            var iHTML = "";
            var result = data.data.items;
            for (var i = 0; i < result.length; i++) {
                iHTML += "<div class=\"box\">" +
                    "<div class=\"leftimg\">" +
                    "<img onerror='imgError(this)' src=\"" + App.filePath+result[i].image.newFilename + "\" />"+
                    "</div>" +
                    "<div class=\"rightBox\">" +
                    "<h3 onclick=\"openUrl(\'page/drugDetails.html?id=" + result[i].id + "\')\">" + result[i].commonName + "</h3>" +
                    "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>" +
                    "<p>规格：" + result[i].specification + "</p>" +
                    "<p>剂型：" + result[i].dosageForm + "</p>" +
                    "</div>" +
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
        "pageNo": 1,
        "pageSize": 2,
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
            var iHTML = "";
            var result = data.data.items;
            for (var i = 0; i < result.length; i++) {
                iHTML += "<div class=\"box\">" +
                    "<div class=\"leftimg\">" +
                    "<img onerror='imgError(this)' src=\""+App.filePath+result[i].image.newFilename+"\" />"+
                    "</div>" +
                    "<div class=\"rightBox\">" +
                    "<h3 onclick=\"openUrl(\'page/facilityDetails.html?id=" + result[i].id + "\')\">" + result[i].equipmentName + "</h3>" +
                    "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>" +
                    "<p>设备型号：" + result[i].model + "</p>" +
                    "<p>品牌：" + result[i].brand + "</p>" +
                    "</div>" +
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
            purchaseStatus: "",
            openTime: "",
            endTime: "",
            searchkey: ""
        }
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = "";
            var leftHTML = "";
            var result = data.data.items;
            leftHTML += "<h1>" + result[0].title + "</h1>" +
                "<p>" + result[0].remark + "</p>" +
                "<time><i class=\"layui-icon layui-icon-date\"></i>  " +
                "<span>" + result[0].createDate.slice(0, 10) + "</span><br />" +
                "<a href='page/policy.html?policyId=" + result[0].id + "'><img src=\"img/xq.png\"/>查看详情</a>" +
                "</time>";

            for (var i = 1; i < result.length; i++) {
                iHTML += '<li id=' + result[i].id + '><i>▪</i>' + result[i].title + '<span>' + result[0].createDate.slice(0, 10) + '</span><p>' + result[i].remark + '</p></li>'
            };
            $(".policy .left").append(leftHTML);
            $(".policy .middle ul").append(iHTML);
            $(".policy .middle ul li:nth-child(1)").addClass("active");

            //政策法规鼠标悬停
            $(".policy .middle li").hover(function () {
                $(this).addClass("active").siblings().removeClass("active");
            })
            $(".policy .middle ul li").click(function () {
                var policyId = $(this).attr("id");
                openUrl('page/policy.html?policyId=' + policyId + '');
            });
        }
    }, function (err) {

    });
};

//采购活动
purchasingActivities();
function purchasingActivities() {
    http.ajax({
        url: 'news/get_news_list_by_type_id',
        type: 'GET',
        json: false,
        mask: false,
        data: {
            typeId: 20,
            pageNo: 1,
            pageSize: 11,
            purchaseStatus: "",
            openTime: "",
            endTime: "",
            searchkey: ""
        }
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var leftHTML = "";
            var rightHTML = "";
            var result = data.data.items;

            for (var i = 0; i < 3; i++) {
                leftHTML += "<div>" +
                    "<div class='imgLeftBox'>" +
                    "<img onerror='imgError(this)' src="+App.filePath+result[i].image.newFilename+"/>"+
                    "</div>" +
                    "<h4 id=" + result[i].id + ">" + result[i].title + "</h4>" +
                    "<p>" + result[i].remark + "</p>" +
                    "</div>";
            };
            for (var i = 3; i < result.length; i++) {
                rightHTML += "<li id=" + result[i].id + ">" +
                    "<div class='imgbox'>" +
                    "<img onerror='imgError(this)' src="+App.filePath+result[i].image.newFilename+"/>"+
                    "</div>" +
                    "<p>" + result[i].title + "</p>" +
                    // "<span><img class='dz' src='img/dz.png'/>0</span>"+
                    "<span><img class='ck' src='img/ck.png'/>" + result[i].hitCount + "</span>" +
                    "</li>";
            };

            $("#activitiesLeft").append(leftHTML);
            $("#activitiesRight").append(rightHTML);
            layui.use(['carousel'], function () {
                var carousel = layui.carousel
                //采购活动
                carousel.render({
                    elem: '#activityBanner'
                    , arrow: 'none'
                    , indicator: 'outside'
                    , width: '356'
                    , height: '400'
                });
            });

            $("#activitiesRight li").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl('page/purchase.html?purchaseId=' + purchaseId + '');
            })
            $("#activitiesLeft h4").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl('page/purchase.html?purchaseId=' + purchaseId + '');
            });
        }
    }, function (err) {

    });
};
