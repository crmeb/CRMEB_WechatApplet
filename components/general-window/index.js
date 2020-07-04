var app = getApp();
Component({
  properties: {
    generalActive: {
      type: Boolean
    },
    generalContent: {
      type:Object
    }
  },
  data: {},
  attached: function () {
  },
  methods: {
    close: function (){
      this.triggerEvent('generalWindow');
    }
  }
})