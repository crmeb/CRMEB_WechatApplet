import wxh from '../../../utils/wxh.js';
import { getSeckillIndexTime, getSeckillList } from '../../../api/activity.js';


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImage:'',
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '限时秒杀',
      'color': false
    },
    seckillList:[],
    timeList:[],
    active:5,
    scrollLeft:0,
    interval:0,
    status:1,
    countDownHour: "00",
    countDownMinute: "00",
    countDownSecond: "00",
    page : 1,
    limit : 20,
    loading:false,
    loadend:false,
    pageloading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.getSeckillConfig();
  },
  goDetails:function(e){
    wx.navigateTo({
      url: '/pages/activity/goods_seckill_details/index?id=' + e.currentTarget.dataset.id + '&time=' + this.data.timeList[this.data.active].stop,
    })
  },
  settimeList:function(e){
    var that = this;
    that.setData({ active: e.currentTarget.dataset.index });
    if (that.data.interval) {
      clearInterval(that.data.interval);
      that.setData({ interval: null });
    }
    that.setData({ 
      interval: 0, 
      countDownHour: "00",
      countDownMinute: "00",
      countDownSecond: "00",
      status: that.data.timeList[that.data.active].status,
      loadend:false,
      page:1,
      seckillList:[],
    });
    wxh.time(e.currentTarget.dataset.stop, that);
    that.getSeckillList();
  },
  getSeckillConfig: function () {
    let that = this; 
    getSeckillIndexTime().then(res=>{
      that.setData({ topImage: res.data.lovely, timeList: res.data.seckillTime, active: res.data.seckillTimeIndex });
      if (that.data.timeList.length) {
        wxh.time(that.data.timeList[that.data.active].stop, that);
        that.setData({ scrollLeft: (that.data.active - 1.37) * 100 });
        setTimeout(function () { that.setData({ loading: true }) }, 2000);
        that.setData({ seckillList: [], offset: 0 });
        that.setData({ status: that.data.timeList[that.data.active].status });
        that.getSeckillList();
      }
    });
  },
  getSeckillList: function () {
    var that = this; 
    var data = { page: that.data.page, limit: that.data.limit};
    if (that.data.loadend) return ;
    if (that.data.pageloading) return ;
    that.setData({ pageloading:true});
    getSeckillList(that.data.timeList[that.data.active].id, data).then(res=>{
      var seckillList = that.data.seckillList;
      var loadend = seckillList.length < that.data.limit;
      that.data.page++;
      that.setData({
        seckillList: seckillList.concat(res.data),
        offset: that.data.page,
        pageloading: false,
        loadend: loadend
      });
    }).catch(err=>{
      that.setData({ pageloading:false});
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
    if(this.data.interval){
      clearInterval(this.data.interval);
      this.setData({ interval: null });
    }
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
    this.getSeckillList();
  }
})