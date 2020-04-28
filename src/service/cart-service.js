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
	// 获取购物车列表
	getCartList: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/list.do'),
			success: resolve,
			error: reject,
		})
	},
	// 单个购物车商品选中
	selectProduct: function (productId, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/select.do'),
			data: {
				productId: productId,
			},
			success: resolve,
			error: reject,
		})
	},
	// 单个购物车商品取消选中
	unselectProduct: function (productId, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/un_select.do'),
			data: {
				productId: productId,
			},
			success: resolve,
			error: reject,
		})
	},
	// 购物车商品全选
	selectAll: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/select_all.do'),
			success: resolve,
			error: reject,
		})
	},
	// 购物车商品取消全选
	unselectAll: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/un_select_all.do'),
			success: resolve,
			error: reject,
		})
	},
	// 添加/减少商品数量
	updateProductCount: function (cartInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('cart/update.do'),
			method: 'POST',
			data: cartInfo,
			success: resolve,
			error: reject,
		})
	},
	// 删除购物车中商品
	deleteProduct: function (productIds, resolve, reject) {
		commonUtils.request({
      url: commonUtils.getServerUrl('cart/delete_product.do'),
      method:'POST',
			data: {
				productIds: productIds,
			},
			success: resolve,
			error: reject,
		})
	},
}

module.exports = cartService
