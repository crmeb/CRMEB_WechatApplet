# CRMEB XCX v3.0

#### 介绍
  CRMEB 3.0 小程序

#### 使用说明

1. 配置config.js 中的 HTTP_REQUEST_URL 修改为自己的域名
2. 配置微信开发工具中小程序的appid
3. 前往CRMEB后台配置小程序 appid 和 AppSecret 
3. 前往微信小程序后台配置业务，下载 合法域名

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
