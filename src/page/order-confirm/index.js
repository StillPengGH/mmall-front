require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
const commonUtils = require('util/commonUtils.js')
// 地址列表HTML模板
var tempAddressList = require('./address-list.string')
// 商品清单HTML模板
var tempProductList = require('./product-list.string')
var addressService = require('service/address-service.js')
var orderService = require('service/order-service.js')
// 添加地址Modal
var addressModal = require('./address-modal.js')

var orderConfirmPage = {
	data: {
		selectedAddressId: null,
	},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		this.loadAddressList()
		this.loadProductList()
	},
	bindEvent: function () {
		var _this = this
		// 地址的选择
		$(document).on('click', '.address-item', function () {
			// 给当前选择的元素添加active样式，并把同级兄弟元素的active删除
			$(this)
				.addClass('active')
				.siblings('.address-item')
				.removeClass('active')
			// 缓存被选中的地址ID
			_this.data.selectedAddressId = $(this).data('id')
		})

		// 创建订单
		$(document).on('click', '.order-submit', function () {
			// 获取当前选中的收货地址ID
			var shippingId = _this.data.selectedAddressId
			if (shippingId) {
				orderService.createOrder(
					{
						shippingId: shippingId,
					},
					function (res) {
						window.location.href =
							'./payment.html?orderNumber=' + res.orderNo
					},
					function (errMsg) {
						commonUtils.errorTips(errMsg)
					}
				)
			} else {
				commonUtils.errorTips('请选择地址后在提交')
			}
		})

		// 添加收货地址
		$(document).on('click', '.address-add', function () {
			// 添加地址模态框展示(isUpdate是否是更新操作)
			addressModal.show({
				isUpdate: false,
				// 添加成功后回调
				onSuccess: function (res) {
					// 重新加载地址list
					_this.loadAddressList()
				},
			})
		})

		// 编辑收货地址
		$(document).on('click', '.address-update', function (e) {
			e.stopPropagation()
			// 获取地址id
			var shippingId = $(this).parents('.address-item').data('id')
			// 获取当前id的地址信息
			addressService.getAddress(
				shippingId,
				function (res) {
					// 显示模态框
					addressModal.show({
						isUpdate: true,
						data: res,
						onSuccess: function (res) {
							_this.loadAddressList()
						},
					})
				},
				function (errMsg) {
					commonUtils.errorTips(errMsg)
				}
			)
		})

		// 删除地址
		$(document).on('click', '.address-delete', function (e) {
			e.stopPropagation()
      var shippingId = $(this).parents('.address-item').data('id')
      if(window.confirm('确定删除该地址吗？')){
        addressService.deleteAddress(
          shippingId,
          function (res) {
            _this.loadAddressList()
          },
          function (errMsg) {
            commonUtils.errorTips(errMsg)
          }
        )
      }
		})
	},
	// 加载商品清单列表
	loadProductList: function () {
		var _this = this
		$('.product-con').html('<div class="loading"></div>')
		orderService.getProductList(
			function (res) {
				var productHtml = commonUtils.renderHtml(tempProductList, res)
				$('.product-con').html(productHtml)
			},
			function (errMsg) {
				$('.product-con').html(
					'<p class="error-tip">商品信息加载失败，请刷新后重试</p>'
				)
			}
		)
	},
	// 加载收货地址列表
	loadAddressList: function () {
		var _this = this
		$('.address-con').html('<div class="loading"></>')
		addressService.getAddressList(
			function (res) {
				var addressHtml = commonUtils.renderHtml(tempAddressList, res)
				$('.address-con').html(addressHtml)
			},
			function (errMsg) {
				$('.address-con').html(
					'<p class="error-tip">地址加载失败，请刷新后重试</p>'
				)
			}
		)
	},
}

$(function () {
	orderConfirmPage.init()
})
