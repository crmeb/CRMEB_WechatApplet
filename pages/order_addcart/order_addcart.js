
import { getCartList, getCartCounts, changeCartNum, cartDel} from '../../api/order.js';
import { getProductHot, collectAll  } from '../../api/store.js';

const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '0',
      'title': '购物车',
      'color': false
    },
    navH: 0,
    cartCount:0,
    goodsHidden:true,
    footerswitch: true,
    host_product: [],
    cartList:[],
    isAllSelect:false,//全选
    selectValue:[],//选中的数据
    selectCountPrice:0.00,
    isGoIndex: true,
    iShidden: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      navH: app.globalData.navHeight
    });
    if (app.globalData.token) that.setData({ iShidden:true});
  },
  /**
   * input阻止冒泡
   * 
  */
  proventD: function () { },
   /**
   * 手动输入数量失焦事件
   */
  inputBlur(e) {
    if (e.detail.value < 1) {
      let index = e.currentTarget.dataset.index;
      let item = this.data.cartList.valid[index];
      item.cart_num = 1;
      if (item.cart_num) this.setCartNum(item.id, item.cart_num);
      let itemData = "cartList.valid[" + index + "]";
      this.setData({ [itemData]: item });
      this.switchSelect();
    }
  },
  /**
   * 关闭授权
   * 
  */
  onCloseAuto: function () {
    this.setData({ iShidden: true });
  },
  subDel:function (event) {
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) 
      cartDel(selectValue).then(res=>{
        that.getCartList();
        that.getCartNum();
      });
    else 
      return app.Tips({ title:'请选择产品'});
  },
  getSelectValueProductId:function(){
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var productId = [];
    if (selectValue.length > 0){ for (var index in validList){if(that.inArray(validList[index].id, selectValue)) { productId.push(validList[index].product_id);}}};
    return productId;
  },
  subCollect: function (event){
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0) {
      var selectValueProductId = that.getSelectValueProductId();
      collectAll(that.getSelectValueProductId().join(',')).then(res=>{
        return app.Tips({title:res.msg,icon:'success'});
      }).catch(err=>{
        return app.Tips({ title: err });
      });
    } else {
      return app.Tips({ title:'请选择产品'});
    }
  },
  subOrder: function (event){
    let that = this, selectValue = that.data.selectValue;
    if (selectValue.length > 0){
      wx.navigateTo({url:'/pages/order_confirm/index?cartId=' + selectValue.join(',')});
    }else{
      return app.Tips({ title:'请选择产品'});
    }
  },
  checkboxAllChange: function (event){
    var value = event.detail.value;
    if (value.length > 0) { this.setAllSelectValue(1)}
    else { this.setAllSelectValue(0) }
  },
  setAllSelectValue:function(status){
    var that = this;
    var selectValue = [];
    var valid = that.data.cartList.valid;
    if (valid.length > 0) {
      for (var index in valid) {
        if (status == 1){
          valid[index].checked = true;
          selectValue.push(valid[index].id);
        }else valid[index].checked = false;
      }
      var validData = "cartList.valid";
      that.setData({
        [validData]: valid,
        selectValue: selectValue,
      });
      that.switchSelect();
    }
  },
  checkboxChange: function (event){
    var that = this;
    var value = event.detail.value;
    var valid = this.data.cartList.valid;
    for (var index in valid){
      if (that.inArray(valid[index].id, value)) valid[index].checked = true;
      else valid[index].checked = false;
    }
    var validData = "cartList.valid";
    this.setData({ 
      [validData]: valid,
      isAllSelect: value.length == this.data.cartList.valid.length,
      selectValue: value,
    })
    this.switchSelect();
  },
  inArray:function(search, array){
    for (var i in array) { if (array[i] == search) { return true; } }
    return false;
  },
  switchSelect:function(){
    var that = this;
    var validList = that.data.cartList.valid;
    var selectValue = that.data.selectValue;
    var selectCountPrice  = 0.00;
    if (selectValue.length < 1) { that.setData({ selectCountPrice: selectCountPrice }); }
    else{
      for (var index in validList){
        if (that.inArray(validList[index].id, selectValue)){
          selectCountPrice = Number(selectCountPrice) + Number(validList[index].cart_num) * Number(validList[index].truePrice)
        }
      }
      that.setData({ selectCountPrice: selectCountPrice.toFixed(2) });
    }
  },
  subCart:function(event){
    var that = this;
    var status = false;
    var index = event.currentTarget.dataset.index;
    var item = that.data.cartList.valid[index];
    item.cart_num = item.cart_num - 1;
    if (item.cart_num < 1) status = true;
    if (item.cart_num <= 1) { 
      item.cart_num = 1;
      item.numSub = true; 
    } else { item.numSub = false;item.numAdd = false; }
    if (false == status) {
      that.setCartNum(item.id, item.cart_num, function (data) {
        var itemData = "cartList.valid[" + index + "]";
        that.setData({ [itemData]: item });
        that.switchSelect();
      });
    }
  },
  /**
   * 购物车手动填写
   * 
  */
  iptCartNum: function (e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.cartList.valid[index];
    item.cart_num = e.detail.value;
    if (item.cart_num) this.setCartNum(item.id, item.cart_num);
    let itemData = "cartList.valid[" + index + "]";
    this.setData({ [itemData]: item });
    this.switchSelect();
  },
  addCart: function (event) {
    var that = this;
    var index = event.currentTarget.dataset.index;
    var item = that.data.cartList.valid[index];
    item.cart_num = parseInt(item.cart_num) + 1;
    var productInfo = item.productInfo;
    if (productInfo.hasOwnProperty('attrInfo') && item.cart_num >= item.productInfo.attrInfo.stock) {
      item.cart_num = item.productInfo.attrInfo.stock;
      item.numAdd = true;
      item.numSub = false; 
    } else if (item.cart_num >= item.productInfo.stock) {
      item.cart_num = item.productInfo.stock;
      item.numAdd = true;
      item.numSub = false; 
    } else { item.numAdd = false; item.numSub = false; }
    that.setCartNum(item.id, item.cart_num, function (data) {
      var itemData = "cartList.valid[" + index + "]";
      that.setData({ [itemData]: item });
      that.switchSelect();
    });
  },
  setCartNum(cartId, cartNum, successCallback) {
    var that = this;
    changeCartNum(cartId, cartNum).then(res=>{
      successCallback && successCallback(res.data);
    });
  },
  getCartNum: function () {
    var that = this;
    getCartCounts().then(res=>{
      that.setData({ cartCount: res.data.count });
    });
  },
  getCartList: function () {
    var that = this;
    getCartList().then(res=>{
      var cartList = res.data;
      var valid = cartList.valid;
      var numSub = [{ numSub: true }, { numSub: false }];
      var numAdd = [{ numAdd: true }, { numAdd: false }], selectValue = [];;
      if (valid.length > 0) {
        for (var index in valid) {
          if (valid[index].cart_num == 1) { valid[index].numSub = true; }
          else { valid[index].numSub = false; }
          var productInfo = valid[index].productInfo;
          if (productInfo.hasOwnProperty('attrInfo') && valid[index].cart_num == valid[index].productInfo.attrInfo.stock) {
            valid[index].numAdd = true;;
          } else if (valid[index].cart_num == valid[index].productInfo.stock) {
            valid[index].numAdd = true;;
          } else { valid[index].numAdd = false; }
          valid[index].checked = true;
          selectValue.push(valid[index].id);
        }
      }
      that.setData({ 
        cartList: cartList, 
        goodsHidden: cartList.valid.length <= 0 ? false : true, 
        selectValue: selectValue, 
        isAllSelect: valid.length == selectValue.length && valid.length
      });
      that.switchSelect();
    });
  },
  getHostProduct: function () {
    var that = this;
    getProductHot().then(res=>{
      that.setData({ host_product: res.data });
    });
  },
  goodsOpen:function(){
     var that = this;
     that.setData({
       goodsHidden: !that.data.goodsHidden
     })
  },
  manage:function(){
    var that = this;
    that.setData({
      footerswitch: !that.data.footerswitch
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoadFun: function () {
    this.getHostProduct();
    this.getCartList();
    this.getCartNum();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLog == true) {
      this.getHostProduct();
      this.getCartList();
      this.getCartNum();
      this.setData({
        goodsHidden: true,
        footerswitch: true,
        host_product: [],
        cartList: [],
        isAllSelect: false,//全选
        selectValue: [],//选中的数据
        selectCountPrice: 0.00,
        cartCount: 0,
        iShidden:true
      });
    }
  },
  unsetCart:function(){
    let that=this,ids=[];
    for (var i = 0, len = that.data.cartList.invalid.length;i < len;i++){
      ids.push(that.data.cartList.invalid[i].id);
    }
    cartDel(ids).then(res=>{
      app.Tips({ title: '清除成功' });
      that.setData({ 'cartList.invalid': [] });
    }).catch(res=>{

    });
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

})