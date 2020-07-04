import { orderConfirm, getCouponsOrderPrice, orderCreate, postOrderComputed} from '../../api/order.js';
import { getAddressDefault, getAddressDetail } from '../../api/user.js';
import { openPaySubscribe } from '../../utils/SubscribeMessage.js';
import { storeListApi } from '../../api/store.js';
import { CACHE_LONGITUDE, CACHE_LATITUDE } from '../../config.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaStatus:true,
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '提交订单',
      'color': true,
      'class': '0'
    },
    //支付方式
    cartArr: [
      { "name": "微信支付", "icon": "icon-weixin2", value: 'weixin', title: '微信快捷支付' },
      { "name": "余额支付", "icon": "icon-icon-test", value: 'yue',title:'可用余额:'},
      { "name": "线下支付", "icon": "icon-yinhangqia", value: 'offline', title: '线下支付'},
    ],
    payType:'weixin',//支付方式
    openType:1,//优惠券打开方式 1=使用
    active:0,//支付方式切换
    coupon: { coupon: false, list: [], statusTile:'立即使用'},//优惠券组件
    address: {address: false},//地址组件
    addressInfo:{},//地址信息
    pinkId:0,//拼团id
    addressId:0,//地址id
    couponId:0,//优惠券id
    cartId:'',//购物车id
    userInfo:{},//用户信息
    mark:'',//备注信息
    couponTitle:'请选择',//优惠券
    coupon_price:0,//优惠券抵扣金额
    useIntegral:false,//是否使用积分
    integral_price:0,//积分抵扣金额
    ChangePrice:0,//使用积分抵扣变动后的金额
    formIds:[],//收集formid
    status:0,
    is_address:false,
    isClose:false,
    toPay:false,//修复进入支付时页面隐藏从新刷新页面
    shippingType:0,
    system_store:{},
    storePostage:0,
    contacts:'',
    contactsTel:'',
    mydata: {},
    storeList: []
  },
  /**
   * 授权回调事件
   * 
  */
  onLoadFun:function(){
    this.getaddressInfo();
    this.getConfirm();
    //调用子页面方法授权后执行获取地址列表
    this.selectComponent('#address-window').getAddressList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ textareaStatus: true });
    if (app.globalData.isLog && this.data.isClose && this.data.toPay==false) {
      this.getaddressInfo();
      this.selectComponent('#address-window').getAddressList();
    }
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    if (currPage.data.storeItem){
      let json = currPage.data.storeItem;
      this.setData({
        system_store: json,
      });
    }
  },
  /**
  * 获取门店列表数据
 */
  getList: function () {
    let longitude = wx.getStorageSync(CACHE_LONGITUDE); //经度
    let latitude = wx.getStorageSync(CACHE_LATITUDE); //纬度
    let data = {
      latitude: latitude, //纬度
      longitude: longitude, //经度
      page: 1,
      limit: 10
    }
    storeListApi(data).then(res => {
      let list = res.data.list || [];
      this.setData({
        storeList: list,
        system_store: list[0],
      });
    }).catch(err => {

    })
  },
  /*
 * 跳转门店列表
 */
  showStoreList: function () {
    wx.navigateTo({
      url: '/pages/goods_details_store/index?go=order'
    })
  },
  computedPrice:function(){
    let shippingType = this.data.shippingType;
    postOrderComputed(this.data.orderKey,{
      addressId: this.data.addressId,
      useIntegral: this.data.useIntegral ? 1 : 0,
      couponId: this.data.couponId,
      shipping_type: parseInt(shippingType) + 1,
      payType: this.data.payType
    }).then(res=>{
      let result = res.data.result;
      if (result){
        this.setData({ 
          totalPrice: result.pay_price, 
          integral_price: result.deduction_price, 
          coupon_price: result.coupon_price, 
          integral: this.data.useIntegral ? result.SurplusIntegral : this.data.userInfo.integral ,
          'priceGroup.storePostage': shippingType == 1 ? 0 : result.pay_postage,
        });
      }
    })
  },
  addressType:function(e){
    let index = e.currentTarget.dataset.index;
    if (this.data.storeList.length>0){
      this.setData({ shippingType: parseInt(index) });
    }else{
      if(index==1){
        return app.Tips({ title: '暂无门店信息，你无法选择到店自提' });
      }
    }
    this.computedPrice();
  },
  bindPickerChange: function (e) {
    let value = e.detail.value;
    this.setData({shippingType: value})
    this.computedPrice();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ isClose: true });
  },
  ChangCouponsClone:function(){
    this.setData({'coupon.coupon':false});
  },
  changeTextareaStatus:function(){
    for (var i = 0, len = this.data.coupon.list.length; i < len;i++){
      this.data.coupon.list[i].use_title='';
      this.data.coupon.list[i].is_use = 0;
    }
    this.setData({ textareaStatus: true, status: 0, "coupon.list": this.data.coupon.list});
  },
  /**
   * 处理点击优惠券后的事件
   * 
  */
  ChangCoupons:function(e){
    var index = e.detail, list = this.data.coupon.list, couponTitle = '请选择', couponId = 0;
    for (var i = 0, len = list.length; i < len; i++) {
      if(i != index){
        list[i].use_title = '';
        list[i].is_use = 0;
      }
    }
    if (list[index].is_use) {
      //不使用优惠券
      list[index].use_title = '';
      list[index].is_use = 0;
    } else {
      //使用优惠券
      list[index].use_title = '不使用';
      list[index].is_use = 1;
      couponTitle = list[index].coupon_title;
      couponId = list[index].id;
    }
    this.setData({ 
      couponTitle: couponTitle, 
      couponId: couponId, 
      'coupon.coupon': false, 
      "coupon.list":list,
    });
    this.computedPrice();
  },
  /**
   * 使用积分抵扣
  */
  ChangeIntegral:function(){
    this.setData({useIntegral:!this.data.useIntegral});
    this.computedPrice();
  },
  /**
   * 选择地址后改变事件
   * @param object e
  */
  OnChangeAddress:function(e){
    this.setData({ textareaStatus:true,addressId: e.detail,'address.address':false});
    this.getaddressInfo();
    this.computedPrice();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.cartId) return app.Tips({ title:'请选择要购买的商品'},{tab:3,url:1});
    // if (options.shippingType) this.setData({ shippingType: options.shippingType, storeIndex: options.storeIndex });
    this.setData({ 
      couponId: options.couponId || 0, 
      pinkId: options.pinkId ? parseInt(options.pinkId) : 0, 
      addressId: options.addressId || 0, 
      cartId: options.cartId,
      is_address: options.is_address ? true : false
    });
  },
  bindHideKeyboard: function (e) {
    this.setData({mark: e.detail.value});
  },
  /**
   * 获取当前订单详细信息
   * 
  */
  getConfirm:function(){
    var that=this;
    orderConfirm(this.data.cartId).then(res=>{
      that.setData({
        userInfo: res.data.userInfo,
        integral: res.data.userInfo.integral,
        cartInfo: res.data.cartInfo,
        integralRatio: res.data.integralRatio,
        offlinePostage: res.data.offlinePostage,
        orderKey: res.data.orderKey,
        priceGroup: res.data.priceGroup,
        totalPrice: app.help().Add(parseFloat(res.data.priceGroup.totalPrice), parseFloat(res.data.priceGroup.storePostage)),
        seckillId: parseInt(res.data.seckill_id),
        usableCoupon: res.data.usableCoupon,
        // system_store: res.data.system_store,
        store_self_mention: res.data.store_self_mention
      });
      that.data.cartArr[1].title = '可用余额:' + res.data.userInfo.now_money;
      if (res.data.offline_pay_status == 2)  that.data.cartArr.pop();
      that.setData({ cartArr: that.data.cartArr, ChangePrice: that.data.totalPrice });
      that.getBargainId();
      that.getCouponList();
      that.getList();
    }).catch(err=>{
      return app.Tips({ title: err }, { tab: 3, url: 1 });
    });
  },
  /*
  * 提取砍价和拼团id
  */
  getBargainId: function () {
    var that = this;
    var cartINfo = that.data.cartInfo;
    var BargainId = 0;
    var combinationId = 0;
    cartINfo.forEach(function (value, index, cartINfo) {
      BargainId = cartINfo[index].bargain_id,
        combinationId = cartINfo[index].combination_id
    })
    that.setData({ BargainId: parseInt(BargainId), combinationId: parseInt(combinationId)});
    if (that.data.cartArr.length == 3 && (BargainId || combinationId || that.data.seckillId)){
      that.data.cartArr.pop();
      that.setData({ cartArr: that.data.cartArr});
    }
  },
  /**
   * 获取当前金额可用优惠券
   * 
  */
  getCouponList:function(){
    var that=this;
    let data = { cartId: this.data.cartId}
    getCouponsOrderPrice(this.data.totalPrice, data).then(res=>{
      that.setData({ 'coupon.list': res.data, openType: 1 });
    });
  },
  /*
  * 获取默认收货地址或者获取某条地址信息
  */
  getaddressInfo:function(){
    var that=this;
    if(that.data.addressId){
      getAddressDetail(that.data.addressId).then(res=>{
        res.data.is_default = parseInt(res.data.is_default);
        that.setData({ addressInfo: res.data || {}, addressId: res.data.id || 0, 'address.addressId': res.data.id || 0 });
      })
    }else{
      getAddressDefault().then(res=>{
        res.data.is_default = parseInt(res.data.is_default);
        that.setData({ addressInfo: res.data || {}, addressId: res.data.id || 0, 'address.addressId': res.data.id || 0 });
      })
    }
  },
  payItem:function(e){
    var that = this;
    var active = e.currentTarget.dataset.index;
    that.setData({
      active: active,
      animated: true,
      payType: that.data.cartArr[active].value,
    });
    that.computedPrice();
    setTimeout(function () {
      that.car();
    }, 500);
  },
  coupon: function () {
    this.setData({
      'coupon.coupon': true
    })
  },
  car: function () {
    var that = this;
    that.setData({
      animated: false
    });
  },
  onAddress:function(){
    this.setData({
      textareaStatus:false,
      'address.address': true,
      pagesUrl: '/pages/user_address_list/index?cartId=' + this.data.cartId + '&pinkId=' + this.data.pinkId + '&couponId=' + this.data.couponId
    });
  },
  realName:function(e){
    this.setData({
      contacts: e.detail.value
    })
  },
  phone: function (e) {
    this.setData({
      contactsTel: e.detail.value
    })
  },
  SubOrder:function(e){
    var that = this, data={};
    if (!this.data.payType) return app.Tips({title:'请选择支付方式'});
    if (!this.data.addressId && !this.data.shippingType) return app.Tips({ title:'请选择收货地址'});
    if (this.data.shippingType == 1){
      if (this.data.contacts == "" || this.data.contactsTel == "")
        return app.Tips({ title: '请填写联系人或联系人电话' });
      if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.data.contactsTel)) {
        return app.Tips({ title: '请填写正确的手机号' });
      }
      if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(this.data.contacts)) {
        return app.Tips({ title: '请填写您的真实姓名' });
      }
    }
    data={
      real_name: that.data.contacts,
      phone: that.data.contactsTel,
      addressId: that.data.addressId,
      formId: '',
      couponId: that.data.couponId,
      payType: that.data.payType,
      useIntegral: that.data.useIntegral,
      bargainId: that.data.BargainId,
      combinationId: that.data.combinationId,
      pinkId: that.data.pinkId,
      seckill_id: that.data.seckillId,
      mark: that.data.mark,
      store_id: that.data.system_store ? that.data.system_store.id : 0,
      'from':'routine',
      shipping_type: app.help().Add(that.data.shippingType,1)
    };
    if (data.payType == 'yue' && parseFloat(that.data.userInfo.now_money) < parseFloat(that.data.totalPrice)) return app.Tips({title:'余额不足！'});
    wx.showLoading({ title: '订单支付中'});
    openPaySubscribe().then(()=>{
      orderCreate(this.data.orderKey ,data).then(res=>{
        var status = res.data.status, orderId = res.data.result.orderId, jsConfig = res.data.result.jsConfig,
          goPages = '/pages/order_pay_status/index?order_id=' + orderId + '&msg=' + res.msg;
        switch (status) {
          case 'ORDER_EXIST': case 'EXTEND_ORDER': case 'PAY_ERROR':
            wx.hideLoading();
            return app.Tips({ title: res.msg }, { tab: 5, url: goPages });
            break;
          case 'SUCCESS':
            wx.hideLoading();
            if (that.data.BargainId || that.data.combinationId || that.data.pinkId || that.data.seckillId) 
              return app.Tips({ title: res.msg, icon: 'success' }, { tab: 4, url: goPages });
            return app.Tips({ title: res.msg, icon: 'success' }, { tab: 5, url: goPages });
            break;
          case 'WECHAT_PAY':
            that.setData({ toPay: true });
            wx.requestPayment({
              timeStamp: jsConfig.timestamp,
              nonceStr: jsConfig.nonceStr,
              package: jsConfig.package,
              signType: jsConfig.signType,
              paySign: jsConfig.paySign,
              success: function (res) {
                wx.hideLoading();
                if (that.data.BargainId || that.data.combinationId || that.data.pinkId || that.data.seckillId) 
                  return app.Tips({ title: '支付成功', icon: 'success' }, { tab: 4, url: goPages });
                return app.Tips({ title: '支付成功', icon: 'success' }, { tab: 5, url: goPages });
              },
              fail: function (e) {
                wx.hideLoading();
                return app.Tips({ title: '取消支付' }, { tab: 5, url: goPages + '&status=2' });
              },
              complete: function (e) {
                wx.hideLoading();
                //关闭当前页面跳转至订单状态
                if (res.errMsg == 'requestPayment:cancel') return app.Tips({ title: '取消支付' }, { tab: 5, url: goPages + '&status=2' });
              },
            })
            break;
          case 'PAY_DEFICIENCY':
            wx.hideLoading();
            //余额不足
            return app.Tips({ title: res.msg }, { tab: 5, url: goPages + '&status=1' });
            break;
        }
      }).catch(err=>{
        wx.hideLoading();
        return app.Tips({title:err});
      });
    });
  }
})