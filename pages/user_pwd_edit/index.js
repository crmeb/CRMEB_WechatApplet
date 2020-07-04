import { phoneRegisterReset, registerVerify, verifyCode} from '../../api/api.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '登录',
      'color': true,
      'class': '0'
    },
    disabled: false,
    active: false,
    timetext: '获取验证码',
    userInfo:{},
    phone:'',
    key:'',
    imagesCode:false,
    httpUrl:'',
    captchaimg:''
  },

  inputgetName(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    if (name.indexOf('.') != -1) {
      let nameList = name.split('.')
      if (that.data[nameList[0]]) {
        nameMap[nameList[0]] = that.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      nameMap[nameList[0]][nameList[1]] = e.detail.value
    } else {
      nameMap[name] = e.detail.value
    }
    that.setData(nameMap);
  },

  onLoadFun:function(e){
    let userInfo = e.detail;
    let tel = userInfo.phone;
    let phone = tel.substr(0, 3) + "****" + tel.substr(7);
    this.setData({ userInfo: e.detail, phone: phone});
  },
  /**
   * 发送验证码
   * 
  */
  code: function () {
    let that = this;
    if (!this.data.userInfo.phone) return app.Tips({title:'手机号码不存在,无法发送验证码'});
    if (that.data.imagesCode){
      if (!that.data.captchaimg) {
        return app.Tips({ title: '请输入图片验证码' });
      }
    };
    registerVerify(this.data.captchaimg,this.data.key,this.data.userInfo.phone).then(res=>{
      if (res.status == 402) {
        that.data.imagesCode = true;
        that.setData({
          imagesCode: that.data.imagesCode
        });
        if (this.data.captchaimg != '') {
          that.runNun();
           }
        }else{
        that.runNun();
        }
    }).catch(function(err){
      return app.Tips({ title: err });
    });
  },
  runNun:function(){
    let that = this;
    let n = 60;
    let run = setInterval(function () {
      n--;
      if (n < 0) {
        clearInterval(run);
        that.setData({ disabled: false, active: false, timetext: '重新获取' })
      } else {
        that.setData({ timetext: "剩余 " + n + "s", disabled: true, active: true })
      }
    }, 1000);
  },
  /**
   * H5登录 修改密码
   * 
  */
  editPwd:function(){
    let that = this;
    if (!that.data.password) return app.Tips({title:'请输入新密码'});
    if (that.data.qr_password != that.data.password) return app.Tips({title:'两次输入的密码不一致！'});
    if (!that.data.captcha) return app.Tips({title:'请输入验证码'});
    if (that.data.imagesCode){
      if (!that.data.captchaimg){
        return app.Tips({ title: '请输入图片验证码' });
      }
    };
    phoneRegisterReset({
      account:that.data.userInfo.phone,
      captcha:that.data.captcha,
      password: that.data.password,
      code: that.data.captchaimg
    }).then(res=>{
      return app.Tips({title:res.msg},{tab:3,url:1});
    }).catch(err=>{
      return app.Tips({title:err});
    });
  },
  // 获取key值；
  getVerifyCode:function(){
    let that = this;
    verifyCode().then(res=>{
      that.setData({
        key: res.data.key,
        httpUrl: app.globalData.url + '/api/sms_captcha?key=' + res.data.key
       })
    }).catch(err=>{
      return app.Tips({ title: err.msg });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVerifyCode();
  },
  imagesCodeTap:function(){
    this.setData({
      httpUrl: this.data.httpUrl + '&' + Date.parse(new Date())
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})