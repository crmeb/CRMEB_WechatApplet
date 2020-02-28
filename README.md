<p align="center">
<img src="https://images.gitee.com/uploads/images/2018/1214/151026_2299df23_892944.gif" />
</p>
<h1 align="center"> CRMEB客户管理+电商营销系统</h1> 
<p align="center">
    <a href="http://www.crmeb.com">
        <img src="https://img.shields.io/badge/OfficialWebsite-CRMEB-yellow.svg" />
    </a>
<a href="http://www.crmeb.com">
        <img src="https://img.shields.io/badge/Licence-GPL3.0-green.svg?style=flat" />
    </a>
    <a href="http://www.crmeb.com">
        <img src="https://img.shields.io/badge/Edition-3.0-blue.svg" />
    </a>
     <a href="https://gitee.com/ZhongBangKeJi/CRMEB/repository/archive/master.zip">
        <img src="https://img.shields.io/badge/download-2m-red.svg" />
    </a>
</p>

### 如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！

# CRMEBv3.0微信小程序前端页面

## 介绍
CRMEBv3.0微信小程序前端页面

+ CRMEB后端程序下载地址

  + 码云:https://gitee.com/ZhongBangKeJi/CRMEB.git
  
  + github:https://github.com/crmeb/CRMEB

+ 微信小程序版前端界面
  
   + github:https://github.com/crmeb/CRMEB_WechatApplet
  
   + 码云：https://gitee.com/ZhongBangKeJi/CRMEB_WechatApplet
  
+ H5版前端界面
  
   + github:https://github.com/crmeb/CRMEB-H5
  
   + 码云：https://gitee.com/ZhongBangKeJi/CRMEB-H5

### 帮助文档：
https://help.crmeb.net/crmeb
### 论坛地址:
http://bbs.crmeb.net

###  QQ交流群
 CRMEB微信开发6群: 341864990 <a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=13e9ce8da34352ee2420576aef65ae377479ac0958fab2d4a6e01e8d2479621f">点击加群</a>
|CRMEB微信开发3群:69741389<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=a8d2235bd79d65ea465e43ed81001d0641f875675ab80051118a43cfc468cbaa">点击加群</a>

## 页面展示
![展示图](/readme/images/展示图_01.jpg "展示图.png")
![展示图](/readme/images/展示图_02.jpg "展示图.png")
![展示图](/readme/images/展示图_03.jpg "展示图.png")

## 后台演示
http://demo.crmeb.net/admin
帐号：demo 密码：crmeb.com

## 前台演示
![前端演示](/readme/images/演示二维码.jpg)

## 官网地址
商业版请到官网授权：http://www.crmeb.com
#### 使用说明

1. 配置config.js 中的 HTTP_REQUEST_URL 修改为自己的域名
2. 配置微信开发工具中小程序的appid
3. 前往CRMEB后台配置小程序 appid 和 AppSecret 
3. 前往微信小程序后台配置业务，下载 合法域名
4. 上传小程序前请删除小程序根目录下readme目录

### 目录结构

~~~
└─view 小程序存放根目录
  ├─api 接口统一存放目录
  │ ├─activity.js 营销接口
  │ ├─api.js 公共接口
  │ ├─order.js 订单接口
  │ ├─store.js 产品接口
  │ └─user.js 用户接口
  ├─components 组件目录
  │ ├─address-window 订单页选择地址组件
  │ ├─authorize 授权组件
  │ ├─coupon-list-window 优惠券列表组件
  │ ├─coupon-window 优惠券弹出框组件
  │ ├─goodList 商品展示组件
  │ ├─home 悬浮导航组件
  │ ├─navbar 头部导航组件
  │ ├─orderGoods 订单产品展示组件
  │ ├─payment 支付弹出框组件
  │ ├─productConSwiper Swiper产品轮播图组件
  │ ├─product-window 为您推荐组件
  │ ├─promotionGood 促销产品组件
  │ ├─recommend 热门推荐组件
  │ ├─share-red-packets 产品页分享组件
  │ ├─swipers swipers轮播组件
  │ └─userEvaluation 产品页评论组件
  ├─css 全局css
  ├─font icon字体库
  ├─images 图片目录
  ├─pages 小程序页面目录
  │ ├─activity
  │ │ ├─goods_bargain 砍价列表
  │ │ ├─goods_bargain_details 砍价详情
  │ │ ├─goods_combination 拼团列表
  │ │ ├─goods_combination_details 拼团详情
  │ │ ├─goods_combination_status 拼团状态
  │ │ ├─goods_seckill 秒杀列表
  │ │ ├─goods_seckill_details 秒杀详情
  │ │ ├─poster-poster 海报页面
  │ │ └─user_goods_bargain_list 砍价记录
  │ ├─cash-audit 提现审核
  │ ├─first-new-product 精品推荐，热门榜单，首发新品，促销单品
  │ ├─goods_cate 产品分类
  │ ├─goods_comment_con 产品评价
  │ ├─goods_comment_list 产品评价列表
  │ ├─goods_details 产品详情
  │ ├─goods_list 产品列表
  │ ├─goods_logistics 产品物流信息
  │ ├─goods_return 申请退款
  │ ├─goods_search 搜索
  │ ├─index 主页
  │ ├─news_details 新闻详情
  │ ├─news_list 新闻列表
  │ ├─order_addcart 购物车
  │ ├─order_confirm 订单确认
  │ ├─order_details 订单详情
  │ ├─order_list 订单列表
  │ ├─order_pay_status 订单支付状态
  │ ├─promoter-list 推广人列表
  │ ├─promoter-order 推广人订单
  │ ├─promotional-items 促销单品
  │ ├─user 我的页面
  │ ├─user_address 添加地址
  │ ├─user_address_list 地址列表
  │ ├─user_bill 账单明细
  │ ├─user_cash 提现
  │ ├─user_coupon 我的优惠卷
  │ ├─user_get_coupon 领取优惠卷
  │ ├─user_goods_collection 收藏产品
  │ ├─user_info 个人资料
  │ ├─user_integral 积分明细
  │ ├─user_money 我的账户
  │ ├─user_payment 充值
  │ ├─user_phone 手机号绑定
  │ ├─user_pwd_edit 修改密码
  │ ├─user_return_list 退款列表
  │ ├─user_sgin 签到
  │ ├─user_sgin_list 签到记录
  │ ├─user_spread_code 分销海报
  │ ├─user_spread_money 佣金明细
  │ ├─user_spread_user 我的推广
  │ └─user_vip 会员页面
  ├─utils 工具类目录
  │ ├─autuLogin.js 自动授权登陆
  │ ├─request.js 请求基类
  │ ├─Server.js Socket类
  │ ├─util.js 工具函数
  │ └─wxh.js 帮助类函数
  ├─wxParse WX分析类
  ├─app.js 入口文件
  ├─app.json 配置文件
  ├─app.wxss 样式
  ├─config.js 程序配置
  └─project.config.json 项目配置

~~~
