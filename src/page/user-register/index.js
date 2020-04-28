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

// 逻辑处理
const userRegisterPage = {
	init: function () {
		this.bindEvent()
	},
	bindEvent: function () {
		var _this = this
		// 给username的input绑定blur事件，
		// 判断输入的username是否在数据库中已经存在
		$('#username').blur(function () {
			var username = $.trim($(this).val())
			// 如果没有输入用户名，不请求后台查看数据库
			if (!username) {
				return
			}
			// 验证用户名是否存在
			userService.checkUsername(
				username,
				function (res) {
					errorController.hideError()
				},
				function (errMsg) {
					errorController.showError(errMsg)
				}
			)
		})

		// 注册提交按钮
		$('#submit').click(function () {
			_this.submit()
		})
		// 敲击回车提交
		$('.user-input').keyup(function (e) {
			if (e.keyCode === 13) {
				_this.submit()
			}
		})
	},
	submit: function () {
		// 组装用户数据
		var formData = {
			username: $.trim($('#username').val()),
			password: $.trim($('#password').val()),
			passwordComfirm: $.trim($('#password-comfirm').val()),
			phone: $.trim($('#phone').val()),
			email: $.trim($('#email').val()),
			question: $.trim($('#question').val()),
			answer: $.trim($('#answer').val()),
		}
		// 数据验证
		var validataRes = this.formDataValidata(formData)

		if (validataRes.status) {
			// 验证通过，提交表单数据进行用户注册
			userService.register(
				formData,
				function (res) {
					// 注册成功，跳转到操作结果页
					window.location.href = './result.html?type=register'
				},
				function (errMsg) {
					// 注册失败，提示错误信息
					errorController.showError(errMsg)
				}
			)
		} else {
			// 验证错误信息提示
			errorController.showError(validataRes.msg)
		}
	},
	// 表单验证
	formDataValidata: function (formData) {
		var result = {
			status: false,
			msg: '',
		}
		if (!commonUtils.validata(formData.username, 'require')) {
			result.msg = '用户名不能为空'
			return result
		}
		if (!commonUtils.validata(formData.password, 'require')) {
			result.msg = '密码不能为空'
			return result
		}
		if (formData.password !== formData.passwordComfirm) {
			result.msg = '两次密码输入不一致'
			return result
		}
		if (!commonUtils.validata(formData.phone, 'phone')) {
			result.msg = '手机格式输入错误'
			return result
		}
		if (!commonUtils.validata(formData.email, 'email')) {
			result.msg = '邮箱格式输入错误'
			return result
		}
		if (!commonUtils.validata(formData.question, 'require')) {
			result.msg = '密码提示问题不能为空'
			return result
		}
		if (!commonUtils.validata(formData.answer, 'require')) {
			result.msg = '密码提示问题答案不能为空'
			return result
		}

		result.status = true
		result.msg = '验证通过'

		return result
	},
}

// 页面加载进行init初始化操作
$(function () {
	userRegisterPage.init()
})
