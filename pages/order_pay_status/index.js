
import { getOrderDetail} from '../../api/order.js';
import { openOrderSubscribe } from '../../utils/SubscribeMessage.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '支付成功'
    },
    orderId:'',
    order_pay_info: { paid :1 }
  },
  onLoadFun:function(){
    this.getOrderPayInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.order_id) return app.Tips({title:'缺少参数无法查看订单支付状态'},{tab:3,url:1});
    this.setData({ orderId: options.order_id, status: options.status || 0, msg: options.msg || ''});
  },
  /**
   * 
   * 支付完成查询支付状态
   * 
  */
  getOrderPayInfo:function(){
    var that=this;
    wx.showLoading({title: '正在加载中'});
    getOrderDetail(this.data.orderId).then(res=>{
      wx.hideLoading();
      that.setData({ order_pay_info: res.data, 'parameter.title': res.data.paid ? '支付成功' : '支付失败' });
    }).catch(err=>{
      wx.hideLoading();
    });
  },
  /**
   * 去首页关闭当前所有页面
  */
  goIndex:function(e){
    wx.switchTab({url:'/pages/index/index'});
  },

  /**
   * 
   * 去订单详情页面
  */
  goOrderDetails:function(e)
  {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    openOrderSubscribe().then(res => {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/order_details/index?order_id=' + that.data.orderId
      });
    }).catch(() => {
      wx.hideLoading();
    });
  }


})