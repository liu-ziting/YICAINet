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
                iHTML +='<div class="swiper-slide"><a href="'+ result[i].url+'"><img src="'+ App.filePath+result[i].image.newFilename+'" /></a></div>'
            };
            $("#bannerList").append(iHTML);
            var swiper = new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                },
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
                iHTML +='<li id='+result[i].id+'>';
                iHTML +='<h1>'+result[i].title+'</h1>';
                iHTML +='<p>'+result[i].remark+'</p>';

                if(result[i].purchaseStatus == '' || result[i].purchaseStatus == null){
                    if(result[i].questionType == '更正公告'){
                        iHTML +='<time><span style="color: #DC824D;">'+result[i].questionType+'</span><p>发布：'+result[i].createDate.slice(0, result[i].createDate.length - 9)+'</p></time>';
                    };
                    if(result[i].questionType == '澄清及答复公告'){
                        iHTML +='<time><span style="color: #F13333;">'+result[i].questionType+'</span><p>发布：'+result[i].createDate.slice(0, result[i].createDate.length - 9)+'</p></time>';
                    };
                }else{
                    if(result[i].purchaseStatus == '正在报名'){
                        iHTML +='<time><span style="color: #DC824D;">'+result[i].purchaseStatus+'</span><p>截止：'+result[i].endTime.slice(0, result[i].endTime.length - 9)+'</p><p>开标：'+result[i].openTime.slice(0, result[i].openTime.length - 9)+'</p></time>';
                    };
                    if(result[i].purchaseStatus == '报名结束'){
                        iHTML +='<time><span style="color: #F13333;">'+result[i].purchaseStatus+'</span><p>截止：'+result[i].endTime.slice(0, result[i].endTime.length - 9)+'</p><p>开标：'+result[i].openTime.slice(0, result[i].openTime.length - 9)+'</p></time>';
                    };
                }
                iHTML +='</li>';
            };
            $("#pfList").append(iHTML);
            $("#pfList li").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl("page/details.html?id=" + purchaseId + "");
            })
        }
    }, function (err) {

    });
}

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
            pageSize: 5,
            purchaseStatus: "",
            openTime: "",
            endTime: "",
            searchkey: ""
        }
    }).then(function (data) {
        var data = beNull(data);
        if (data.code == 200) {
            var iHTML = "";
            var result = data.data.items;
            for (var i = 0; i < 3; i++) {
                iHTML += '<li id='+result[i].id+'>';
                iHTML += '<div class="imgBox">';
                iHTML += '<img onerror="imgError(this)"  src="'+App.filePath+result[i].image.newFilename+'" />';
                iHTML += '</div>';
                iHTML += '<div class="textBox">';
                iHTML += '<h2>'+result[i].title+'</h2>';
                iHTML += '<h3>'+result[i].remark+'</h3>';
                iHTML += '</div>';
                iHTML += '<span><img src="img/rl.png" />2019-10-05</span>';
                iHTML += '<span class="ly"><img src="img/ly.png" />'+result[i].source+'</span>';
                iHTML += '<span class="yj"><img src="img/yj.png" />'+result[i].hitCount+'</span>';
                iHTML += '</li>';
            };

            $("#activitiesList").append(iHTML);

            $("#activitiesList li").click(function () {
                var purchaseId = $(this).attr("id");
                openUrl('page/details.html?id=' + purchaseId + '');
            });
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
            var result = data.data.items;
            for (var i = 1; i < result.length; i++) {
                iHTML += '<li id='+result[i].id+'>';
                iHTML += '<h4>'+result[i].title+'</h4>';
                iHTML += '<h5>'+result[i].remark+'</h5>';
                iHTML += '<span><img src="img/ly.png" />'+result[i].source+'</span>';
                iHTML += '<span class="yj"><img src="img/yj.png" />'+result[i].hitCount+'</span>';
                iHTML += '</li>';
            };
            $("#policyList").append(iHTML);

            //政策法规
            $("#policyList li").click(function () {
                var policyId = $(this).attr("id");
                openUrl('page/details.html?id=' + policyId + '');
            });
        }
    }, function (err) {

    });
};

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
                iHTML +="<li onclick=\"openUrl(\'page/materialsDetails.html?id=" + result[i].id + "\')\">"+
                "<div class=\"imgBox\">"+
                "<img onerror='imgError(this)' src=\"" + App.filePath+result[i].image.newFilename + "\" />"+
                "</div>"+
                "<div class=\"textBox\">"+
                "<h1>" + result[i].applianceName + "</h1>"+
                "<p>批准文号：" + result[i].approvalNumber + "</p>"+
                "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>"+
                "<P>型号：" + result[i].model + "</P>"+
                "</div>"+
                "</li>";
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
                iHTML +="<li onclick=\"openUrl(\'page/drugDetails.html?id=" + result[i].id + "\')\">"+
                    "<div class=\"imgBox\">"+
                    "<img onerror='imgError(this)' src=\"" + App.filePath+result[i].image.newFilename + "\" />"+
                    "</div>"+
                    "<div class=\"textBox\">"+
                    "<h1>" + result[i].commonName + "</h1>"+
                    "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>" +
                    "<p>规格：" + result[i].specification + "</p>" +
                    "<p>剂型：" + result[i].dosageForm + "</p>" +
                    "</div>"+
                    "</li>";
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
                iHTML +="<li onclick=\"openUrl(\'page/facilityDetails.html?id=" + result[i].id + "\')\" >"+
                    "<div class=\"imgBox\">"+
                    "<img onerror='imgError(this)' src=\"" + App.filePath+result[i].image.newFilename + "\" />"+
                    "</div>"+
                    "<div class=\"textBox\">"+
                    "<h1>" + result[i].equipmentName + "</h1>"+
                     "<p>生产厂家：" + JSON.parse(result[i].manufacturer).name + "</p>" +
                    "<p>设备型号：" + result[i].model + "</p>" +
                    "<p>品牌：" + result[i].brand + "</p>" +
                    "</div>"+
                    "</li>";
            };
            $("#equipmentBox").append(iHTML);
        }
    }, function (err) {

    });
};
