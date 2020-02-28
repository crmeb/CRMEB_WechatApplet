import util from '../../utils/util.js';
import { postSignUser, getSignConfig, getSignList, setSignIntegral} from '../../api/user.js';
import { setFormId } from '../../api/api.js';

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '签到',
      'color': true,
      'class':'0'
    },
    active:false,
    userInfo:{},
    signCount:[],
    signSystemList:[],
    signList:[],
    integral:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
    this.getSignSysteam();
    this.getSignList();
  },

  /**
   * 获取签到配置
  */
  getSignSysteam:function(){
    var that=this;
    getSignConfig().then(res=>{
      that.setData({ signSystemList: res.data, day: that.Rp(res.data.length) });
    })
  },

  /**
   * 去签到记录页面
   * 
  */
  goSignList:function(){
    return app.Tips('/pages/user_sgin_list/index');
  },
  /**
   * 获取用户信息
  */
  getUserInfo:function(){
    var that=this;
    postSignUser({ sign: 1 }).then(res=>{
      res.data.integral = parseInt(res.data.integral);
      var sum_sgin_day = res.data.sum_sgin_day;
      that.setData({ userInfo: res.data, signCount: that.PrefixInteger(sum_sgin_day, 4), sign_index: res.data.sign_num });
    });
  },

  /**
   * 获取签到列表
   * 
  */
  getSignList:function(){
    var that=this;
    getSignList({page:1,limit:3}).then(res=>{
      that.setData({ signList: res.data });
    })
  },
  /**
   * 数字转中文
   * 
  */
  Rp: function (n) {
    var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var s = '';
    n = '' + n; // 数字转为字符串
    for (var i = 0; i < n.length; i++) {
      s += cnum[parseInt(n.charAt(i))];
    }
    return s;
  },
  /**
   * 数字分割为数组
   * @param int num 需要分割的数字
   * @param int length 需要分割为n位数组
  */
  PrefixInteger: function (num, length) {
    return (Array(length).join('0') + num).slice(-length).split('');
  },

  /**
   * 用户签到
  */
  goSign:function(e){
    let that = this, sum_sgin_day = that.data.userInfo.sum_sgin_day;
    if (that.data.userInfo.is_day_sgin) return app.Tips({title:'您今日已签到!'});
    setSignIntegral().then(res=>{
      that.setData({
        active: true,
        integral: res.data.integral,
        sign_index: (that.data.sign_index + 1) > that.data.signSystemList.length ? 1 : that.data.sign_index + 1,
        signCount: that.PrefixInteger(sum_sgin_day + 1, 4),
        'userInfo.is_day_sgin': true,
        'userInfo.integral': util.$h.Add(that.data.userInfo.integral, res.data.integral)
      });
      that.getSignList();
    }).catch(err=>{
      return app.Tips({title:err})
    });
  },
  /**
   * 关闭签到提示
  */
  close:function(){
    this.setData({active: false});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

})