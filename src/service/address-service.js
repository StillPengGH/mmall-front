const commonUtils = require('util/commonUtils.js')

var addressService = {
	// 获取地址列表
	getAddressList: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('shipping/list.do'),
			method: 'POST',
			success: resolve,
			error: reject,
		})
	},
	// 添加收货地址
	saveAddress: function (receiverData, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('shipping/add.do'),
			method: 'POST',
			data: receiverData,
			success: resolve,
			error: reject,
		})
	},
	// 获取收货地址详情
	getAddress: function (shippingId, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('shipping/detail.do'),
			method: 'POST',
			data: {
				shippingId: shippingId,
			},
			success: resolve,
			error: reject,
		})
	},
	// 更新收货地址
	updateAddress: function (receiverData, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('shipping/update.do'),
			method: 'POST',
			data: receiverData,
			success: resolve,
			error: reject,
		})
	},
	// 删除收货地址
	deleteAddress: function (shippingId, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('shipping/del.do'),
			method: 'POST',
			data: {
				shippingId: shippingId,
			},
			success: resolve,
			error: reject,
		})
	},
}

module.exports = addressService
