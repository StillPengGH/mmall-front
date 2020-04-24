require('./index.css')
require('page/common/header/index.js')
const nav = require('page/common/nav/index.js')
const commonUtils = require('util/commonUtils.js')
var cartService = require('service/cart-service.js')
var tempCart = require('./index.string')

var cartPage = {
	data: {},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		this.loadCartList()
	},
	bindEvent: function () {
		var _this = this
		// 都使用事件代理方式绑定事件，因为页面是动态渲染出来的
		// 单个商品的选择/取消选择
		$(document).on('click', '.cart-select', function () {
			var $this = $(this),
				productId = $this.parents('.cart-table').data('product-id')
			// 选中状态
			if ($this.is(':checked')) {
				cartService.selectProduct(
					productId,
					function (res) {
						console.log(res)
						_this.renderCart(res)
					},
					function (errMsg) {
						_this.showError()
					}
				)
			}
			// 取消选中
			else {
				cartService.unselectProduct(
					productId,
					function (res) {
						console.log(res)
						_this.renderCart(res)
					},
					function (errMsg) {
						_this.showError()
					}
				)
			}
		})
		// 购物车商品的全选/取消全选
		$(document).on('click', '.cart-select-all', function () {
			var $this = $(this)
			if ($this.is(':checked')) {
				cartService.selectAll(
					function (res) {
						_this.renderCart(res)
					},
					function (errMsg) {
						_this.showError
					}
				)
			} else {
				cartService.unselectAll(
					function (res) {
						_this.renderCart(res)
					},
					function (errMsg) {
						_this.showError
					}
				)
			}
		})
		// 商品的数量变化
		$(document).on('click', '.count-btn', function () {
			var $this = $(this),
				$pCount = $this.siblings('.count-input'), // input的jQuery对象
				currentCount = parseInt($pCount.val()), // 当前商品数量
				type = $this.hasClass('minus') ? 'minus' : 'plus', // 判断是加还是减
				productId = $this.parents('.cart-table').data('product-id'), // 商品id
				minCount = 1, // 最小值
				maxCount = parseInt($pCount.data('max')), // 最大值（库存）
				newCount = 0 // 计算后的值
			// 增加
			if (type === 'plus') {
				if (currentCount >= maxCount) {
					commonUtils.errorTips('该商品数量已经达到上限')
					return
				}
				newCount = currentCount + 1
			}
			// 减少
			else {
				if (currentCount <= minCount) {
					return
				}
				newCount = currentCount - 1
			}
			// 更新购物车商品数量
			cartService.updateProductCount(
				{
					productId: productId,
					count: newCount,
				},
				function (res) {
					_this.renderCart(res)
				},
				function (errMsg) {
					_this.showError()
				}
			)
		})
		// 删除单个商品
		$(document).on('click', '.cart-delete', function () {
			if (window.confirm('确认删除该商品吗？')) {
				var productId = $(this)
					.parents('.cart-table')
					.data('product-id')
				_this.deleteProduct(productId)
			}
		})
		// 删除选中商品
		$(document).on('click', '.delete-selected', function () {
			if (window.confirm('确认删除选中商品吗？')) {
				var productIdArr = [],
					$selectItem = $('.cart-select:checked')
				// 循环查找选中的productId
				for (
					var i = 0, iLength = $selectItem.length;
					i < iLength;
					i++
				) {
					productIdArr.push(
						$($selectItem[i])
							.parents('.cart-table')
							.data('product-id')
					)
				}
				if (productIdArr.length) {
					console.log(productIdArr)
					// 将arr数组每一项用逗号拼接位字符串
					_this.deleteProduct(productIdArr.join(','))
				} else {
					commonUtils.errorTips('您还没有选中要删除的商品')
				}
			}
		})
		// 提交购物车
		$(document).on('click', '.btn-submit', function () {
			if (_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0) {
				// 订单确认页面
				window.location.href = './order-confirm.html'
			} else {
				commonUtils.errorTips('请选择商品后再进行提交')
			}
		})
	},
	// 加载购物车列表
	loadCartList: function () {
		var _this = this,
			html = ''
		cartService.getCartList(
			function (res) {
				// 渲染购物车
				_this.renderCart(res)
			},
			function (errMsg) {
				// 显示购物提示信息
				_this.showError()
			}
		)
	},
	// 渲染购物车
	renderCart: function (resData) {
		// 对接口返回数据进行相关处理
		this.filter(resData)
		// 缓存购物车数据
		this.data.cartInfo = resData
		// 生成HTML
		html = commonUtils.renderHtml(tempCart, resData)
		// 将HTML渲染到页面指定节点
		$('.page-wrap').html(html)
		// 更新nav的购物车数量
		nav.loadCartCount()
	},
	// 显示错误信息
	showError: function () {
		$('.page-wrap').html(
			'<p class="error-tip">哪里不对了，刷新一下试试吧。</p>'
		)
	},
	// 数据处理
	filter: function (resData) {
		// 给resData添加是否为空的notEmpty属性，在HTML进行判断(双叹号转为boolean类型)
		resData.notEmpty = !!resData.cartProductVoList.length
	},
	// 删除购物车商品（支持多个删除,productId用逗号分隔）
	deleteProduct: function (productIds) {
		var _this = this
		cartService.deleteProduct(
			productIds,
			function (res) {
				_this.renderCart(res)
			},
			function (errMsg) {
				_this.showError()
			}
		)
	},
}

$(function () {
	cartPage.init()
})
