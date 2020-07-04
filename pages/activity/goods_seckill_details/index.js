import wxh from '../../../utils/wxh.js';
import wxParse from '../../../wxParse/wxParse.js';
import { getSeckillDetail } from '../../../api/activity.js';
import { postCartAdd, collectAdd, collectDel } from '../../../api/store.js';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    time:0,
    countDownHour: "00",
    countDownMinute: "00",
    countDownSecond: "00",
    storeInfo:[],
    imgUrls: [],
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '抢购详情页',
      'color': false
    },
    attribute: {
      'cartAttr': false
    },
    productSelect: [],
    productAttr: [],
    productValue: [],
    isOpen: false,
    attr: '请选择',
    attrValue: '',
    status: 1,
    isAuto: false,
    iShidden: false,
    limitNum: 1,//限制本属性产品的个数；
    personNum:0, //限制用户购买的个数；
    iSplus:false,
    replyCount: 0,//总评论数量
    reply: [],//评论列表
    replyChance:0,
    navH: "",
    navList: ['商品', '评价', '详情'],
    opacity: 0,
    scrollY: 0,
    topArr: [],
    toView: '',
    height: 0,
    heightArr: [],
    lock: false,
    scrollTop:0
  },
  returns: function () {
    wx.navigateBack();
  },
  tap: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var that = this;
    // if (!this.data.good_list.length && id == "past2") {
    //   id = "past3"
    // }
    this.setData({
      toView: id,
      navActive: index,
      lock: true,
      scrollTop:index>0?that.data.topArr[index]-(app.globalData.navHeight/2):that.data.topArr[index]
    });
  },
  scroll: function (e) {
    var that = this, scrollY = e.detail.scrollTop;
    var opacity = scrollY / 450;
    opacity = opacity > 1 ? 1 : opacity;
    that.setData({
      opacity: opacity,
      scrollY: scrollY
    })
    if (that.data.lock) {
      that.setData({
        lock: false
      })
      return;
    }
    for (var i = 0; i < that.data.topArr.length; i++) {
      if (scrollY < that.data.topArr[i] - (app.globalData.navHeight/2) + that.data.heightArr[i]) {
        that.setData({
          navActive: i
        });
        break
      }
    }
  },
  onLoadFun:function(){
    this.getSeckillDetail();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      navH: app.globalData.navHeight
    });
    //设置商品列表高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
          //res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
        })
      },
    });
    if (options.hasOwnProperty('id') && options.hasOwnProperty('time') && options.hasOwnProperty('status')) {
      this.setData({ id: options.id, time: options.time, status: options.status});
      app.globalData.openPages = '/pages/activity/goods_seckill_details/index?id=' + this.data.id + '&time=' + this.data.time + '&status=' + options.status;
    }else
      return app.Tips({ title:'参数错误'},{tab:3,url:1})
  },
  infoScroll: function () {
    var that = this, topArr = [], heightArr = [];
    for (var i = 0; i < that.data.navList.length; i++) { //productList
      //获取元素所在位置
      var query = wx.createSelectorQuery().in(this);
      var idView = "#past" + i;
      // if (!that.data.good_list.length && i == 2) {
      //   var idView = "#past" + 3;
      // }
      query.select(idView).boundingClientRect();
      query.exec(function (res) {
        var top = res[0].top;
        var height = res[0].height;
        topArr.push(top);
        heightArr.push(height);
        that.setData({
          topArr: topArr,
          heightArr: heightArr
        });
      });
    };
  },
  onMyEvent: function (e) {
    this.setData({ 'attribute.cartAttr': e.detail.window, isOpen: false })
  },
   /**
   * 收藏商品
   */
  setCollect: function () {
    if (app.globalData.isLog === false) {
      this.setData({
        isAuto: true,
        iShidden: false,
      });
    } else {
      var that = this;
      if (this.data.storeInfo.userCollect) {
        collectDel(this.data.storeInfo.product_id).then(res => {
          that.setData({
            ['storeInfo.userCollect']: !that.data.storeInfo.userCollect
          })
        })
      } else {
        collectAdd(this.data.storeInfo.product_id).then(res => {
          that.setData({
            ['storeInfo.userCollect']: !that.data.storeInfo.userCollect
          })
        })
      }
    }
  },
   /**
   * 购物车手动填写
   * 
  */
  iptCartNum: function (e) {
    this.data.productSelect.cart_num = e.detail;
    this.setData({
      productSelect: this.data.productSelect,
      cart_num: e.detail
    })
  },
  /**
   * 购物车数量加和数量减
   * 
  */
  ChangeCartNum: function (e) {
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    var productSelect = this.data.productValue[this.data.attrValue];
    //如果没有属性,赋值给商品默认库存
    if (productSelect === undefined && !this.data.productAttr.length) productSelect = this.data.productSelect;
    //不存在不加数量
    if (productSelect === undefined) return;
    
    if (this.data.cart_num) {
      productSelect.cart_num = this.data.cart_num;
    }
    //提取库存
    var stock = productSelect.stock || 0;
    var productStock = productSelect.product_stock || 0;
    var quota = productSelect.quota || 0;
    var quotaShow = productSelect.quota_show || 0;
    var num = this.data.storeInfo.num || 0;
    //设置默认数据
    if (productSelect.cart_num == undefined) productSelect.cart_num = 1;
    //数量+
    if (changeValue) {
      productSelect.cart_num++;
      //大于库存时,等于库存
      let arrMin = [];
      arrMin.push(num);
      arrMin.push(quota);
      arrMin.push(productStock);
      let minN = Math.min.apply(null,arrMin);
      if (productSelect.cart_num >= minN) productSelect.cart_num = minN ? minN : 1;
      // if (quotaShow >= productStock) {
      //   if (productSelect.cart_num >= productStock) productSelect.cart_num = productStock;
      // } else {
      //   if (productSelect.cart_num >= quotaShow) productSelect.cart_num = quotaShow;
      // }
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    } else {
      //数量减
      productSelect.cart_num--;
      //小于1时,等于1
      if (productSelect.cart_num < 1) productSelect.cart_num = 1;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 属性变动赋值
   * 
  */
  ChangeAttr: function (e) {
    var values = e.detail;
    var productSelect = this.data.productValue[values];
    var storeInfo = this.data.storeInfo;
    this.setData({
      cart_num: 1,
      ["productSelect.num"]: storeInfo.num
    });
    if (productSelect) {
      this.setData({
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.quota"]: productSelect.quota,
        ["productSelect.stock"]: productSelect.stock,
        ["productSelect.quota_show"]: productSelect.quota_show,
        ["productSelect.product_stock"]: productSelect.product_stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        attrValue: values,
        attr: '已选择'
      });
    } else {
      this.setData({
        ["productSelect.image"]: storeInfo.image,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.quota_show"]: 0,
        ["productSelect.quota"]: 0,
        ['productSelect.unique']: '',
        ['productSelect.cart_num']: 1,
        attrValue: '',
        attr: '请选择'
      });
    }
  },
   /**
   * 默认选中属性
   * 
  */
  DefaultSelect: function () {
    var productAttr = this.data.productAttr, storeInfo = this.data.storeInfo, productValue = this.data.productValue, value = [];
    for (var key in productValue) {
      if (productValue[key].quota > 0 && productValue[key].product_stock > 0) {
        value = this.data.productAttr.length ? key.split(",") : [];
        break;
      }
    }
    for (var i = 0, len = productAttr.length; i < len; i++) {
      if (productAttr[i].attr_value[0]) productAttr[i].checked = value[i];
    }
    var productSelect = this.data.productValue[value.sort().join(',')];
    if (productSelect) {
      this.setData({
        ["productSelect.store_name"]: storeInfo.store_name,
        ["productSelect.image"]: productSelect.image,
        ["productSelect.price"]: productSelect.price,
        ["productSelect.quota"]: productSelect.quota,
        ["productSelect.stock"]: productSelect.stock,
        ["productSelect.quota_show"]: productSelect.quota_show,
        ["productSelect.product_stock"]: productSelect.product_stock,
        ['productSelect.unique']: productSelect.unique,
        ['productSelect.cart_num']: 1,
        attrValue: value,
        attr: '已选择'
      });
    } else {
      this.setData({
        ["productSelect.store_name"]: storeInfo.store_name,
        ["productSelect.image"]: storeInfo.image,
        ["productSelect.price"]: storeInfo.price,
        ["productSelect.quota_show"]: storeInfo.quota_show || 0,
        ["productSelect.quota"]: storeInfo.quota || 0,
        ["productSelect.product_stock"]: storeInfo.product_stock || 0,
        ['productSelect.unique']: '',
        ['productSelect.cart_num']: 1,
        attrValue: '',
        attr: '请选择'
      });
    }
    this.setData({ productAttr: productAttr, ["productSelect.num"]: storeInfo.num, cart_num: 1});
  },
  selecAttr: function () {
    if(this.data.status == 1)
    this.setData({
      'attribute.cartAttr': true
    });
  },
  /*
  *  单独购买
  */
  openAlone: function () {
    wx.navigateTo({
      url: `/pages/goods_details/index?id=${this.data.storeInfo.product_id}`
    })

  },
  /*
  *  下订单
  */
  goCat: function () {
    var that = this;
    var productSelect = this.data.productValue[this.data.attrValue];
    //打开属性
    if (this.data.isOpen)
      this.setData({ 'attribute.cartAttr': true })
    else
      this.setData({ 'attribute.cartAttr': !this.data.attribute.cartAttr });
    //只有关闭属性弹窗时进行加入购物车
    if (this.data.attribute.cartAttr === true && this.data.isOpen == false) return this.setData({ isOpen: true });
    //如果有属性,没有选择,提示用户选择
    if (this.data.productAttr.length && productSelect === undefined && this.data.isOpen == true) return app.Tips({ title: '请选择属性' });
    postCartAdd({
      productId: that.data.storeInfo.product_id,
      secKillId: that.data.id,
      bargainId: 0,
      combinationId: 0,
      cartNum: that.data.cart_num,
      uniqueId: productSelect !== undefined ? productSelect.unique : '',
      'new': 1
    }).then(res=>{
      that.setData({ isOpen: false });
      wx.navigateTo({ url: '/pages/order_confirm/index?cartId=' + res.data.cartId });
    }).catch(err=>{
      return app.Tips({title:err});
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isClone && app.globalData.isLog) this.getSeckillDetail();
  },
  getSeckillDetail: function () {
    let that = this;
    getSeckillDetail(that.data.id).then(res=>{
      let title = res.data.storeInfo.title;
      that.setData({
        // ["parameter.title"]: title.length > 10 ? title.substring(0, 10) + '...' : title,
        storeInfo: res.data.storeInfo,
        imgUrls: res.data.storeInfo.images,
        productAttr: res.data.productAttr,
        productValue: res.data.productValue,
        personNum: res.data.storeInfo.num,
        replyCount: res.data.replyCount,
        reply: res.data.reply ? [res.data.reply] : [],
        replyChance: res.data.replyChance
      });
      that.setProductSelect();
      that.DefaultSelect();
      setTimeout(function () {
        that.infoScroll();
      }, 500);
      app.globalData.openPages = '/pages/activity/goods_seckill_details/index?id=' + that.data.id + '&time=' + that.data.time + '&status=' + that.data.status + '&scene=' + that.data.storeInfo.uid;
      wxParse.wxParse('description', 'html', that.data.storeInfo.description || '', that, 0);
      wxh.time(that.data.time, that);
    }).catch(err=>{
      return app.Tips({ title: err }, { tab: 3, url: 1 });
    });
  },
  setProductSelect:function(){
    var that = this;
    if (that.data.productSelect.length == 0){
      that.setData({
        ['productSelect.image']: that.data.storeInfo.image,
        ['productSelect.store_name']: that.data.storeInfo.title,
        ['productSelect.price']: that.data.storeInfo.price,
        ['productSelect.quota']: that.data.storeInfo.quota,
        ['productSelect.unique']: '',
        ['productSelect.cart_num']: 1,
        cart_num: 1,
        ["productSelect.num"]: that.data.storeInfo.num,
        ['productSelect.is_on']: that.data.storeInfo.num <= 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    var that = this;
    return {
      title: that.data.storeInfo.title,
      path: app.globalData.openPages ,
      imageUrl: that.data.storeInfo.image,
      success: function () {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})