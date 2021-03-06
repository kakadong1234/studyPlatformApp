String.prototype.myReplace = function (f, e) {//吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
    return this.replace(reg, e);
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//dd.ready(function () {

//    //dd.device.notification.confirm({
//    //    message: "你爱我吗",
//    //    title: "提示",
//    //    buttonLabels: ['爱', '不爱'],
//    //    onSuccess: function (result) {
//    //        //onSuccess将在点击button之后回调
//    //        /*
//    //        {
//    //            buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
//    //        }
//    //        */
//    //    },
//    //    onFail: function (err) { }
//    //});



//    dd.biz.navigation.setRight({
//        show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
//        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
//        text: '导航',//控制显示文本，空字符串表示显示默认文本
//        onSuccess: function (result) {
//            var $androidActionSheet = $('#androidActionsheet');
//            var $androidMask = $androidActionSheet.find('.weui-mask');
//            $androidMask.on('click', function () {
//                $androidActionSheet.hide();
//            });
//            if (!showMenu) {
//                showMenu = true;
//                $androidActionSheet.show();
//            } else {
//                showMenu = false;
//                $androidActionSheet.hide();
//            }
//            //如果control为true，则onSuccess将在发生按钮点击事件被回调
//            /*
//            {}
//            */
//        },
//        onFail: function (err) { }
//    });
//});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function openLink(name) {
    getAppLinkList(function(appList){
        var link = findItemInList(appList, 'name', name).link
        dd.ready(function () {
            dd.biz.util.openLink({
                url: link,//要打开链接的地址
                onSuccess: function (result) {
                    /**/
                   // alert(JSON.stringify(result));
                },
                onFail: function (err) {
    
                  //  alert(JSON.stringify(err));
                }
            })
    
        });
    })
};

var appLinkList = []
function getAppLinkList(cb) {
    console.log(appLinkList.length)
    if(appLinkList.length > 0) {
        return cb(appLinkList)
    }
    getDDAppList(function(list){
        var constLink = 'dingtalk://dingtalkclient/action/switchtab?index=2&name=work&scene=1&corpid=ding247bfe11030aede235c2f4657eb6378f'
        //签到
        var agentId = findItemInList(list, 'name', '签到').agentId
        var link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'singIn', link: link})
        //信息上报 - 日志
        agentId = findItemInList(list, 'name', '日志').agentId
        link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'log', link: link})
        //工作调度 or 协作指导
        appLinkList.push({name: 'work', link: 'dingtalk://dingtalkclient/action/switchtab?index=3'})
        //工作审批 - 审批
        agentId = findItemInList(list, 'name', '审批').agentId
        link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'shenpi', link: link})

        //请假申请 - 审批下请假 - 直接拼接 url
        link = 'http://aflow.dingtalk.com/dingtalk/mobile/homepage.htm#custom?corpid=' +
        'ding247bfe11030aede235c2f4657eb6378f' + 
        '&showmenu=true&dd_progress=false&dd_share=false&swfrom=chat&TemplateManager=activate&processCode=PROC-0266829C-E296-4FA1-9436-86D68FED388C&formUuid=FORM-1412C89A-224A-4CE8-A4A9-1F6E4DCCF502'
        appLinkList.push({name: 'leave', link: link})
        console.log(appLinkList)
        return cb(appLinkList)
    });

} 

function getDDAppList(cb){
    $.get("http://localhost:8222/dding?key=get_microapp_list ", function (rel) {
        var list = rel.appList
        return cb(list)
    })
}

var showMenu = false;

