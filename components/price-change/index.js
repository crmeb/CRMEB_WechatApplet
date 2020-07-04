import {
  getAdminOrderList,
  setAdminOrderPrice,
  setAdminOrderRemark,
  setOfflinePay,
  setOrderRefund
} from "../../api/admin";
const app = getApp();
Component({
  properties: {
    orderInfo:{
      type:Object,
      value:null,
    },
    change:{
      type:Boolean,
      value:false,
    },
    status:{
      type:Number,
      value:0
    }
  },
  data: {
    remark: '',//备注信息
    price: '',//实际支付
    refund_price: ''//退款金额
  },
  attached: function () {
    this.setData({ price: this.properties.orderInfo.pay_price ? this.properties.orderInfo.pay_price : ''});
  },
  methods: {
     /**
    * 事件回调 
    */
    bindHideKeyboard: function (e) {
      this.setData({ remark: e.detail.value });
    },
     /**
    * 实际支付
    */
    bindPrice: function (e) {
      this.setData({ price: e.detail.value });
    },
     /**
    * 退款金额
    */
    bindRefundPrice: function(e) {
      this.setData({ refund_price: e.detail.value });
    },
     /**
    * 提交
    */
    save: function (e) {
      let type = e.currentTarget.dataset.type;
      this.savePrice(type);
    },
     /**
    * 拒绝退款
    */
    refuse: function (e) {
      let type = e.currentTarget.dataset.type;
      this.savePrice(type);
    },
    /**
    * 事件回调
    * 
    */
    savePrice: function (type) {
      let that = this,
        data = {},
        price = this.data.price,
        remark = this.data.remark,
        refund_price = this.data.refund_price;
        data.order_id = that.data.orderInfo.order_id;
      if (that.data.status == 0 && that.data.orderInfo.refund_status === 0) {
        if (!that.data.price) return app.Tips({ title: '请输入价格' });
        data.price = price;
        // 订单改价
        setAdminOrderPrice(data).then(
          function () {
            that.close();
            app.Tips({ title: '改价成功' });
            that.triggerEvent('getIndex');
          },
          function () {
            that.close();
            app.Tips({ title: '改价失败' });
          }
        );
      } else if (that.data.status == 0 && that.data.orderInfo.refund_status == 1) {
        if (type === '1' && !refund_price) return app.Tips({ title: '请输入退款金额' });
        data.price = refund_price;
        data.type = type;
         // 确认退款 拒绝退款
        setOrderRefund(data).then(
          res => {
            that.close();
            app.Tips({ title: res.msg });
            that.triggerEvent('getIndex');
          },
          err => {
            that.close();
            app.Tips({ title: err });
          }
        );
      } else {
        if(!this.data.remark) return app.Tips({ title: '请输入订单备注' });
        data.remark = remark;
        // 订单备注
        setAdminOrderRemark(data).then(
          res => {
            that.close();
            that.setData({ remark: '' });
            that.triggerEvent('getIndex');
            app.Tips({ title: res.msg });
          },
          err => {
            that.close();
            app.Tips({ title: err });
          }
        );
      }
    },
    close:function(){
      this.triggerEvent('onChangeFun',{action:'change'});
    }
  }
  
})