var commonUtils = require('util/commonUtils.js')

var paymentService = {
  // 获取支付二维码
	getPaymentInfo: function (orderNumber, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/pay.do'),
			data: {
				orderNo: orderNumber,
			},
			success: resolve,
			error: reject,
		})
  },
  // 获取订单支付状态
  getPaymentStatus: function (orderNumber, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('order/query_order_pay_status.do'),
			data: {
				orderNo: orderNumber,
			},
			success: resolve,
			error: reject,
		})
	},
}

module.exports = paymentService
