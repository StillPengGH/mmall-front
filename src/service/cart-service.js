const commonUtils = require('util/commonUtils.js')

const cartService = {
	// 获取购物车数量
	getCartCount: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/get_cart_product_count.do'),
			method: 'GET',
			success: resolve,
			error: reject,
		})
	},
	// 加入购物车
	addCart: function (cartInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/add.do'),
			method: 'POST',
			data: cartInfo,
			success: resolve,
			error: reject,
		})
	},
}

module.exports = cartService
