import { setCouponReceive } from '../../api/api.js';
const app = getApp();
Component({
  properties: {
    coupon: {
      type: Object,
      value:{
        list:[],
        statusTile:''
      },
    },
    cartId: {
      type: String,
      value: '',
    },
    //打开状态 0=领取优惠券,1=使用优惠券
    openType:{
      type:Number,
      value:0,
    }
  },
  data: {
  },
  attached: function () {
    console.log(this.data.cartId)
  },
  methods: {
    close: function () {
      this.triggerEvent('ChangCouponsClone');
    },
    getCouponUser:function(e){
      var that = this;
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var list = that.data.coupon.list;
      if (list[index].is_use == true && this.data.openType==0) return true;
      switch (this.data.openType){
        case 0:
          //领取优惠券
          setCouponReceive(id).then(res=>{
            list[index].is_use = true;
            that.setData({
              ['coupon.list']: list
            });
            app.Tips({ title: '领取成功' });
            that.triggerEvent('ChangCoupons', list[index]);
          });
        break;
        case 1:
          that.triggerEvent('ChangCoupons',index);
        break;
      }
    },
  }
})