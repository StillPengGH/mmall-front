require('./index.css')
require('page/common/nav-simple/index.js')
const commonUtils = require('util/commonUtils.js')

// 页面加载完进行业务处理
$(function () {
	// 获取url上的type
	var type = commonUtils.getUrlParamByKey('type') || 'default'
	// 拼装$(".register/default-success")
  var $element = $('.' + type + '-success')
  
  // 如果是支付成功返回结果
	if (type === 'payment') {
    // 获取orderNumber
    var orderNumber = commonUtils.getUrlParamByKey('orderNumber')
    // 渲染href，跳转到订单详情页
		$orderNumber = $element.find('.order-number')
		$orderNumber.attr('href', $orderNumber.attr('href') + orderNumber)
	}
	// 显示对应的提示
	$element.show()
})