$(function () {

    $("#btn-nav").on("click", function () {
        var $androidActionSheet = $('#androidActionsheet');
        var $androidMask = $androidActionSheet.find('.weui-mask');
        $androidMask.on('click', function () {
            $androidActionSheet.hide();
        });
        if (!showMenu) {
            showMenu = true;
            $androidActionSheet.show();
        } else {
            showMenu = false;
            $androidActionSheet.hide();
        }
    });



    $("#btn-test").click(function () {

        for (var i = 0; i < questions.length; i++) {

            console.log($("input[type=radio][name=radio_" + questions[i].eq_id + "]:checked").val());
            var answer = $("input[type=radio][name=radio_" + questions[i].eq_id + "]:checked").val();
            if (answer !== undefined) {
                if (answer == questions[i].answer) {
                    $("img#img_" + questions[i].eq_id).attr("src", "../img/right.png").show();
                } else {
                    $("img#img_" + questions[i].eq_id).attr("src", "../img/wrong.png").show();
                }
            }

        }


    });


    $("#btn-comment").click(function () {
        var user = userInfo || {};
        var content = $("#xd-content").val();

        if (content == "") {
            alert("请输入心得体会！");
            return false;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:8222/article/" + aritcleId + "/aq",
            "method": "POST",
            "headers": {},
            "data": {
                "title": articleTitle,
                "content": content,
                "user_id": user.emplId,
                "cover": user.avatar,
                "author": user.nickName
            }
        }

        //  alert(JSON.stringify(settings));

        $.ajax(settings).done(function (response) {
            //console.log(response);
            alert("提交成功，等待审核");
        });
    });


    $("#btn-feedback").click(function () {

        var user = userInfo || {};

        //    alert(JSON.stringify(user.emplId));

        var content = $("#xd-content").val();

        if (content == "") {
            alert("请输入宝贵意见！");
            return false;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:8222/report/feedback",
            "method": "POST",
            "headers": {},
            "data": {
                "title": "意见反馈",
                "content": content,
                "user_id": user.emplId,
                "cover": user.avatar,
                "author": user.nickName
            }
        }

        $.ajax(settings).done(function (response) {
            //console.log(response);
            alert("提交成功，谢谢您的建议，我们会及时回复！");
        });
    });

})


function getUserInfo(url, callback, callbackGps) {
    if(!isMobile()) { //pc上调试
        return typeof callback == "function" && callback({
            emplId: '065506030123353335',
            avatar: 'http://7xrsfo.com1.z0.glb.clouddn.com/tx123.png',
            nickName: '晓伟'
        });
    }
    $.get("http://localhost:8222/jsapi-oauth?pwd=sddkhhyy&url=" + url, function (e) {
        var _config = {};
        _config = e;
        //  alert(JSON.stringify(_config));
        dd.config({
            agentId: _config.agentId,
            corpId: _config.corpId,
            timeStamp: _config.timestamp,
            nonceStr: _config.noncestr,
            signature: _config.signature,
            jsApiList: ['runtime.info', 'biz.contact.choose', 'device.notification.confirm', 'device.notification.prompt', 'biz.ding.post', 'biz.util.openLink', 'biz.util.uploadImage', 'biz.user.get', 'device.geolocation.get', 'biz.map.locate']
        });
        dd.error(function (error) {
            /**
             {
                message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
                errorCode:"错误码"
             }
            **/
            console.log('1')
            alert('dd error: ' + JSON.stringify(error));
        });
        console.log('2')
        //    alert(JSON.stringify(_config));

        dd.ready(function () {
            dd.biz.user.get({
                corpId: 'ding247bfe11030aede235c2f4657eb6378f', // 可选参数，如果不传则使用用户当前企业的corpId。 
                onSuccess: function (info) {
                    //  alert('userGet success: ' + JSON.stringify(info));
                    typeof callback == "function" && callback(info);
                },
                onFail: function (err) {
                    alert('userGet fail: ' + JSON.stringify(err));
                }
            });

        });
        console.log('3')
    });

}

function isMobile() {
    var userAgentInfo = navigator.userAgent;
    console.log('userAgentInfo' + userAgentInfo)
    var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];

    var mobile_flag = false;

    //根据userAgent判断是否是手机
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
     return mobile_flag;
}

function findItemInList(list, key, value) {
    var item = {}
    for(var i=0; i<list.length; i++){
        var app = list[i]
        if(app[key] === value) {
            item = app
        }
    }
    return item
}
