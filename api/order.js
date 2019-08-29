import request from "./../utils/request.js";
/**
 * 
 * 订单相关接口
 * 
*/

/**
 * 获取购物车列表
 * 
 */
export function getCartList() {
  return request.get("cart/list");
}

/**
 * 获取购物车列表
 * @param numType boolean true 购物车数量,false=购物车产品数量
 */
export function getCartCounts(numType) {
  return request.get("cart/count", { numType: numType === undefined ? true : numType });
}


/**
 * 修改购物车数量
 * @param int cartId  购物车id
 * @param int number 修改数量
 */
export function changeCartNum(cartId, number) {
  return request.post("cart/num", { id: cartId, number: number });
}

/**
 * 清除购物车
 * @param object ids join(',') 切割成字符串
*/
export function cartDel(ids){
  if (typeof id === 'object') 
    ids = ids.join(',');
  return request.post('cart/del', { ids: ids});
}

/**
 * 订单列表
 * @param object data
*/
export function getOrderList(data){
  return request.get('order/list',data);
}

/**
 * 订单确认获取订单详细信息
 * @param string cartId
*/
export function orderConfirm(cartId){
  return request.post('order/confirm', { cartId: cartId});
}

/**
 * 再次下单
 * @param string uni
 * 
*/
export function orderAgain(uni){
  return request.post('order/again',{uni:uni});
}

/**
 * 订单支付
 * @param object data
*/
export function orderPay(data){
  return request.post('order/pay',data);
}

/**
 * 订单详情
 * @param string uni 
*/
export function getOrderDetail(uni){
  return request.get('order/detail/'+uni);
}

/**
 * 删除已完成订单
 * @param string uni
 * 
*/
export function orderDel(uni){
  return request.post('order/del',{uni:uni});
}

/**
 * 订单收货
 * @param string uni
 * 
*/
export function orderTake(uni){
  return request.post('order/take',{uni:uni});
}

/**
 * 订单查看物流
 * @param string uni
*/
export function orderExpress(uni){
  return request.get('order/express/'+uni);
}

/**
 * 订单评价
 * @param object data
 * 
*/
export function orderComment(data){
  return request.post('order/comment',data);
}

/**
 * 订单取消
 * @param string id
 * 
*/
export function orderCancel(id){
  return request.post('order/cancel',{id:id});
}

/**
 * 订单产品信息
 * @param string unique 
*/
export function orderProduct(unique){
  return request.post('order/product', { unique: unique});
}

/**
 * 订单退款审核
 * @param object data
*/
export function orderRefundVerify(data){
  return request.post('order/refund/verify',data);
}

/**
 * 获取退款理由
 * 
*/
export function ordeRefundReason(){
  return request.get('order/refund/reason');
}

/**
 * 订单统计数据
*/
export function orderData(){
  return request.get('order/data')
}

/**
 * 获取当前金额能使用的优惠卷
 * @param string price
 * 
*/
export function getCouponsOrderPrice(price){
  return request.get('coupons/order/'+price)
}

/**
 * 订单创建
 * @param string key
 * @param object data
 * 
*/
export function orderCreate(key,data){
  return request.post('order/create/'+key,data);
}
/**
 * 订单查询物流信息
 * @returns {*}
 */
export function express(uni) {
  return request.get("order/express/" + uni);
}
