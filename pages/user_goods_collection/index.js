// pages/collectionGoods/index.js

import { getCollectUserList, getProductHot, collectDel} from '../../api/store.js';


const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '收藏商品',
      'color': false
    },
    host_product:[],
    loadTitle:'加载更多',
    loading:false,
    loadend:false,
    collectProductList:[],
    limit:8,
    page:1,
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.get_user_collect_product();
    this.get_host_product();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取收藏产品
  */
  get_user_collect_product:function(){
    var that=this;
    if (this.data.loading) return;
    if (this.data.loadend) return;
    that.setData({ loading: true, loadTitle:''});
    getCollectUserList({ page: that.data.page,limit: that.data.limit}).then(res=>{
      var collectProductList = res.data;
      var loadend = collectProductList.length < that.data.limit;
      console.log(collectProductList.length);
      that.data.collectProductList = app.SplitArray(collectProductList, that.data.collectProductList);
      that.setData({
        collectProductList: that.data.collectProductList,
        loadend: loadend,
        loadTitle: loadend ? '我也是有底线的' : '加载更多',
        page: that.data.page + 1,
        loading: false
      });
    }).catch(err=>{
      that.setData({ loading: false, loadTitle: "加载更多" })
    });
  },
  /**
   * 取消收藏
  */
  delCollection:function(e){
    var id = e.target.dataset.id, that = this, index = e.target.dataset.index;
    collectDel(id).then(res=>{
      return app.Tips({ title: '取消收藏成功', icon: 'success' }, function () {
        that.data.collectProductList.splice(index, 1);
        that.setData({ collectProductList: that.data.collectProductList });
      });
    });
  },
  /**
   * 获取我的推荐
  */
  get_host_product: function () {
    var that = this;
    getProductHot().then(res=>{
      that.setData({ host_product: res.data });
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.get_user_collect_product();
  }
})