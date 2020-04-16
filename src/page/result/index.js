require('./index.css')
require('page/common/nav-simple/index.js')
const commonUtils = require('util/commonUtils.js')

// 页面加载完进行业务处理
$(function () {
	// 获取url上的type
	var type = commonUtils.getUrlParamByKey('type') || 'default'
	// 拼装$(".register/default-success")
	var $element = $('.' + type + '-success')
	// 显示对应的提示
	$element.show()
})
