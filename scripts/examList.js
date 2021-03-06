var user_id = ''
var url = window.location.href

$(function () {
   getUserInfo(url, initConst);
})

function initConst(info) {
    userInfo = info;
    user_id = userInfo.emplId
    console.log('user_id is ' + user_id)
    initExamList();
}

function initExamList() {
    getExamList();
};

function getExamList() {
    //TODO
    $.get('http://localhost:8222/exam/plan?status=5', function(data){
        console.log(data);
        data = data.rows.filter(function(item){
            const endTimeStamp = newDate(item.epe_time).getTime()
            return endTimeStamp - Date.now() > 0 
        })
        .map(function(examPlan){
            const startTimeStamp = newDate(examPlan.eps_time).getTime()
            const endTimeStamp = newDate(examPlan.epe_time).getTime()
            const now = Date.now() // TODO: 这样做有问题 
            examPlan.show_status = now < startTimeStamp ? '未开考' : '可考试'
            examPlan.is_show_exam_btn = examPlan.show_status === '未开考' ? false : true
            // // examPlan.exam_btn_txt = examPlan.show_status === '考试中' ? '去考试' : '查看考试结果' 
            examPlan.exam_btn_txt = '去考试'
            examPlan.user_id = user_id
            return examPlan
        })
        console.log(data);
        initListBody(data);
    });
};

function initListBody(data) {
    const exam_list_template = [
        '{{#data}}<div class="panel-body">',
            '<div class="card-alert">',
                '<div class="alert-title">{{ep_name}}</div>',
                '<div class="alert-body">',
                    '<div class="item">',                      
                        '<span>考试开始时间：{{eps_time}}</span>',  
                    '</div>',
                    '<div class="item">',                     
                        '<span>考试结束时间：{{epe_time}}</span>',
                    '</div>',
                    '<div class="item btn">',    
                        '<span>状态: {{show_status}}</span>',                   
                        '{{#is_show_exam_btn}}<a href="test.html?ep_id={{ep_id}}&user_id={{user_id}}&isFrom=center">{{exam_btn_txt}}</a>{{/is_show_exam_btn}}',                    
                    '</div>',
                '</div>',
            '</div>',
        '</div>{{/data}}',
    ].join('')
    //初始化这个模板
    Mustache.parse(exam_list_template);
    $("#exam_list").html(Mustache.render(exam_list_template, { data: data }))
};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function newDate(strdate) {  
    var arr = strdate.split(/[- : \/]/);  
    console.log(arr);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);  
    return date;  
} 