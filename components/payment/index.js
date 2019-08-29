import {  orderPay } from '../../api/order.js';

const app = getApp();

Component({
  properties: {
    payMode:{
      type:Array,
      value:[],
    },
    pay_close:{
      type:Boolean,
      value:false,
    },
    order_id:{
      type:String,
      value:''
    },
    totalPrice:{
      type:String,
      value:'0'
    },
  },
  data: {
  },
  attached: function () {
  },
  methods: {
    close:function(){
      this.triggerEvent('onChangeFun',{action:'pay_close'});
    },
    goPay:function(e){
      let that = this;
      let paytype = e.currentTarget.dataset.value;
      let number = e.currentTarget.dataset.number
      if (!that.data.order_id) return app.Tips({title:'请选择要支付的订单'});
      if (paytype == 'yue' && parseFloat(number) < parseFloat(that.data.totalPrice)) return app.Tips({ title: '余额不足！' });
      wx.showLoading({ title: '支付中' });
      orderPay({ uni: that.data.order_id, paytype: paytype, 'from': 'routine' }).then(res => {
        switch (paytype){
          case 'weixin':
            if (res.data.result === undefined) return app.Tips({title:'缺少支付参数'});
            var jsConfig = res.data.result.jsConfig;
            wx.requestPayment({
              timeStamp: jsConfig.timestamp,
              nonceStr: jsConfig.nonceStr,
              package: jsConfig.package,
              signType: jsConfig.signType,
              paySign: jsConfig.paySign,
              success: function (res) {
                wx.hideLoading();
                return app.Tips({ title: res.msg, icon: 'success' }, () => {
                  that.triggerEvent('onChangeFun', { action: 'pay_complete' });
                });
              },
              fail: function (e) {
                wx.hideLoading();
                return app.Tips({ title: '取消支付' }, () => {
                  that.triggerEvent('onChangeFun', { action: 'pay_fail' });
                });
              },
              complete: function (e) {
                wx.hideLoading();
                if (e.errMsg == 'requestPayment:cancel') return app.Tips({ title: '取消支付' }, () => {
                  that.triggerEvent('onChangeFun', { action: 'pay_fail' });
                });
              },
            });
          break;
          case 'yue':
            wx.hideLoading();
            return app.Tips({ title: res.msg, icon: 'success' }, () => {
              that.triggerEvent('onChangeFun', { action: 'pay_complete' });
            });;
          break;
          case 'offline':
            wx.hideLoading();
            return app.Tips({ title: res.msg, icon: 'success' }, () => {
              that.triggerEvent('onChangeFun', { action: 'pay_complete' });
            });;
          break;
        }
      }).catch(err => {
        wx.hideLoading();
        return app.Tips({ title: err }, () => {
          that.triggerEvent('onChangeFun', { action: 'pay_fail' });
        });
      })
    },
  }
  
})