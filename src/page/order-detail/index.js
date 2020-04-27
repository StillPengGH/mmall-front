require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
var navSide = require('page/common/nav-side/index.js')
var commonUtils = require('util/commonUtils.js')
var orderService = require('service/order-service.js')
var tempOrderList = require('./index.string')

var orderDetailPage = {
	data: {
		// 获取url上的订单号
		orderNumber: commonUtils.getUrlParamByKey('orderNumber'),
	},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		navSide.init({
			name: 'order-list',
		})
		this.loadOrderDetail()
	},
	bindEvent: function () {
    var _this = this
    // 取消订单
    $(document).on('click','.btn-cancel',function(){
      if(window.confirm('确定要取消该订单吗？')){
        orderService.cancelOrder(_this.data.orderNumber,function(res){
          commonUtils.successTips('该订单取消成功')
          _this.loadOrderDetail()
        },function(errMsg){
          commonUtils.errorTips(errMsg)
        })
      }
    })
  },
	// 加载订单详情
	loadOrderDetail: function () {
		var _this = this,
			orderDetailHtml = '',
			$detailContent = $('.content')
		$detailContent.html('<div class="loading"></div>')
		orderService.getOrderDetail(
			this.data.orderNumber,
			function (res) {
        // 数据适配
				_this.dataFilter(res)
				// 渲染页面
				orderDetailHtml = commonUtils.renderHtml(tempOrderList, res)
				$detailContent.html(orderDetailHtml)
			},
			function (errMsg) {
				$detailContent.html('<p class="error-tip">' + errMsg + '</p>')
			}
		)
	},
	// 数据适配
	dataFilter: function (resData) {
		// 10的状态是未支付状态
		resData.needPay = resData.status === 10
		// 是否可以需要订单，未支付的情况下可以取消订单
		resData.isCancelable = resData.status === 10
	},
}

$(function () {
	orderDetailPage.init()
})
