// pages/apply-return/index.js
import { ordeRefundReason, orderRefundVerify, getOrderDetail} from '../../api/order.js';
import util from '../../utils/util.js';


const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '申请退货',
      'color': false
    },
    refund_reason_wap_img:[],
    orderInfo:{},
    RefundArray: [],
    index: 0,
    orderId:0,
  },
  /**
   * 授权回调
   * 
  */
  onLoadFun:function(){
    this.getOrderInfo();
    this.getRefundReason();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.orderId) return app.Tips({title:'缺少订单id,无法退款'},{tab:3,url:1});
    this.setData({orderId:options.orderId});
  },
  /**
   * 获取订单详情
   * 
  */
  getOrderInfo:function(){
    var that=this;
    getOrderDetail(that.data.orderId).then(res=>{
      that.setData({ orderInfo: res.data });
    });
  },
  /**
   * 获取退款理由
  */
  getRefundReason:function(){
    var that=this;
    ordeRefundReason().then(res=>{
      that.setData({ RefundArray: res.data });
    })
  },

  /**
   * 删除图片
   * 
  */
  DelPic:function(e){
    var index = e.target.dataset.index, that = this, pic = this.data.refund_reason_wap_img[index];
    that.data.refund_reason_wap_img.splice(index, 1);
    that.setData({ refund_reason_wap_img: that.data.refund_reason_wap_img });
  },

  /**
   * 上传文件
   * 
  */
  uploadpic:function(){
    var that=this;
    util.uploadImageOne('upload/image',function(res){
      that.data.refund_reason_wap_img.push(res.data.url);
      that.setData({ refund_reason_wap_img: that.data.refund_reason_wap_img});
    });
  },


  /**
   * 申请退货
  */
  subRefund:function(e){
    var that = this, value = e.detail.value;
    //收集form表单
    // if (!value.refund_reason_wap_explain) return app.Tips({title:'请输入退款原因'});
    orderRefundVerify({
      text: that.data.RefundArray[that.data.index] || '',
      refund_reason_wap_explain: value.refund_reason_wap_explain,
      refund_reason_wap_img: that.data.refund_reason_wap_img.join(','),
      uni: that.data.orderId
    }).then(res=>{
      return app.Tips({ title: '申请成功', icon: 'success' }, { tab: 5, url: '/pages/user_return_list/index?isT=1' });
    }).catch(err=>{
      return app.Tips({ title: err });
    })
  },

  bindPickerChange: function (e) {
    this.setData({index: e.detail.value});
  },

})