var app = getApp();
Component({
  properties: {
    host_product:{
      type: Object,
      value:[],
    }
  },
  data: {
  },
  attached: function () {
  },
  methods: {
       /**
   * 商品详情跳转
   */
   goDetail: function (e) {
    let item = e.currentTarget.dataset.items
    if (item.activity && item.activity.type === "1") {
      wx.navigateTo({
        url: `/pages/activity/goods_seckill_details/index?id=${item.activity.id}&time=${item.activity.time}&status=1`
      });
    } else if (item.activity && item.activity.type === "2") {
      wx.navigateTo({ url:  `/pages/activity/goods_bargain_details/index?id=${item.activity.id}`});
    } else if (item.activity && item.activity.type === "3") {
      wx.navigateTo({
        url: `/pages/activity/goods_combination_details/index?id=${item.activity.id}`
      });
    } else {
      wx.navigateTo({ url: `/pages/goods_details/index?id=${item.id}` });
    }
   }
  }
})