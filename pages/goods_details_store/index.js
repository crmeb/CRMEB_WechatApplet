
import { CACHE_LONGITUDE, CACHE_LATITUDE} from '../../config.js';
import { storeListApi } from '../../api/store.js';
import wxh from '../../utils/wxh.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '门店列表'
    },
    loading: false,//是否加载中
    loadend: false,//是否加载完毕
    loadTitle: '加载更多',//提示语
    page: 1,
    limit: 10,
    isClose: false,
    storeList: [],
    status: ''
    // longitude: '',
    // latitude: ''
  },
  onLoad: function (options) {
    this.setData({ status: options.go });
   // if (options.go === 'order') this.checked();
  },
  /**
  * 登录回调
  * 
  */
  onLoadFun: function () {
    let longitude = wx.getStorageSync(CACHE_LONGITUDE); //经度
    let latitude = wx.getStorageSync(CACHE_LATITUDE); //纬度
    // this.setData({ latitude: latitude, longitude: longitude });
    if (longitude && latitude){
      this.getList(longitude, latitude);
    }else{
      this.selfLocation();
    }
  },
  /**
  * 授权地址
  * 
  */
  selfLocation: function () {
    const that = this;
    wxh.selfLocation().then(res=>{
      that.getList(res.longitude, res.latitude);
    }).catch(()=>{
      that.getList();
    });
  },
  /**
  * 选中门店
  * 
  */
  checked: function (e) {
    let details = e.currentTarget.dataset.details;
    let pages = getCurrentPages();   //当前页面
    let prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
      storeItem: details
    });
    if (this.data.status === 'order') wx.navigateBack({ delta: 1 });
  },
  /**
    * 获取门店列表数据
   */
  getList: function (longitudes, latitudes) {
    if (this.data.loadend) return;
    if (this.data.loading) return;
    this.setData({ loading: true, loadTitle: "" });
    let data={
      latitude: latitudes || '', //纬度
      longitude: longitudes || '', //经度
      page: this.data.page,
      limit: this.data.limit
    }
    storeListApi(data).then(res => {
      let list = res.data.list || [];
      let loadend = list.length < this.data.limit;
      this.data.storeList = app.SplitArray(list, this.data.storeList);
      this.setData({
        storeList: this.data.storeList,
        loadend: loadend,
        loading: false,
        loadTitle: loadend ? "我也是有底线的" : '加载更多',
        page: this.data.page + 1
      });
    }).catch(err => {
      this.setData({ loading: false, loadTitle: "加载更多" });
    })
  },
  /**
   * 拨打电话
  */
  makePhone: function (e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
 * 打开地图
 * 
*/
  showMaoLocation: function (e) {
    let details = e.currentTarget.dataset.details;
    if (!details.latitude || !details.longitude) return app.Tips({ title: '缺少经纬度信息无法查看地图！' });
    wx.openLocation({
      latitude: parseFloat(details.latitude),
      longitude: parseFloat(details.longitude),
      scale: 8,
      name: details.name,
      address: details.address + details.detailed_address,
      success: function () {

      },
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose: true });
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // if (app.globalData.isLog && this.data.isClose) {
    //   this.setData({ loadend: false, page: 1, storeList: [] });
    //   let longitude = wx.getStorageSync(CACHE_LONGITUDE); //经度
    //   let latitude = wx.getStorageSync(CACHE_LATITUDE); //纬度
    //   this.getList(longitude, latitude);
    // }
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    let longitude = wx.getStorageSync(CACHE_LONGITUDE); //经度
    let latitude = wx.getStorageSync(CACHE_LATITUDE); //纬度
    this.getList(longitude, latitude);
  }
})