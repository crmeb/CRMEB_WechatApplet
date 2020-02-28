import { HTTP_REQUEST_URL, CACHE_USERINFO, CACHE_TOKEN, CACHE_EXPIRES_TIME } from './config.js';
import Server from './utils/Server.js';
import util from './utils/util.js';

App({
  onLaunch: function (option) {
    if (HTTP_REQUEST_URL==''){
      console.error("请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'\n\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n\n请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret");
      return false;
    }
    let that = this;
    let token = wx.getStorageSync(CACHE_TOKEN);
    let expiresTime = wx.getStorageSync(CACHE_EXPIRES_TIME);
    let userInfo = wx.getStorageSync(CACHE_USERINFO);
    this.globalData.isLog = !!userInfo && util.checkLogin(token, expiresTime,true);
    if (this.globalData.isLog) {
      this.globalData.token = token;
      this.globalData.expiresTime = expiresTime;
      this.globalData.userInfo = userInfo ? JSON.parse(userInfo) : {};
    }
    if (option.query.hasOwnProperty('scene')){
      switch (option.scene) {
        //扫描小程序码
        case 1047:
          that.globalData.code = option.query.scene;
          break;
        //长按图片识别小程序码
        case 1048:
          that.globalData.code = option.query.scene;
          break;
        //手机相册选取小程序码
        case 1049:
          that.globalData.code = option.query.scene;
          break;
        //直接进入小程序
        case 1001:
          that.globalData.spid = option.query.scene;
          break;
      }
    }
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
      }, fail(err) {}
    });
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      return that.Tips({title:'新版本下载失败'});
    })
    //实例化聊天服务
    this.$chat = new Server(this);
  },
  $chat:null,
  globalData: {
    navHeight: 0,
    routineStyle: '#ffffff',
    openPages: '',
    spid: 0,
    code:0,
    urlImages: '',
    url: HTTP_REQUEST_URL,
    token: '',
    isLog:false,
    expiresTime:0,
    MyMenus:[],
    userInfo:{},
    loginType:'routine'
  },
  /**
   * 聊天事件快捷注册
   * 
  */
  $on: function (name, action){
    this.$chat.$on(name,action);
  },
  /*
  * 信息提示 + 跳转
  * @param object opt {title:'提示语',icon:''} | url
  * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
  */
  Tips: function (opt, to_url) { 
    return util.Tips(opt, to_url);
  },
  /**
   * 快捷调取助手函数
  */
  help:function()
  {
    return util.$h;
  },
  /*
  * 合并数组
  * @param array list 请求返回数据
  * @param array sp 原始数组
  * @return array
  */
  SplitArray: function (list, sp) { return util.SplitArray(list, sp)},
})