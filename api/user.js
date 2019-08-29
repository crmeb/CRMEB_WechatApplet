import request from "./../utils/request.js";
/**
 * 
 * 用户相关接口
 * 
*/

/**
 * 小程序用户登录
 * @param data object 小程序用户登陆信息
 */
export function login(data) {
  return request.post("wechat/mp_auth", data, { noAuth : true });
}


/**
 * 获取用户中心菜单
 *
 */
export function getMenuList() {
  return request.get("menu/user");
}

/**
 * 获取用户信息
 * 
*/
export function getUserInfo(){
  return request.get('user');
}

/**
 * 修改用户信息
 * @param object
*/
export function userEdit(data){
  return request.post('user/edit',data);
}


/**
 * 会员等级列表
 * 
*/
export function userLevelGrade(){
  return request.get('user/level/grade');
}

/**
 * 获取某个等级任务
 * @param int id 任务id
*/
export function userLevelTask(id){
  return request.get('user/level/task/'+id);
}

/**
 * 检查用户是否可以成为会员
 * 
*/
export function userLevelDetection(){
  return request.get('user/level/detection');
}

/**
 * 获取分销海报图片
 * 
*/
export function spreadBanner(){
  return request.get('spread/banner',{type:1});
}

/**
 *
 * 获取推广用户一级和二级
 * @param object data
*/
export function spreadPeople(data){
  return request.post('spread/people',data);
}

/**
 * 
 * 推广佣金明细
 * @param int type 
 * @param object data
*/
export function spreadCommission(type,data){
  return request.get('spread/commission/'+type,data);
}

/**
 * 
 * 推广佣金/提现总和
 * @param int type
*/
export function spreadCount(type){
  return request.get('spread/count/'+type);
}

/**
 * 
 * 推广订单
 * @param object data
*/
export function spreadOrder(data){
  return request.post('spread/order',data);
}

/**
 * 提现申请
 * @param object data
*/
export function extractCash(data){
  return request.post('extract/cash',data)
}

/**
 * 提现银行/提现最低金额
 * 
*/
export function extractBank(){
  return request.get('extract/bank');
}

/**
 * 活动状态
 * 
*/
export function userActivity(){
  return request.get('user/activity');
}

/**
 * 小程序充值
 * 
*/
export function rechargeRoutine(data){
  return request.post('recharge/routine',data)
}

/**
 * 
 * 地址列表
 * @param object data
*/
export function getAddressList(data){
  return request.get('address/list',data);
}

/**
 * 设置默认地址
 * @param int id
*/
export function setAddressDefault(id){
  return request.post('address/default/set',{id:id})
}

/**
 * 获取默认地址
 * 
*/
export function getAddressDefault(){
  return request.get('address/default');
}
/**
 * 删除地址
 * @param int id
 * 
*/
export function delAddress(id){
  return request.post('address/del',{id:id})
}

/**
 * 修改 添加地址
 * @param object data
*/
export function editAddress(data){
  return request.post('address/edit',data);
}

/**
 * 获取单个地址
 * @param int id 
*/
export function getAddressDetail(id){
  return request.get('address/detail/'+id);
}

/**
 * 设置用户分享
 * 
*/
export function userShare(){
  return request.post('user/share');
}

/**
 * 获取签到配置
 * 
*/
export function getSignConfig(){
  return request.get('sign/config')
}

/**
 * 获取签到列表
 * @param object data
*/
export function getSignList(data){
  return request.get('sign/list',data);
}

/**
 * 签到列表(年月)
 * @param object data
 * 
*/
export function getSignMonthList(data){
  return request.get('sign/month',data)
}

/**
 * 用户签到
*/
export function setSignIntegral(){
  return request.post('sign/integral')
}
/*
 * 资金明细（types|0=全部,1=消费,2=充值,3=返佣,4=提现）
 * */
export function getCommissionInfo(q, types) {
  return request.get("spread/commission/" + types, q);
}
/*
 * 签到用户信息
 * */
export function postSignUser(sign) {
  return request.post("sign/user", sign);
}
/*
 * 积分记录
 * */
export function getIntegralList(q) {
  return request.get("integral/list", q);
}
/*
 * 点击领取优惠券
 * */
export function getCouponReceive(couponId) {
  return request.post("coupon/receive", couponId);
}
/*
 * 领取优惠券列表
 * */
export function getCoupon(q) {
  return request.get("coupons", q);
}