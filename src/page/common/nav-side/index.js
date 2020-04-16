require('./index.css')
const commonUtils = require('util/commonUtils.js')
var tempIndex = require('./index.string')

// 侧边导航
const navSide = {
	option: {
		name: '',
		navList: [
			{
				name: 'user-center',
				desc: '个人中心',
				href: './user-center.html',
			},
			{ name: 'order-list', desc: '我的订单', href: './order-list.html' },
			{
				name: 'pass-update',
				desc: '修改密码',
				href: './pass-update.html',
			},
			{ name: 'about', desc: '关于我们', href: './about.html' },
		],
	},
	init: function (extOption) {
		// 将外部传递过来的extOption合并到option。
    $.extend(this.option, extOption)
		this.renderNav()
	},
	renderNav: function () {
    // 给需要高亮的选项对象，添加isActive属性
		for (
			var i = 0, iLength = this.option.navList.length;
			i < iLength;
			i++
		) {
			if (this.option.navList[i].name === this.option.name) {
				this.option.navList[i].isActive = true
			}
    }
    // 渲染html
		var navHtml = commonUtils.renderHtml(tempIndex, {
			navList: this.option.navList,
		})
    // 将渲染的html数据插入.nav-side节点下
		$('.nav-side').html(navHtml)
	},
}

module.exports = navSide
