const app = getApp();

import { getMenuList, getUserInfo} from '../../api/user.js';
import { switchH5Login } from '../../api/api.js';
import authLogin from '../../utils/autuLogin.js';
import util from '../../utils/util.js';
import wxh from '../../utils/wxh.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '个人中心',
      'color': true,
      'class': '0'
    },
    userInfo:{},
    MyMenus:[],
    isGoIndex:false,
    iShidden:true,
    isAuto:false,
    switchActive:false,
    loginType: app.globalData.loginType,
    orderStatusNum:{},
    promoter_price:0,
    generalActive:false,
    generalContent:{
      promoterNum:'',
      title:'您未获得推广权限'
    }
  },

  close:function(){
    this.setData({ switchActive:false});
  },
  /**
   * 授权回调
  */
  onLoadFun:function(e){
    this.getUserInfo();
    this.getMyMenus();
  },
  Setting: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
        wxh.selfLocation();
      }
    });
  }, 
  /**
   * 
   * 获取个人中心图标
  */
  getMyMenus: function () {
    var that = this;
    if (this.data.MyMenus.length) return;
    getMenuList().then(res=>{
      that.setData({ MyMenus: res.data.routine_my_menus });
    });
  },
  /**
   * 获取个人用户信息
  */
  getUserInfo:function(){
    var that=this;
    getUserInfo().then(res=>{
      const generalContent="generalContent.promoterNum";
      that.setData({ 
        userInfo: res.data, 
        loginType: res.data.login_type,
        orderStatusNum: res.data.orderStatusNum,
        [generalContent]:`您在商城累计消费金额仅差 ${res.data.promoter_price || 0}元即可开通推广权限`
      });
    });
  },
  generalWindow:function(){
    this.setData({
      generalActive: false
    })
  },
  /**
   * 页面跳转
  */
  goPages:function(e){
    if(app.globalData.isLog){
      if (e.currentTarget.dataset.url == '/pages/user_spread_user/index') {
        if (!this.data.userInfo.is_promoter && this.data.userInfo.statu == 1) 
          return app.Tips({ title: '您还没有推广权限！！' });
        if (!this.data.userInfo.is_promoter && this.data.userInfo.statu == 2){
          return this.setData({ generalActive:true});
        }
      }
      if (e.currentTarget.dataset.url == '/pages/logon/index') return this.setData({ switchActive:true});
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }else{
      this.setData({ iShidden:false});
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ MyMenus:app.globalData.MyMenus});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ switchActive: false });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  onShow:function(){
    let that = this;
    if (app.globalData.isLog){ 
      this.getUserInfo();
      this.getMyMenus();
    }
  },

  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

  },
})