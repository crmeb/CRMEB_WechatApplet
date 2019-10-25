import { getArticleCategoryList, getArticleList, getArticleHotList, getArticleBannerList} from '../../api/api.js';


const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '资讯',
      'color': false
    },
    imgUrls: [],
    articleList:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    navList:[],
    active: 0,
    page:1,
    limit:8,
    status:false,
    scrollLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getArticleHot: function () {
    var that = this;
    getArticleHotList().then(res=>{
      that.setData({ articleList: res.data });
    });
  },
  getArticleBanner: function () {
    var that = this;
    getArticleBannerList().then(res=>{
      that.setData({ imgUrls: res.data });
    });
  },
  getCidArticle: function () {
    var that = this;
    if (that.data.active == 0) return ;
    var limit = that.data.limit;
    var page = that.data.page;
    var articleList = that.data.articleList;
    if (that.data.status) return ;
    getArticleList(that.data.active, { page: page, limit: limit}).then(res=>{
      var articleListNew = [];
      var len = res.data.length;
      articleListNew = articleList.concat(res.data);
      that.data.page++
      that.setData({ 
        articleList: articleListNew, 
        status: limit > len, 
        page: that.data.page,
      });
    });
  },
  getArticleCate:function(){
    var that = this;
    getArticleCategoryList().then(res=>{
      that.setData({ navList: res.data });
    });
  },
  tabSelect(e) {
    this.setData({
      active: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 50
    })
    if (this.data.active == 0) this.getArticleHot();
    else{
      this.setData({ articleList: [], page: 1, status: false});
      this.getCidArticle();
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
    this.getArticleHot();
    this.getArticleBanner();
    this.getArticleCate();
    this.setData({ status: false, page: 1, articleList:[]});
    this.getCidArticle();
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
    this.getCidArticle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})