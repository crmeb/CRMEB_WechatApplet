import { getOrderList, orderData, orderCancel, orderDel, orderPay } from '../../api/order.js';
import { getUserInfo } from '../../api/user.js';
import { openOrderSubscribe } from '../../utils/SubscribeMessage.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '我的订单',
      'color': true,
      'class': '0'
    },
    loading:false,//是否加载中
    loadend:false,//是否加载完毕
    loadTitle:'加载更多',//提示语
    orderList:[],//订单数组
    orderData:{},//订单详细统计
    orderStatus:0,//订单状态
    page:1,
    limit:10,
    isClose:false,
    payMode:[
      { name: "微信支付", icon: "icon-weixinzhifu", value: 'weixin', title: '微信快捷支付' },
      { name: "余额支付", icon: "icon-yuezhifu", value: 'yue', title: '可用余额:',number:0},
    ],
    pay_close:false,
    pay_order_id:'',
    totalPrice:'0',
  },

  /**
   * 登录回调
   * 
  */
  onLoadFun:function(){
    this.getOrderData();
    this.getOrderList();
    this.getUserInfo();
  },
  /**
   * 事件回调
   * 
  */
  onChangeFun:function(e){
    let opt = e.detail;
    let action = opt.action || null;
    let value = opt.value != undefined ? opt.value : null;
    (action && this[action]) && this[action](value);
  },
  /**
   * 获取用户信息
   * 
  */
  getUserInfo:function(){
    let that = this;
    getUserInfo().then(res=>{
      that.data.payMode[1].number = res.data.now_money;
      that.setData({ payMode: that.data.payMode});
    });
  },
  /**
   * 关闭支付组件
   * 
  */
  pay_close:function(){
    this.setData({ pay_close:false});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status) this.setData({ orderStatus:options.status});
    this.setData({ 'parameter.return': options.is_return ? '0' : '1'});
  },
  /**
   * 获取订单统计数据
   * 
  */
  getOrderData:function(){
    var that=this;
    orderData().then(res=>{
      that.setData({ orderData: res.data });
    })
  },
  /**
   * 取消订单
   * 
  */
  cancelOrder:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    var index = e.currentTarget.dataset.index,that=this;
    if (!order_id) return app.Tips({title:'缺少订单号无法取消订单'});
    orderCancel(order_id).then(res=>{
      return app.Tips({ title: res.msg, icon: 'success' }, function () {
        that.data.orderList.splice(index, 1);
        that.setData({ orderList: that.data.orderList, 'orderData.unpaid_count': that.data.orderData.unpaid_count - 1 });
        that.getOrderData();
      });
    }).catch(err=>{
      return app.Tips({title:err});
    });
  },
  /**
   * 打开支付组件
   * 
  */
  goPay:function(e){
    let order_id = e.currentTarget.dataset.order_id, pay_price = e.currentTarget.dataset.pay_price;
    this.setData({ pay_close: true, pay_order_id: order_id, totalPrice: pay_price});
  },
  /**
   * 支付成功回调
   * 
  */
  pay_complete:function(){
    this.setData({ loadend: false, page: 1, orderList: [], pay_close: false, pay_order_id:''});
    this.getOrderData();
    this.getOrderList();
  },
  /**
   * 支付失败回调
   * 
  */
  pay_fail:function(){
    this.setData({ pay_close: false, pay_order_id:''});
  },
  /**
   * 去订单详情
  */
  goOrderDetails:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    if (!order_id) return app.Tips({ title: '缺少订单号无法查看订单详情' });
    wx.showLoading({
      title: '正在加载',
    })
    openOrderSubscribe().then(()=>{
      wx.hideLoading();
      wx.navigateTo({ url: '/pages/order_details/index?order_id=' + order_id })
    }).catch(()=>{
      wx.hideLoading();
    })
  },
  /**
   * 切换类型
  */
  statusClick:function(e){
    var status = e.currentTarget.dataset.status;
    if (status == this.data.orderStatus) return;
    this.setData({ orderStatus: status, loadend: false, page: 1, orderList:[]});
    this.getOrderList();
  },
  /**
   * 获取订单列表
  */
  getOrderList:function(){
    var that=this;
    if(that.data.loadend) return;
    if(that.data.loading) return;
    that.setData({ loading: true, loadTitle:""});
    getOrderList({
      type: that.data.orderStatus,
      page: that.data.page,
      limit: that.data.limit,
    }).then(res=>{
      var list = res.data || [];
      var loadend = list.length < that.data.limit;
      that.data.orderList = app.SplitArray(list, that.data.orderList);
      that.setData({
        orderList: that.data.orderList,
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? "我也是有底线的" : '加载更多',
        page: that.data.page + 1,
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: "加载更多" });
    })
  },

  /**
   * 删除订单
  */
  delOrder:function(e){
    var order_id = e.currentTarget.dataset.order_id;
    var index = e.currentTarget.dataset.index, that = this;
    orderDel(order_id).then(res=>{
      that.data.orderList.splice(index, 1);
      that.setData({ orderList: that.data.orderList, 'orderData.unpaid_count': that.data.orderData.unpaid_count - 1 });
      that.getOrderData();
      return app.Tips({ title: '删除成功', icon: 'success' });
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog && this.data.isClose){
      this.getOrderData();
      this.setData({ loadend: false, page: 1, orderList:[]});
      this.getOrderList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose:true});
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList();
  },
})