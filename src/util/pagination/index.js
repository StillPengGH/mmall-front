require('./index.css')
const commonUtils = require('util/commonUtils.js')
var tempPagination = require('./index.string')

var Pagination = function () {
	// 构造器（在new的时候回被调用）
	_this = this
	// 添加默认option
	this.defaultOption = {
		container: null, // 默认分页html容器为空
		pageNum: 1, // 默认第一页
		pageRange: 3, // 当前页的前后最多在页面显示几页
		onSelectPage: null, // 默认选择页面回调函数为null
	}
	// 点击事件处理（事件委托）在new的时候就给.pg-item通过事件委托绑定click事件
	$(document).on('click', '.pg-item', function () {
		var $this = $(this)
		// 对于disabled和active按钮点击，不错任何处理
		if ($this.hasClass('active') || $this.hasClass('disabled')) {
			return
		}
		// 点击的回调（这里的_this.option是我们执行render时，合并的option：defaultOption+userOption）
		typeof _this.option.onSelectPage === 'function'
			? _this.option.onSelectPage($this.data('value')) // $this.data('value')当前选中的data-value值
			: null
	})
}

// 渲染分页组件
Pagination.prototype.render = function (userOption) {
	// 合并defaultOption和userOption
	this.option = $.extend({}, this.defaultOption, userOption)
	// 判断container，即分页的容器是否是jquery对象，不需要渲染分页
	if (!this.option.container instanceof jQuery) {
		return
	}
	// 如果总页数小于等于一，不需要渲染分页
	if (this.option.pages <= 1) {
		return
	}
	// 向分页容器渲染分页内容
	this.option.container.html(this.getPaginationHtml())
}

// 获取分页HTML-|上一页| 2 3 4 5 6 7 8|下一页| 5/9
Pagination.prototype.getPaginationHtml = function () {
	var html = '',
		option = this.option,
		pageArray = [],
		start =
			option.pageNum - option.pageRange > 0
				? option.pageNum - option.pageRange
				: 1,
		end =
			option.pageNum + option.pageRange < option.pages
				? option.pageNum + option.pageRange
				: option.pages
	// 上一页按钮数据
	pageArray.push({
		name: '上一页',
		value: option.prePage,
		disabled: !option.hasPreviousPage,
	})

	// 数字按钮处理
	for (var i = start; i <= end; i++) {
		pageArray.push({
			name: i,
			value: i,
			active: i === option.pageNum,
		})
	}

	// 下一页按钮数据
	pageArray.push({
		name: '下一页',
		value: option.nextPage,
		disabled: !option.hasNextPage,
	})

	html = commonUtils.renderHtml(tempPagination, {
		pageArray: pageArray,
		pageNum: option.pageNum,
		pages: option.pages,
	})

	return html
}

module.exports = Pagination
