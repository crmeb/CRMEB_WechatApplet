// pages/commission_rank/index.js
import { getBrokerageRank } from '../../api/user.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '佣金排行',
      'color': true,
      'class': '0'
    },
    navList: ["周排行", "月排行"],
    active: 0,
    rankList:[],
    page:1,
    limit:10,
    loadend:false,
    loading:false,
    loadTitle:'加载更多',
    type:'week',
    position:0,
  },
  switchTap:function(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      active: index,
      type: index ? 'month': 'week',
      page:1,
      loadend:false,
      rankList:[],
    });
    this.getBrokerageRankList();
  },
  onLoadFun:function(){
    this.getBrokerageRankList();
  },
  getBrokerageRankList:function(){
    if(this.data.loadend) return;
    if(this.data.loading) return;
    this.setData({loading:true,loadTitle:''});
    getBrokerageRank({
      page:this.data.page,
      limit:this.data.limit,
      type:this.data.type
    }).then(res=>{
      let list = res.data.rank;
      let loadend = list.length < this.data.limit;
      this.data.rankList.push.apply(this.data.rankList, list);
      this.setData({
        loading:false,
        loadend: loadend,
        loadTitle: loadend ? '😕我也是有底线的':'加载更多',
        rankList: this.data.rankList,
        position: res.data.position
      });
    }).catch(err=>{
      this.setData({loading:false,loadTitle:'加载更多'});
    })
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
    if (this.data.isClone && app.globalData.isLog){
      this.setData({ page: 1, loadend: false, rankList:{}});
      this.getBrokerageRankList();
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
    this.getBrokerageRankList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})