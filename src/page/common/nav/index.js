require('./index.css')
const commonUtils = require('util/commonUtils.js')
const userService = require('service/user-service.js')
const cartService = require('service/cart-service.js')
var nav = {
	init: function () {
		this.bindEvent()
		this.loadUserInfo()
		this.loadCartCount()
		return this
	},
	// 绑定事件
	bindEvent: function () {
		// 点击登录
		$('.js-login').click(function () {
			commonUtils.doLogin()
		})
		// 点击注册
		$('.js-register').click(function () {
			window.location.href = './register.html'
		})
		// 点击退出
		$('.js-logout').click(function () {
			userService.logout(
				function (res) {
					window.location.reload()
				},
				function (errMsg) {
					commonUtils.errorTips(errMsg)
				}
			)
		})
	},
	// 加载用户信息（用户名称）
	loadUserInfo() {
		userService.checkLogin(
			function (res) {
				// 成功的回调，隐藏not-login，显示login，并把username显示在页面
				$('.user.not-login')
					.hide() // 隐藏非登录状态
					.siblings('.user.login')
					.show() // 显示兄弟元素的登录状态
					.find('.username') // 在兄弟元素下找到username
					.text(res.username) // 将后台获取的username展示在页面中
			},
			function (errMsg) {
				// 失败不做任何处理
			}
		)
	},
	// 加载购物车数量
	loadCartCount() {
		cartService.getCartCount(
			function (res) {
				$('.nav .cart-count').text(res || 0)
			},
			function (errMsg) {
				$('.nav .cart-count').text(0)
			}
		)
	},
}
module.exports = nav.init()
