import { CACHE_LONGITUDE, CACHE_LATITUDE } from '../config.js';
//购物车减
var carmin = function (that){
    var num = that.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    that.setData({
      num: num,
      minusStatus: minusStatus
    });
}
//返回首页
var home = function (that, e) {
  if (e.touches[0].clientY < 500 && e.touches[0].clientY > 0) {
    that.setData({
      top: e.touches[0].clientY
    })
  }
}
//购物车加
var carjia = function(that){
    var num = that.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    that.setData({
      num: num,
      minusStatus: minusStatus
    });
}

//倒计时；
var time = function (timeStamp, that) {
  var interval = null,totalSecond = timeStamp - Date.parse(new Date()) / 1000;
  interval = setInterval(function () {
    // 秒数  
    var second = totalSecond;

    // 小时位  
    var hr = Math.floor(second / 3600);
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    var min = Math.floor((second - hr * 3600) / 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    var sec = second - hr * 3600 - min * 60;
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;
    that.setData({
      countDownHour: hrStr,
      countDownMinute: minStr,
      countDownSecond: secStr,
    });
    totalSecond--;
    if (totalSecond <= 0) {
      clearInterval(interval);
      wx.showToast({
        title: '活动已结束',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      that.setData({
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
      });
    }
  }.bind(that), 1000);
  that.setData({ interval: interval});
}

//倒计时2；
var time2 = function (timeStamp, that) {
  var totalSecond = timeStamp - Date.parse(new Date()) / 1000;
  var interval = setInterval(function () {
    // 秒数  
    var second = totalSecond;
    // // 天数位  
    var day = Math.floor(second / 3600 / 24);
    var dayStr = day.toString();
    if (dayStr.length == 1) dayStr = '0' + dayStr;
    // 小时位  
    var hr = Math.floor((second - day * 3600 * 24) / (60 * 60));
    var hrStr = hr.toString();
    if (hrStr.length == 1) hrStr = '0' + hrStr;

    // 分钟位  
    // var min = Math.floor((second - hr * 3600) / 60);
    var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
    var minStr = min.toString();
    if (minStr.length == 1) minStr = '0' + minStr;

    // 秒位  
    // var sec = second - hrNew * 3600 - min * 60;
    var sec = Math.floor(second - day * 3600 * 24 - hr * 3600 - min * 60);
    var secStr = sec.toString();
    if (secStr.length == 1) secStr = '0' + secStr;

    that.setData({
      countDownDay: dayStr,
      countDownHour: hrStr,
      countDownMinute: minStr,
      countDownSecond: secStr,
    });
    totalSecond--;
    if (totalSecond <= 0) {
      clearInterval(interval);
      wx.showToast({
        title: '活动已结束',
      });
      that.setData({
        countDownDay: '00',
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
      });
    }
  }.bind(that), 1000);
  that.setData({ interval: interval});
}
var footan = function(that){
  that.setData({
    prostatus: true,
    show: false
  })
}
var tapsize = function(that,e){
  var $indexs = e.target.dataset.indexs;//内
  var $index = e.target.dataset.index;//外
  that.setData({
    taberindexs: $indexs,
    taberindex: $index
  })
}
var selfLocation = function(showMode) {
  const that = this;
  return new Promise((resolve, reject)=>{
    let longitude = wx.getStorageSync(CACHE_LONGITUDE); //经度
    let latitude = wx.getStorageSync(CACHE_LATITUDE); //纬度
    if (longitude && latitude) {
      return resolve({ longitude: longitude, latitude: latitude});
    }
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.removeStorageSync(CACHE_LONGITUDE);
          wx.removeStorageSync(CACHE_LATITUDE);
          wx.getLocation({
            success: function (res) {
              var latitude = res.latitude;
              var longitude = res.longitude;
              wx.setStorageSync(CACHE_LONGITUDE, longitude);
              wx.setStorageSync(CACHE_LATITUDE, latitude);
              resolve(res);
            },
            fail(res) {
              if (res.errMsg == "getLocation:fail auth deny" && showMode == undefined) {
                wx.showModal({
                  title: '您已经拒绝授权地理位置',
                  content: '是否需要开启权限',
                  success: function (res) {
                    if (res.cancel) {
                      reject(res);
                    } else if (res.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          if (res.authSetting["scope.userLocation"] == true) {
                            wx.showToast({
                              title: '授权成功',
                              icon: 'success',
                              duration: 1000
                            })
                            wx.getLocation({
                              success: function (res) {
                                var latitude = res.latitude;
                                var longitude = res.longitude;
                                wx.setStorageSync(CACHE_LONGITUDE, longitude);
                                wx.setStorageSync(CACHE_LATITUDE, latitude);
                                resolve(res);
                              }
                            })
                          } else {
                            wx.showToast({
                              title: '授权失败',
                              icon: 'none',
                              duration: 1000
                            })
                          }
                        }
                      })
                    }
                  },
                })
              }
            },
          });
        } else {
          wx.getLocation({
            success: function (res) {
              let latitude = res.latitude;
              let longitude = res.longitude;
              wx.setStorageSync(CACHE_LONGITUDE, longitude);
              wx.setStorageSync(CACHE_LATITUDE, latitude);
              resolve(res);
            }
          })
        }
      }
    })
  })
}
module.exports = {
  carmin: carmin,
  carjia: carjia,
  time: time,
  footan: footan,
  tapsize: tapsize,
  home: home,
  time2: time2,
  selfLocation: selfLocation
}