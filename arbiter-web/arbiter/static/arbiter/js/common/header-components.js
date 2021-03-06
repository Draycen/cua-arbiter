//所有用到的组件
let Event = new Vue();
//****以下为所有用到的组件：
//用户图标和其下拉菜单组件
const userAvatar = {
    template: '#userAvatar',
    store,
    props: {usernameAbbreviation: null},
    data: function () {
        return {
            userMenuTrigger: null,
            userMenuOpen: false,
        }
    },
    mounted() {
        this.userMenuTrigger = this.$refs.UserAvatar.$el;
    },
    methods: {
        ...Vuex.mapMutations(['setusername', 'refreshJwtToken',]),
        userMenuToggle() {
            this.userMenuOpen = !this.userMenuOpen
        },
        userMenuHandleClose(e) {
            this.userMenuOpen = false
        }, logout() {
            deleteAllCookies();
            let storage = window.localStorage;
            storage.clear();
            this.setusername(null);
            this.refreshJwtToken();
        },
    }
};
//菜单图标和其下拉菜单组件
const menuIconButton = {
    template: '#menuIconButton', store,
    props: {usernameAbbreviation: null},
    data: function () {
        return {
            appMenuTrigger: null,
            appMenuOpen: false,
            dialog: false,
            gitUrlPrefix: '',
            gitCloneStatus: 'finish',
        }
    },
    mounted() {
        this.appMenuTrigger = this.$refs.appIcon.$el;
    },
    methods: {
        ...Vuex.mapMutations(['setusername', 'refreshJwtToken',]),
        ...Vuex.mapGetters(['username', 'jwtHeader']),
        appMenuToggle() {
            this.appMenuOpen = !this.appMenuOpen
        },
        appMenuHandleClose(e) {
            this.appMenuOpen = false
        },
        openImportDialog() {
            this.dialog = true;

        },
        closeImportDialog() {
            this.dialog = false
        },
        cloneCaseObj() {
            this.gitCloneStatus = 'running';

            fetch("./cloneCaseObj",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Authorization': this.jwtHeader()
                    },
                    body: JSON.stringify({url: this.gitUrlPrefix})
                }).then((response) => {


                if (response.status !== 200
                ) {
                    console.log("存在一个问题，状态码为：" + response.status);
                    const error = new Error(response.statusText);
                    error.response = response;
                    this.gitCloneStatus = 'fail';
                    throw error;
                }
                else
                    return response.json();
            }).then(
                json => {
                    this.gitCloneStatus = 'finish';
                    window.location.href = ".";


                });
        },
    }
};
//顶部组件
const ArbiterHeader = {
    template: '#arbiterHeader',
    store,
    computed: {
        usernameAbbreviation() {
            if (!!this.username()) {
                return this.username().substr(0, 2)
            }
            else
                return null;
        }
    },
    data: function () {
        return {
            message: {
                href: 'login',
            },
            sliderIsOpen: true,
            loginDialog :{
                switch: false,
                username:"",
                password:"",

            },
        }
    },
    mounted() {
        this.refreshJwtToken();

        fetch("./getUserDetail",
            {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': this.jwtHeader()
                }
            }).then(response => {
            if (response.status !== 200) {
                console.log("存在一个问题，状态码为：" + response.status);
                return false;
            }
            else
                return response.json();
        }).then(
            json => {
                let storage = window.localStorage;
                storage["username"] = json["username"];
                storage["role"] = json["role"];
                // this.$store.commit('setusername', json["username"]);
                this.setusername(json["username"]);

            }
        ).catch((err) => {
            console.log("请求错误:" + err);
        });
    },
    methods: {
        ...Vuex.mapMutations(['setusername', 'refreshJwtToken',]),
        ...Vuex.mapGetters(['username', 'jwtHeader']),
        toggleSlide() {
            this.sliderIsOpen = !this.sliderIsOpen;
            Event.$emit('toggle-slide');
        },
        /*点击登录*/
        toLogin(){
            this.openLoginDialog();
        },
         /*打开和关闭登录对话框*/
        openLoginDialog(){
            this.loginDialog.switch = true;
        },
        closeLoginDialog(){
            this.loginDialog.switch = false;
        },
    },
    components: {        //要把组件写入到components里面，如果没有放的话在切换的时候就会找不到 组件
        'userAvatar': userAvatar,
        'menuIconButton': menuIconButton,
    }

};