require('./index.css')
require('page/common/nav-simple/index.js')
const commonUtils = require('util/commonUtils.js')
const userService = require('service/user-service.js')

// 表单里的错误提示显示/隐藏控制
var errorController = {
	showError: function (errMsg) {
		$('.error-item').show().find('.error-msg').text(errMsg)
	},
	hideError: function () {
		$('.error-item').hide().find('.error-msg').text('')
	},
}

const passResetPage = {
	data: {
		username: '',
		question: '',
		answer: '',
		token: '',
	},
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		// 默认显示第一步：输入用户名称
		this.loadStepUsername()
	},
	bindEvent: function () {
		var _this = this
		// 第一步提交绑定（用户名）
		$('#submit-username').click(function () {
			var username = $.trim($('#username').val())
			// 如果用户名存在，通过用户名获取当前用户的密码提示问题
			if (username) {
				userService.getQuestion(
					username,
					function (res) {
						_this.data.username = username
						_this.data.question = res
						// 跳到第二步，输入获取问题的答案
						_this.loadStepQuestion()
					},
					function (errMsg) {
						errorController.showError(errMsg)
					}
				)
			} else {
				errorController.showError('请输入用户名')
			}
		})

		// 第二步提交绑定（问题答案）
		$('#submit-question').click(function () {
			var answer = $.trim($('#answer').val())
			if (answer) {
				// 根据username、question、answer检查答案是否正确
				userService.checkAnswer(
					{
						username: _this.data.username,
						question: _this.data.question,
						answer: answer,
					},
					function (res) {
						_this.data.answer = answer
						// 保存修改密码需要的token
						_this.data.token = res
						_this.loadStepPassword()
					},
					function (errMsg) {
						errorController.showError(errMsg)
					}
				)
			} else {
				errorController.showError('请输入密码提示问题答案')
			}
		})

		// 第三步提交绑定（新密码）
		$('#submit-password').click(function () {
			var password = $.trim($('#password').val())
			if (password && password.length >= 6) {
				userService.resetPassword(
					{
						username: _this.data.username,
						passwordNew: password,
						forgetToken: _this.data.token,
					},
					function (res) {
            // 跳转到结果页
						window.location.href = './result.html?type=pass-reset'
					},
					function (errMsg) {
						errorController.showError(errMsg)
					}
				)
			} else {
				errorController.showError('请输入不少于6位的新密码')
			}
		})
	},
	// 加载输入用户第一步
	loadStepUsername: function () {
		$('.step-username').show()
	},
	// 加载输入密码提示问题答案的第二步
	loadStepQuestion: function () {
		// 清除错误提示信息
		errorController.hideError()
		$('.step-username')
			.hide() // 隐藏第一步
			.siblings('.step-question')
			.show() // 显示第二步
			.find('.question')
			.text(this.data.question) // 将问题显示在页面上
	},
	// 加载重置新密码第三步
	loadStepPassword: function () {
		// 清除错误提示信息
		errorController.hideError()
		$('.step-question').hide().siblings('.step-password').show()
	},
}

$(function () {
	passResetPage.init()
})
