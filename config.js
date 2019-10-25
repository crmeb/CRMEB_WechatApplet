module.exports = {
  // 请求域名 格式： http://您的域名
  HTTP_REQUEST_URL:'',
  // Socket链接 暂不做配置
  WSS_SERVER_URL:'',
  // 请求头
  HEADER:{
    'content-type': 'application/json'
  },
  // Socket调试模式
  SERVER_DEBUG:true,
  // 心跳间隔
  PINGINTERVAL:3000,

  // 回话密钥名称 请勿修改此配置
  TOKENNAME: 'Authori-zation',
}