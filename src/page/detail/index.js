require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
const commonUtils = require('util/commonUtils.js')
const productService = require('service/product-service.js')
const cartService = require('service/cart-service.js')
// 详情HTML模板
var tempDetail = require('./index.string')

var detailPage = {
	data: {
		productId: commonUtils.getUrlParamByKey('productId') || '',
	},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		// 如果productId为空，跳转到首页
		if (!this.data.productId) {
			commonUtils.goHome()
		}
		this.loadProductDetail()
	},
	bindEvent: function () {
		var _this = this
		// 图片预览
		$(document).on('mouseenter', '.p-img-item', function () {
			var currentImageUrl = $(this).find('.p-img').attr('src')
			$('.main-img').attr('src', currentImageUrl)
		})

		// 购物数量加减
		$(document).on('click', '.p-count-btn', function () {
			var btnType = $(this).hasClass('plus') ? 'plus' : 'minus',
				$pCount = $('.p-count'),
				currentCount = parseInt($pCount.val()),
				minCount = 1,
				maxCount = _this.data.detailInfo.stock || 999
			if (btnType === 'plus') {
				$pCount.val(
					currentCount < maxCount ? currentCount + 1 : maxCount
				)
			}
			if (btnType === 'minus') {
				$pCount.val(
					currentCount > minCount ? currentCount - 1 : minCount
				)
			}
		})

		// 加入购物车
		$(document).on('click', '.cart-add', function () {
			cartService.addCart(
				{
					productId: _this.data.productId,
					count: $('.p-count').val(),
				},
				function (res) {
					window.location.href = './result.html?type=cart-add'
				},
				function (errMsg) {
					commonUtils.errTips(errMsg)
				}
			)
		})
	},
	loadProductDetail: function () {
		var _this = this,
			html = '',
			$pageWrap = $('.page-wrap')
		// loading
		$pageWrap.html('<div class="loading"></div>')
		// 加载产品详情
		if (this.data.productId) {
			productService.getProductDetail(
				this.data.productId,
				function (res) {
					_this.filterRes(res)
					// 缓存detail数据,绑定事件的时候回用到
					_this.data.detailInfo = res
					// 渲染页面
					html = commonUtils.renderHtml(tempDetail, res)
					$pageWrap.html(html)
				},
				function (errMsg) {
					$pageWrap.html('<p class="error-tip">此商品太淘气，找不到了</p>')
				}
			)
		}
	},
	// 过滤数据
	filterRes: function (resData) {
		resData.subImages = resData.subImages.split(',')
		// 暂时使第三方图片
		resData.imageHost = 'http://img.happymmall.com/'
	},
}

$(function () {
	detailPage.init()
})
