require('./index.css')
require('page/common/nav/index.js')
require('page/common/header/index.js')
const navSide = require('page/common/nav-side/index.js')
const userService = require('service/user-service.js')
const commonUtils = require('util/commonUtils.js')
// 数据模板
var templateIndex = require('./index.string')

const userCenterPage = {
	init: function () {
		this.onLoad()
	},
	onLoad: function () {
		// 初始化侧边菜单（默认用户中心）
		navSide.init({
			name: 'user-center',
		})
		// 加载用户信息
		this.loadUserInfo()
	},
	loadUserInfo: function () {
		var userHtml = ''
		userService.getUserInfo(
			function (res) {
        // 渲染模板字符串
        userHtml = commonUtils.renderHtml(templateIndex, res)
        // 挂载到DOM上
				$('.pannel-body').html(userHtml)
			},
			function (errMsg) {
        commonUtils.errorTips(errMsg)
        commonUtils.doLogin()
			}
		)
	},
}

$(function () {
	userCenterPage.init()
})
