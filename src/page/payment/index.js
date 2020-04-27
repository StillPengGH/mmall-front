require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
var commontUtils = require('util/commonUtils.js')
var paymentService = require('service/payment-service.js')
var tempPayment = require('./index.string')

// Page 逻辑
var paymentPage = {
	data: {
		orderNumber: commontUtils.getUrlParamByKey('orderNumber'),
	},
	init: function () {
		this.onLoad()
	},
	onLoad: function () {
		this.loadPaymentInfo()
	},
	// 加载支付信息（二维码图片）
	loadPaymentInfo: function () {
		var _this = this,
			paymentHtml = '',
			$pageWrap = $('.page-wrap')
		$pageWrap.html('<div class="loading"></div>')
		paymentService.getPaymentInfo(
			this.data.orderNumber,
			function (res) {
				// 渲染页面
				paymentHtml = commontUtils.renderHtml(tempPayment, res)
        $pageWrap.html(paymentHtml)
        // 监听订单支付状态
				_this.listenOrderStatus()
			},
			function (errMsg) {
				$pageWrap.html('<p class="error-tip">' + errMsg + '</p>')
			}
		)
	},
	// 监听订单支付状态
	listenOrderStatus: function () {
		var _this = this
		// 每5秒查询一次状态，5e3 = 5000 即5000毫秒的意思
		this.paymentTimer = window.setInterval(function () {
			paymentService.getPaymentStatus(_this.data.orderNumber, function (
				res
			) {
				if (res == true) {
					window.location.href =
						'./result.html?type=payment&orderNumber=' +
						_this.data.orderNumber
				}
			})
		}, 5e3)
	},
}

$(function () {
	paymentPage.init()
})
