// 引入首页样式文件
require('./index.css')
// 引入头部导航nav
require('page/common/nav/index.js')
// 引入通用的header
require('page/common/header/index.js')
// 引入轮播图组件
require('util/slider/index.js')
// 引入通用工具
const commonUtils = require('util/commonUtils.js')

// 轮播图HTML模板
var tempBanner = require('./banner.string')

$(function () {
	// 将轮播图的HTML渲染到页面指定节点
	var bannerHtml = commonUtils.renderHtml(tempBanner)
	$('.banner-con').html(bannerHtml)

	// 初始化slider
	var $slider = $('.banner').unslider({
		dots: true,
	})

	// 前一张后一张点击事件
	$('.banner-con .banner-arrow').click(function () {
		var forward = $(this).hasClass('prev') ? 'prev' : 'next'
		$slider.data('unslider')[forward]()
	})
})
