var app = getApp();
Component({
  properties: {
    iShidden: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  attached: function () {

  },
  methods: {
    cancel: function () {
      this.triggerEvent('cancel', false);
    }
  }
})