require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
const commonUtils = require('util/commonUtils.js')
const productService = require('service/product-service.js')
// 分页
var Pagination = require('util/pagination/index.js')
// 产品列表HTML模板
var tempProduct = require('./index.string')

var productPage = {
	data: {
		// 查询参数
		listParams: {
			keyword: commonUtils.getUrlParamByKey('keyword') || '', // 关键字
			categoryId: commonUtils.getUrlParamByKey('categoryId') || '', // 产品分类
			orderBy: commonUtils.getUrlParamByKey('orderBy') || '', // 列表排序
			pageNum: commonUtils.getUrlParamByKey('pageNum') || 1, // 第几页
			pageSize: commonUtils.getUrlParamByKey('pageSize') || 10, // 页大小
		},
	},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		this.loadProductList()
	},
	bindEvent: function () {
		var _this = this
		// 排序点击事件
		$('.sort-item').click(function () {
			var $this = $(this)
			// 无论点击的是什么，重新加载列表pageNum都应该是第一页
			_this.data.listParams.pageNum = 1
			// 判断自定义属性data-type的值（默认）
			if ($this.data('type') === 'default') {
				// 已经是active
				if ($this.hasClass('active')) {
					return
				} else {
					// 不是的话添加active样式，并移除兄弟元素的active、asc、desc样式
					$this
						.addClass('active')
						.siblings('.sort-item')
						.removeClass('active asc desc')
					_this.data.listParams.orderBy = ''
				}
			}
			// 如果点击的是价格排序
			else if ($this.data('type') === 'price') {
				// 处理active
				$this
					.addClass('active')
					.siblings('.sort-item')
					.removeClass('active')
				// 升降序处理
				if ($this.hasClass('asc')) {
					$this.removeClass('asc').addClass('desc')
					_this.data.listParams.orderBy = 'price_desc'
				} else {
					$this.removeClass('desc').addClass('asc')
					_this.data.listParams.orderBy = 'price_asc'
				}
			}
			// 重新加载列表
			_this.loadProductList()
		})
	},
	// 获取产品列表
	loadProductList: function () {
		var _this = this,
			listParams = this.data.listParams,
			tempHtml
		// 显示loading图标
		$('.p-list-con').html('<div class="loading"></div>')
		// 删除参数中不必要的字段
		listParams.categoryId
			? delete listParams.keyword
			: delete listParams.categoryId
		// 调用service层，获取产品列表
		productService.getProductList(
			listParams,
			function (res) {
				// 成功回调，渲染数据
				tempHtml = commonUtils.renderHtml(tempProduct, {
					list: res.list,
				})
				$('.p-list-con').html(tempHtml)
				// 加载分页
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
				commonUtils.errorTips(errMsg)
			}
		)
	},
	// 加载分页
	loadPagination(pageInfo) {
		var _this = this
		this.pagination ? '' : (this.pagination = new Pagination())
		this.pagination.render(
			$.extend({}, pageInfo, {
				container: $('.pagination'),
				onSelectPage: function (pageNum) {
					_this.data.listParams.pageNum = pageNum
					_this.loadProductList()
				},
			})
		)
	},
}

$(function () {
	productPage.init()
})
