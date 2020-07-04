import { getOrderDetail, orderAgain, orderTake, orderDel} from '../../api/order.js';
import { openOrderRefundSubscribe } from '../../utils/SubscribeMessage.js';
import { getUserInfo } from '../../api/user.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '订单详情',
      'color': true,
      'class': '0'
      // 'class': '2' 顶部为灰色
    },
    order_id:'',
    evaluate:0,
    cartInfo:[],//购物车产品
    orderInfo: { system_store:{}},//订单详情
    system_store:{},
    isGoodsReturn:false,//是否为退款订单
    status:{},//订单底部按钮状态
    isClose:false,
    payMode: [
      { name: "微信支付", icon: "icon-weixinzhifu", value: 'weixin', title: '微信快捷支付' },
      { name: "余额支付", icon: "icon-yuezhifu", value: 'yue', title: '可用余额:', number: 0 },
    ],
    pay_close: false,
    pay_order_id: '',
    totalPrice: '0',
    generalActive:false,
    generalContent:{
      promoterNum:'',
      title:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.order_id) this.setData({ order_id: options.order_id});
    if (options.isReturen){
      this.setData({ 'parameter.class': '2', isGoodsReturn:true });
      this.selectComponent('#navbar').setClass();
    }
  },
  openSubcribe:function(e){
    let page = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '正在加载',
    })
    openOrderRefundSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: page,
      });
    }).catch(() => {
      wx.hideLoading();
    });
  },
  /**
   * 事件回调
   * 
  */
  onChangeFun: function (e) {
    let opt = e.detail;
    let action = opt.action || null;
    let value = opt.value != undefined ? opt.value : null;
    (action && this[action]) && this[action](value);
  },
  /**
   * 拨打电话
  */
  makePhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.system_store.phone
    })
  },
  /**
   * 打开地图
   * 
  */
  showMaoLocation: function () {
    if (!this.data.system_store.latitude || !this.data.system_store.longitude) return app.Tips({ title: '缺少经纬度信息无法查看地图！' });
    wx.openLocation({
      latitude: parseFloat(this.data.system_store.latitude),
      longitude: parseFloat(this.data.system_store.longitude),
      scale: 8,
      name: this.data.system_store.name,
      address: this.data.system_store.address + this.data.system_store.detailed_address,
      success: function () {

      },
    });
  },
  /**
   * 关闭支付组件
   * 
  */
  pay_close: function () {
    this.setData({ pay_close: false });
  },
  /**
   * 打开支付组件
   * 
  */
  pay_open: function () {
    this.setData({ 
      pay_close: true, 
      pay_order_id: this.data.orderInfo.order_id, 
      totalPrice: this.data.orderInfo.pay_price 
    });
  },
  /**
   * 支付成功回调
   * 
  */
  pay_complete: function () {
    this.setData({pay_close: false, pay_order_id: '' });
    this.getOrderInfo();
  },
  /**
   * 支付失败回调
   * 
  */
  pay_fail: function () {
    this.setData({ pay_close: false, pay_order_id: '' });
  },
  /**
   * 登录授权回调
   * 
  */
  onLoadFun:function(){
    this.getOrderInfo();
    this.getUserInfo();
  },
  /**
   * 获取用户信息
   * 
  */
  getUserInfo:function(){
    let that = this;
    getUserInfo().then(res=>{
      that.data.payMode[1].number = res.data.now_money;
      that.setData({ payMode: that.data.payMode });
    })
  },
  /**
   * 获取订单详细信息
   * 
  */
  getOrderInfo:function(){
    var that=this;
    wx.showLoading({ title: "正在加载中" });
    getOrderDetail(this.data.order_id).then(res=>{
      let _type = res.data._status._type;
      wx.hideLoading();
      that.setData({ 
        orderInfo: res.data, 
        cartInfo: res.data.cartInfo, 
        evaluate: _type == 3 ? 3 : 0, 
        system_store: res.data.system_store,
      });
      if (this.data.orderInfo.refund_status != 0 ){
        this.setData({ 'parameter.class': '2', isGoodsReturn: true });
        this.selectComponent('#navbar').setClass();
      }
      that.getOrderStatus();
    }).catch(err=>{
      wx.hideLoading();
      app.Tips({ title: err }, '/pages/order_list/index');
    });
  },
  /**
   * 
   * 剪切订单号
  */
  copy:function(){
    var that=this;
    wx.setClipboardData({data: this.data.orderInfo.order_id});
  },
  /**
   * 打电话
  */
  goTel:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.delivery_id
    })
  },

  /**
   * 设置底部按钮
   * 
  */
  getOrderStatus:function(){
    var orderInfo = this.data.orderInfo || {}, _status = orderInfo._status || { _type:0},status={};
    var type = parseInt(_status._type), combination_id = orderInfo.combination_id || 0, delivery_type = orderInfo.delivery_type,
      seckill_id = orderInfo.seckill_id ? parseInt(orderInfo.seckill_id) : 0, 
      bargain_id=orderInfo.bargain_id ? parseInt(orderInfo.bargain_id) : 0,
      combination_id = orderInfo.combination_id ? parseInt(orderInfo.combination_id) : 0;
    status={
      type: type == 9 ? -9 : type,
      class_status:0
    };
    if (type == 1 && combination_id >0) status.class_status = 1;//查看拼团
    if (type == 2 && delivery_type == 'express') status.class_status = 2;//查看物流
    if (type == 2) status.class_status = 3;//确认收货
    if (type == 4 || type == 0) status.class_status = 4;//删除订单
    if (!seckill_id && !bargain_id && !combination_id && (type == 3 || type == 4)) status.class_status = 5;//再次购买
    this.setData({ status: status});
  },
  /**
   * 去拼团详情
   * 
  */
  goJoinPink:function(){
    wx.navigateTo({
      url: '/pages/activity/goods_combination_status/index?id=' + this.data.orderInfo.pink_id,
    });
  },
  /**
   * 再此购买
   * 
  */
  goOrderConfirm:function(){
    var that=this;
    orderAgain( that.data.orderInfo.order_id ).then(res=>{
      return wx.navigateTo({ url: '/pages/order_confirm/index?cartId=' + res.data.cateId });
    });
  },
  confirmOrder:function(){
    var that=this;
    wx.showModal({
      title: '确认收货',
      content: '为保障权益，请收到货确认无误后，再确认收货',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask:true,
            title: '加载中',
          })
          orderTake(that.data.order_id).then(res=>{
            wx.hideLoading();
            const generalContent="generalContent.promoterNum";
            const title="generalContent.title";
            if(res.data.gain_integral!="0.00" && res.data.gain_coupon!="0.00"){
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_coupon}元优惠券以及${res.data.gain_integral}积分，购买商品时可抵现哦～`,
                [title]: '恭喜您获得优惠礼包'
              });
              return;
            }else if(res.data.gain_integral!="0.00"){
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_integral}积分，购买商品时可抵现哦～`,
                [title]: '赠送积分'
              });
              return;
            }else if(res.data.gain_coupon!="0.00"){
              that.setData({
                generalActive: true,
                [generalContent]: `恭喜您获得${res.data.gain_coupon}元优惠券，购买商品时可抵现哦～`,
                [title]: '恭喜您获得优惠券'
              });
              return;
            }else{
              return app.Tips({ title: '操作成功', icon: 'success' }, function () {
                that.getOrderInfo();
              });
            }
          }).catch(err=>{
            return app.Tips({title:err});
          })
        }
      }
    })
  },
  generalWindow:function(){
    this.setData({
      generalActive: false
    });
    this.getOrderInfo();
  },
  /**
   * 
   * 删除订单
  */
  delOrder:function(){
    var that=this;
    orderDel(this.data.order_id).then(res=>{
      return app.Tips({ title: '删除成功', icon: 'success' }, { tab: 3, url: 1 });
    }).catch(err=>{
      return app.Tips({title:err});
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog && this.data.isClose) {
      this.getOrderInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose: true });
  },
})