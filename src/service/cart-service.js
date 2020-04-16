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
}

module.exports = cartService
