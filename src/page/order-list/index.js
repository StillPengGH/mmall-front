require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
var navSide = require('page/common/nav-side/index.js')
var commonUtils = require('util/commonUtils.js')
var orderService = require('service/order-service.js')
var tempOrderList = require('./index.string')
var Pagination = require('util/pagination/index.js')

var orderListPage = {
	data: {
		listParam: {
			pageNum: 1,
			pageSize: 10,
		},
	},
	init: function () {
		this.onLoad()
	},
	onLoad: function () {
		// 渲染左侧菜单
		navSide.init({
			name: 'order-list',
		})
		this.loadOrderList()
	},
	// 加载我的订单列表
	loadOrderList: function () {
		var _this = this,
			$orderListCon = $('.order-list-con'),
			orderListHtml = ''
		// 加载中图标
		$orderListCon.html('<p class="loading"></p>')
		orderService.getOrderList(
			_this.data.listParam,
			function (res) {
				// 渲染订单列表
				orderListHtml = commonUtils.renderHtml(tempOrderList, res)
				$orderListCon.html(orderListHtml)
				// 加载分页信息
				_this.loadPagination({
					hasPreviousPage: res.hasPreviousPage, // 是否有上一页（true/false）
					prePage: res.prePage, // 上一页页码
					hasNextPage: res.hasNextPage, // 是否有下一页（true/false）
					nextPage: res.nextPage, // 下一页页码
					pageNum: res.pageNum, // 当前页码
					pages: res.pages, // 总页数
				})
			},
			function (errMsg) {
				$orderListCon.html(
					'<p class="error-tips">加载订单失败，请刷新后重试</p>'
				)
			}
		)
	},
	// 加载分页信息
	loadPagination: function (pageInfo) {
		var _this = this
		this.pagination ? '' : (this.pagination = new Pagination())
		this.pagination.render(
			$.extend({}, pageInfo, {
				container: $('.pagination'),
				onSelectPage: function (pageNum) {
					_this.data.listParam.pageNum = pageNum
					_this.loadOrderList()
				},
			})
		)
	},
}

$(function () {
	orderListPage.init()
})
