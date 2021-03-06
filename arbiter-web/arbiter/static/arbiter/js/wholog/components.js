

/*所有组件*/
/**/
const LogApp = {
    template: '#logApp',
    store,
    data:function () {
        return {
            loginPopup:false, /*未登录是提示popup*/
            startDate: "2017-10-27",
            startTime: '00:00',
            endDate: '2017-12-28',
            endTime: '23:59',
            tableData: [],
            logDialog: {
                menus: [],
                content: [],
                switch: false,
            }
        }
    },
    mounted(){
        this.refreshJwtToken();
    },
    /*方法*/
    methods:{
        /*存到vuex map 方便调用store里函数*/
         ...Vuex.mapMutations(['setusername', 'refreshJwtToken',]),
        ...Vuex.mapGetters(['username', 'jwtHeader']),
        /*查询运行列表*/
        queryData(){
            startTime = this.startDate + " " + this.startTime;
            endTime = this.endDate + " " + this.endTime;
            fetch('../wholog/getAllLog',
                {
                    method: 'POST',
                    credentials:"same-origin",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': this.jwtHeader(),
                    },
                    body:JSON.stringify({startTime:startTime,endTime:endTime})
                }).then((response) => {
                    /*判断请求状态码*/
                    if (response.status !== 200){
                        if (response.status ===401){
                              this.openLoginPopup();/*判断未登录时 去打开登录提示*/
                        }else {
                            console.log("请求失败，状态码为：" + response.status);
                            return;
                        }
                    }else {
                        return response.json();
                    }
                }).then((json) => {
                    /*给tableData赋值*/
                    this.tableData = json['data'];
                }).catch((err) => {
                    console.log("请求wholog/getAllLog出错：" + err);
                });

        },  /*queryData*/
        /*查询对应记录下的详细运行日志记录*/
        queryDetailData(logId){
            /*对logId进行处理兼容es*/
             logId = logId.replace(/\-/g,"");
             fetch('../wholog/queryLogData',
                {
                    method: 'POST',
                    credentials:"same-origin",
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': this.jwtHeader()
                    },
                    body:JSON.stringify({logId:logId})
                }).then((response) => {
                    /*判断请求状态码*/
                    if (response.status !== 200){
                        if (response.status ===401){
                            this.openLoginPopup();/*判断未登录时 去打开登录提示*/
                        }else {
                            console.log("请求失败，状态码为：" + response.status);
                        }
                        return;
                    }else {
                         return response.json();
                    }
                }).then((json) => {
                        console.log("请求成功，打开dialog");
                        this.logDialog.menus = json['data'];
                        this.openDialog();
                }).catch((err) => {
                    console.log("请求wholog/queryLogData出错：" + err);
                });

        },    /*queryDetailData end*/

        /*打开和关闭日志运行详情对话框*/
        openDialog(){
            this.logDialog.switch = true;
        },
        closeDialog(){
            this.logDialog.switch = false;
        },
        /*打开登录提示框*/
        openLoginPopup(){
            this['loginPopup'] = true;
        },
    }, /*method end*/

    watch:{
       loginPopup(val){
           if (val){
               setTimeout(() =>{
                   this.loginPopup = false;
               },1500);
           }
       }
    }, /*watch end*/

};