import { WSS_SERVER_URL, HEADER, SERVER_DEBUG, PINGINTERVAL} from './../config.js';

export default class Server{

  constructor(app) {
    this.chatId = null // chat_id
    this.connectStatus = false // websocket 连接状态 false：未连接，true：已连接
    this.timer = null // 心跳
    this.watcherList = [] // 订阅者
    this.app = app // 方便在Chat内部操作app
    this.debug = SERVER_DEBUG //debug
  }

  connectSocket(){
    let that = this;
    this.chatId = new Date().getTime();
    this.SocketTask = wx.connectSocket({
      url: WSS_SERVER_URL,
      header: HEADER,
      method: 'post',
      success: res => {
        that.debug && console.log(res);
      },
      fail:err =>{
          that.debug && console.log(err);
      }
    });
    wx.onSocketOpen(this.onOpen.bind(this));
    wx.onSocketMessage(this.onMessage.bind(this));
    wx.onSocketError(this.onError.bind(this));
    wx.onSocketClose(this.onClose.bind(this));
  }

  /**
   * 心跳
   *
   * */
  ping(){
    let that = this;
    this.timer = setInterval(()=>{
      that.send({type:'ping'});
    }, PINGINTERVAL);
  }

  /**
   * 关闭链接
   * 
  */
  close(){
    clearInterval(this.timer);
    this.SocketTask.close();
    this.connectStatus = false;
  }

  /**
   * 发送消息
   *
   * */
  send(data){
    let that = this;
    return new Promise((reslove, reject)=>{
      that.SocketTask.send({
        data: JSON.stringify(data),
        success:reslove,
        fail:reject,
      });
    });
  }

  onMessage(res){
    this.debug && console.log(res);
    const { type, data = {} } = JSON.parse(res.data);
    this.$emit(type, data);
  }

  onClose(){
    this.close();
  }

  onError(res){
    this.debug && console.log(res);
    this.$emit('socket_error', res);
    this.connectStatus = false;
  }

  onOpen(res){
    this.debug && console.log('链接成功');
    this.connectStatus = true;
    if(this.app.globalData === undefined) 
      console.error('无法获取token登录失败');
    else 
      this.send({ type: 'login', data: this.app.globalData.token});
    this.ping();
  }

  /**
     * 注册事件
     * @param string name 事件名称
     * @param callback successFun 回调函数
     * 
    */
  $on(name, successFun) {
    let taht = this;
    if (typeof name === 'object') {
      name.forEach(item => {
        if (!taht.watcherList[item]) this.watcherList[name] = [];
        taht.watcherList[item].push(successFun);
      })
    } else {
      if (!this.watcherList[name]) {
        this.watcherList[name] = []
      }
      this.watcherList[name].push(successFun);
    }
  }

  /**
   * 执行事件
   * @param string type 事件名称
   * @param array data 参数
  */
  $emit(type, data){
    let onCallbacks = this.watcherList[type]
    onCallbacks.forEach(element => {
      element.apply(this, arguments,data)
    });
  }

}
