import { getGroomList } from '../../api/store.js';

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '促销单品'
    },
    loading:false,
    loadend:false,
    page:1,
    limit:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIndexGroomList();
  },
  getIndexGroomList: function(){
    var that=this
    if(this.data.loadend) return false;
    if(this.data.loading) return false;
    that.setData({loading:true,loadTitle:'正在搜索'});
    getGroomList(4,{ page: that.data.page, limit: that.data.limit }).then(res=>{
      var list=res.data.list,loadend=list.length < that.data.limit;
      var bastList = app.SplitArray(list, that.data.bastList);
      that.setData({ 
        loading: false, 
        bastList: bastList,
        page:that.data.page+1,
        loadend: loadend,
        loadTitle: loadend ? '已全部加载' : '加载更多',
        imgUrls: res.data.banner
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: "加载更多" });
    });
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
    this.getIndexGroomList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})