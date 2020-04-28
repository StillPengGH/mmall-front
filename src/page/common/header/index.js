require('./index.css')
const commonUtils = require('util/commonUtils.js')
const header = {
	init: function () {
		this.bindEvent()
		this.onLoad()
	},
	onLoad: function () {
		// 获取url中的keyword，将keyword回填到输入框
		var keyword = commonUtils.getUrlParamByKey('keyword')
		if (keyword) {
			$('#search-input').val(keyword)
		}
	},
	bindEvent: function () {
		var _this = this
		// 点击搜索按钮，进行提交
		$('#search-btn').click(function () {
			_this.searchSubmit()
		})
		// 敲击回车,提交搜索
		$('#search-input').keyup(function (e) {
      // 13代表回车键
			if (e.keyCode === 13) {
				_this.searchSubmit()
			}
		})
	},
	// 搜索的提交
	searchSubmit: function () {
		var keyword = $.trim($('#search-input').val())
		if (keyword) {
			window.location.href = './list.html?keyword=' + keyword
		} else {
			commonUtils.goHome()
		}
	},
}

header.init()
