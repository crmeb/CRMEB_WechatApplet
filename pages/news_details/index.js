import wxParse from '../../wxParse/wxParse.js';
import { getArticleDetails } from '../../api/api.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '新闻详情',
      'color': false
    },
    id:0,
    articleInfo:[],
    store_info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.hasOwnProperty('id')){
      this.setData({ id: options.id});
    }else{
      wx.navigateBack({delta: 1 });
    }
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
    this.getArticleOne();
  },
  getArticleOne:function(){
    var that = this;
    getArticleDetails(that.data.id).then(res=>{
      that.setData({ 'parameter.title': res.data.title, articleInfo: res.data, store_info: res.data.store_info ? res.data.store_info : {} });
      //html转wxml
      wxParse.wxParse('content', 'html', res.data.content, that, 0);
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.parameter.title,
      path: '/pages/news_details/index?id=' + this.data.id,
      imageUrl: this.data.articleInfo.image_input.length ? this.data.articleInfo.image_input[0] : '',
    }
  }
})