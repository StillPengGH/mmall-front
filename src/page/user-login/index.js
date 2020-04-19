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

// 用户登录逻辑部分
var userLoginPage = {
	init: function () {
		this.bindEvent()
	},
	bindEvent: function () {
		var _this = this
		// 点击登录按钮-提交表单
		$('#submit').click(function () {
			_this.submit()
		})
		// 在输入框状态下敲击回车-提交表单
		$('.user-input').keyup(function (e) {
			if (e.keyCode === 13) {
				_this.submit()
			}
		})
	},
	// 提交表单
	submit: function () {
		// 组装formData
		var formData = {
			username: $.trim($('#username').val()),
			password: $.trim($('#password').val()),
		}
		// 前台表单验证结果true/false
		var validataRes = this.formDataValidata(formData)

		if (validataRes.status) {
			// 验证通过，提交表单，进行登录操作
			userService.login(
				formData,
				function (res) {
					console.log(commonUtils.getUrlParamByKey('redirect'))
					// 成功回调，跳转到url中执行的目标页面，没有的话跳转首页
					window.location.href =
						commonUtils.getUrlParamByKey('redirect') ||
						'./index.html'
				},
				function (errMsg) {
					// 错误回调，提示错误信息。
					errorController.showError(errMsg)
				}
			)
		} else {
			// 验证不通过，显示错误提示信息
			errorController.showError(validataRes.msg)
		}
	},
	// 表单字段验证
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

		result.status = true
		result.msg = '验证通过'
		return result
	},
}

// 页面加载完成，调用init方法。
$(function () {
	userLoginPage.init()
})
