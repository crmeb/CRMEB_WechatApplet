// pages/promoter_rank/index.js
import { getRankList } from '../../api/user.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '推广人排行',
      'color': true,
      'class': '0'
    },
    navList: ["周榜", "月榜"],
    active: 0,
    page:1,
    limit:15,
    type:'week',
    loading:false,
    loadend:false,
    loadTitle:"加载更多",
    rankList:[],
    Two: {},
    One: {},
    Three:{},
  },
  onLoadFun:function(e){
    this.getRanklist();
  },
  getRanklist:function(){
    let that = this;
    if(that.data.loadend) return;
    if(that.data.loading) return;
    that.setData({ loading: true, loadTitle: ""});
    getRankList({
      page:this.data.page,
      limit:this.data.limit,
      type: this.data.type
    }).then(res=>{
      let list = res.data;
      that.data.rankList = that.data.rankList.concat(list);
      if(that.data.page == 1){
        that.data.One=that.data.rankList.shift() || {};
        that.data.Two = that.data.rankList.shift() || {};
        that.data.Three = that.data.rankList.shift() || {};
      }
      let loadend = list.length < that.data.limit;
      that.setData({
        loadend: loadend,
        loading:false,
        rankList: that.data.rankList,
        page: that.data.page+1,
        loadTitle: loadend ? "我也是有底线的" : '加载更多',
        One: that.data.One,
        Two: that.data.Two,
        Three: that.data.Three,
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: "加载更多"});
    })
  },
  
  switchTap:function(e){
    var index = e.currentTarget.dataset.index;
    if (this.data.active === index) return;
    this.setData({
      active:index,
      type: index ? 'month': 'week',
      page:1,
      loadend:false,
      rankList:[],
      Two:{},
      One:{},
      Three:{}
    });
    this.getRanklist();
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
    if(this.data.isClone && app.globalData.isLog){
      this.setData({ loadend: false, page: 1, rankList:[]});
      this.getRanklist();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({isClone:true});
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
    this.getRanklist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})