const commonUtils = require('util/commonUtils.js')

const productService = {
	// 获取产品列表
	getProductList: function (listParams, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('product/list.do'),
			data: listParams,
			success: resolve,
			error: reject,
		})
	},

	// 获取产品详情
	getProductDetail: function (productId, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('product/detail.do'),
			data: {
				productId: productId,
			},
			success: resolve,
			error: reject,
		})
	},
}

module.exports = productService
