// pages/mall/payment/payment.js
import { getUserInfo, rechargeRoutine, getRechargeApi} from '../../api/user.js';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList:[],
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '余额充值',
      'color': false,
    },
    navRecharge: ['账户充值','佣金转入'],
    active:0,
    number:'',
    focus:true,
    userinfo:{},
    placeholder:"0.00",
    placeholderOther:"其他",
    activePic:0,
    numberPic: '',
    rechar_id: 0,
    recharge_attention:[]
  },

  /**
   * 登录授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
    this.getRecharge();
  },
  setPlaceholderStatus:function(event){
    if (event.detail.value.length == 0) this.setData({ placeholder: '0.00' });
  },
  setPlaceholder:function(){
    this.setData({ placeholder : '' })
  },
  setOtherPlaceholder:function(){
    this.setData({ placeholderOther : '' })
  },
  setOtherPlaceholderStatus:function(event){
    if (event.detail.value.length == 0) this.setData({ placeholderOther: '其他' });
  },
  navRecharge:function(e){
     this.setData({
       active: e.currentTarget.dataset.id,
       activePic: 0
     })
    if (this.data.picList.length){
      this.setData({
        rechar_id: this.data.picList[0].id,
        numberPic: this.data.picList[0].price
      })
     }
  },
   /**  
   * 选择金额
  */
  picCharge:function(e){
    if (e.currentTarget.dataset.id == 0) {
      this.setData({
        activePic: e.currentTarget.dataset.index,
        rechar_id: 0,
        numberPic: ''
      })
    }else {
      this.setData({
        number: '',
        activePic: e.currentTarget.dataset.index,
        rechar_id: e.currentTarget.dataset.id,
        numberPic: e.currentTarget.dataset.quota,
        placeholderOther: '其他' 
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 充值额度选择
  */
  getRecharge: function () {
    var that = this;
    getRechargeApi().then(res => {
      that.setData({ 
        picList: res.data.recharge_quota,
        rechar_id: res.data.recharge_quota[0].id,
        numberPic: res.data.recharge_quota[0].price,
        recharge_attention: res.data.recharge_attention || []
      });
    })
  },
  /**
   * 获取用户信息
  */
  getUserInfo:function(){
    var that = this;
    getUserInfo().then(res=>{
      that.setData({ userinfo: res.data });
    })
  },
  /*
  * 用户充值
  */
  submitSub:function(e){
    let that = this, value = e.detail.value.number, commissionCount = that.data.userinfo.commissionCount;
    if (that.data.active){
      if (parseFloat(value) < 0 || !value) return app.Tips({ title: '请输入金额' });
      if (Number(value) > Number(commissionCount)) return app.Tips({ title: '转佣金额不能大于' + commissionCount });
      wx.showModal({
        title: '转入余额',
        content: '转入余额后无法再次转出，确认是否转入余额',
        success(res){
          if (res.confirm){
            rechargeRoutine({ price: value, type: 1 }).then(res => {
              that.setData({ 'userinfo.now_money': app.help().Add(value, that.data.userinfo.now_money) });
              return app.Tips({ title: '转入成功', icon: 'success' }, {tab:5,url:'/pages/user_money/index'});
            }).catch(err => {
              return app.Tips({ title: err })
            });
          } else if (res.cancel){
            return app.Tips({title:'已取消'});
          }
        },
      })
    }else{
      if (this.data.picList.length == this.data.activePic && !value) return app.Tips({ title: '请输入金额' });
      wx.showLoading({
        title: '正在支付',
      })
      rechargeRoutine({ 
        price: that.data.rechar_id == 0 ? value : that.data.numberPic, 
        type: 0, 
        rechar_id: that.data.rechar_id
      }).then(res=>{
        wx.hideLoading();
        let jsConfig = res.data;
        wx.requestPayment({
          timeStamp: jsConfig.timestamp,
          nonceStr: jsConfig.nonceStr,
          package: jsConfig.package,
          signType: jsConfig.signType,
          paySign: jsConfig.paySign,
          success: function (res) {
            that.setData({ 'userinfo.now_money': app.help().Add(value, that.data.userinfo.now_money) });
            return app.Tips({ title: '支付成功', icon: 'success' }, {tab:5,url:'/pages/user_money/index'});
          },
          fail: function () {
            return app.Tips({ title: '支付失败' });
          },
          complete: function (res) {
            if (res.errMsg == 'requestPayment:cancel') return app.Tips({ title: '取消支付' });
          }
        })
      }).catch(err=>{
        wx.hideLoading();
        return app.Tips({title:err})
      });
    }
  }
})