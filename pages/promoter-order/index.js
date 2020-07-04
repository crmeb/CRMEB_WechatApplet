// pages/promoter-order/index.js

import { spreadOrder } from '../../api/user.js';


const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '推广人订单',
      'color':true,
      'class':'0'
    },
    loading: false,//是否加载中
    loadend: false,//是否加载完毕
    loadTitle: '加载更多',//提示语
    page: 1,
    limit: 5,
    recordList: [],
    recordCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getRecordOrderList();
  },
  getRecordOrderList: function () {
    var that = this;
    if (that.data.loadend) return;
    if (that.data.loading) return;
    that.setData({ loading: true, loadTitle: "" });
    var page = that.data.page;
    var limit = that.data.limit;
    spreadOrder({ page: page, limit: limit }).then(res=>{
      var list = res.data.list || [];
      var loadend = list.length < that.data.limit;
      var recordList = that.data.recordList;
      recordList = recordList.concat(res.data.list);
      that.setData({
        recordList: recordList,
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? "我也是有底线的" : '加载更多',
        page: that.data.page + 1,
        recordCount: res.data.count
      });
    }).catch(function(){
      that.setData({ loading: false, loadTitle: "加载更多" });
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    this.getRecordOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})