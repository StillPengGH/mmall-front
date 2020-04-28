const commonUtils = require('util/commonUtils.js')

var orderService = {
	// 获取订单中购物车中的商品列表
	getProductList: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/get_order_cart_product.do'),
			success: resolve,
			error: reject,
		})
	},
	// 创建订单
	createOrder: function (orderInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/create.do'),
			data: orderInfo,
			success: resolve,
			error: reject,
		})
	},
	// 获取我的订单列表
	getOrderList: function (listParam, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/list.do'),
			data: listParam,
			success: resolve,
			error: reject,
		})
	},
	// 获取订单详情信息
	getOrderDetail: function (orderNo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/detail.do'),
			data: {
				orderNo: orderNo,
			},
			success: resolve,
			error: reject,
		})
	},
	// 取消订单
	cancelOrder: function (orderNo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/cancel.do'),
			data: {
				orderNo: orderNo,
			},
			success: resolve,
			error: reject,
		})
	},
}

module.exports = orderService
