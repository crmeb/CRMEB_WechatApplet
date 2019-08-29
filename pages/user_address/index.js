import { editAddress, getAddressDetail} from '../../api/user.js';
import { setFormId } from '../../api/api.js';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '添加地址'
    },
    region: ['省', '市', '区'],
    cartId:'',//购物车id
    pinkId:0,//拼团id
    couponId:0,//优惠券id
    id:0,//地址id
    userAddress: { is_default:false},//地址详情
  },
  /**
   * 授权回调
   * 
  */
  onLoadFun:function(){
    this.getUserAddress();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cartId: options.cartId || '',
      pinkId: options.pinkId || 0,
      couponId: options.couponId || 0,
      id: options.id || 0,
      'parameter.title': options.id ? '修改地址' : '添加地址'
    });
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  getUserAddress:function(){
    if(!this.data.id) return false;
    var that=this;
    getAddressDetail(this.data.id).then(res=>{
      var region = [res.data.province, res.data.city, res.data.district];
      that.setData({
        userAddress: res.data,
        region: region,
      });
    });
  },
  getWxAddress:function(){
    var that = this;
    wx.authorize({
      scope: 'scope.address',
      success: function (res) {
        wx.chooseAddress({
          success: function (res) {
            var addressP = {};
            addressP.province = res.provinceName;
            addressP.city = res.cityName;
            addressP.district = res.countyName;
            editAddress({
              address: addressP,
              is_default: 1,
              real_name: res.userName,
              post_code: res.postalCode,
              phone: res.telNumber,
              detail: res.detailInfo,
              id: 0
            }).then(res => {
              setTimeout(function () {
                if (that.data.cartId) {
                  var cartId = that.data.cartId;
                  var pinkId = that.data.pinkId;
                  var couponId = that.data.couponId;
                  that.setData({ cartId: '', pinkId: '', couponId: '' })
                  wx.navigateTo({
                    url: '/pages/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.data.id ? that.data.id : res.data.id) + '&pinkId=' + pinkId + '&couponId=' + couponId
                  });
                } else {
                  wx.navigateBack({ delta: 1 });
                }
              }, 1000);
              return app.Tips({ title: "添加成功", icon: 'success' });
            }).catch(err => {
              return app.Tips({ title: err });
            });
          },
          fail: function (res) {
            if (res.errMsg == 'chooseAddress:cancel') return app.Tips({ title: '取消选择' });
          },
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '您已拒绝导入微信地址权限',
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
      },
    })
  },
  /**
   * 提交用户添加地址
   * 
  */
  formSubmit:function(e){
    var that = this, value = e.detail.value, formId=e.detail.formId;
    if (!value.real_name) return app.Tips({title:'请填写收货人姓名'});
    if (!value.phone) return app.Tips({title:'请填写联系电话'});
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return app.Tips({title:'请输入正确的手机号码'});
    if (that.data.region[0] =='省') return app.Tips({title:'请选择所在地区'});
    if (!value.detail) return app.Tips({title:'请填写详细地址'});
    value.id=that.data.id;
    value.address={
      province:that.data.region[0],
      city: that.data.region[1],
      district: that.data.region[2],
    };
    value.is_default = that.data.userAddress.is_default ? 1 : 0;
    setFormId(formId)
    editAddress(value).then(res=>{
      if (that.data.id)
        app.Tips({ title: '修改成功', icon: 'success' });
      else
        app.Tips({ title: '添加成功', icon: 'success' });
      setTimeout(function () {
        if (that.data.cartId) {
          var cartId = that.data.cartId;
          var pinkId = that.data.pinkId;
          var couponId = that.data.couponId;
          that.setData({ cartId: '', pinkId: '', couponId: '' })
          wx.navigateTo({
            url: '/pages/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.data.id ? that.data.id : res.data.id) + '&pinkId=' + pinkId + '&couponId=' + couponId
          });
        } else {
          wx.navigateBack({ delta: 1 });
        }
      }, 1000);
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  ChangeIsDefault:function(e){
    this.setData({ 'userAddress.is_default': !this.data.userAddress.is_default});
  },

})