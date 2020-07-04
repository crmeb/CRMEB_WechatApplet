import util from './util.js';
import authLogin from './autuLogin.js';
import { HEADER , TOKENNAME} from './../config.js';
/**
 * 发送请求
 */
export default function request(api, method, data, {noAuth = false, noVerify = false})
{
  let Url = getApp().globalData.url, header = HEADER;
  if (!noAuth) {
    //登录过期自动登录
    if (!util.checkLogin()) return authLogin().then(res => { return request(api, method, data, { noAuth, noVerify}); });
  }
  
  if (getApp().globalData.token) header[TOKENNAME] = 'Bearer ' + getApp().globalData.token;

  return new Promise((reslove, reject) => {
    wx.request({
      url: Url + '/api/' + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        if (noVerify)
          reslove(res.data, res);
        else if (res.data.status == 200)
          reslove(res.data, res);
        else if (res.data.status == 402)
          reslove(res.data, res);
        else if ([410000, 410001, 410002].indexOf(res.data.status) !== -1) {
          util.logout()
          return authLogin().then(res => { return request(api, method, data, { noAuth, noVerify }); });
        } else
          reject(res.data.msg || '系统错误');
      },
      fail: (msg) => {
        reject('请求失败');
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});

