// pages/distribution-posters/index.js

import { spreadBanner, userShare } from '../../api/user.js';


const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '分销海报'
    },
    imgUrls: [],
    indicatorDots: false,
    circular: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    swiperIndex: 0,
    spreadList:[],
    userInfo:{},
    poster:'',
  },
  onLoadFun:function(e){
    this.setData({ userInfo: e.detail});
    this.userSpreadBannerList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindchange(e) {
    var spreadList = this.data.spreadList;
    this.setData({
      swiperIndex: e.detail.current,
      poster: spreadList[e.detail.current].poster,
    })
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
    this.data.isClone && this.userSpreadBannerList();
  },
  savePosterPath: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.poster,
      success(resFile) {
        if (resFile.statusCode === 200) {
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    wx.saveImageToPhotosAlbum({
                      filePath: resFile.tempFilePath,
                      success: function (res) {
                        return app.Tips({ title: '保存成功' });
                      },
                      fail: function (res) {
                        return app.Tips({ title: res.errMsg });
                      },
                      complete: function (res) { },
                    })
                  },
                  fail(){
                    wx.showModal({
                      title: '您已拒绝获取相册权限',
                      content: '是否进入权限管理，调整授权？',
                      success(res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success: function (res) {
                              console.log(res.authSetting)
                            }
                          });
                        } else if (res.cancel) {
                          return app.Tips({ title: '已取消！' });
                        }
                      }
                    })
                  }
                })
              } else {
                wx.saveImageToPhotosAlbum({
                  filePath: resFile.tempFilePath,
                  success: function (res) {
                    return app.Tips({ title: '保存成功' });
                  },
                  fail: function (res) {
                    return app.Tips({ title: res.errMsg });
                  },
                  complete: function (res) { },
                })
              }
            },
            fail(res){
            
            }
          })
        }else{
          return app.Tips({ title: resFile.errMsg});
        }
      },
      fail(res) {
        return app.Tips({ title: res.errMsg});
      }
    })
  },
  userSpreadBannerList: function () {
    var that = this;
    wx.showLoading({
      title: '获取中',
      mask: true,
    })
    spreadBanner().then(res=>{
      wx.hideLoading();
      that.setData({ spreadList: res.data, poster: res.data[0].poster });
    }).catch(err=>{
      wx.hideLoading();
    });
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

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    userShare();
    return {
      title: this.data.userInfo.nickname+'-分销海报',
      imageUrl: this.data.spreadList[0],
      path: '/pages/index/index?spid=' + this.data.userInfo.uid,
    };
  }
})