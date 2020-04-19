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
		// 绑定事件
		this.bindEvent()
	},
	bindEvent: function () {
		var _this = this
		$(document).on('click', '.btn-submit', function () {
			var userInfo = {
				phone: $.trim($('#phone').val()),
				email: $.trim($('#email').val()),
				question: $.trim($('#question').val()),
				answer: $.trim($('#answer').val()),
			}
			// 验证数据
			var validataRes = _this.validataFormData(userInfo)
			if (validataRes.status) {
				// 更新用户信息
				userService.updateUserInfo(
					userInfo,
					function (res, msg) {
						commonUtils.successTips(msg)
						window.location.href = './user-center.html'
					},
					function (errMsg) {
						commonUtils.errorTips(errMsg)
					}
				)
			} else {
				commonUtils.errorTips(validataRes.msg)
			}
		})
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
			}
		)
	},
	// 验证数据
	validataFormData: function (formData) {
		var result = {
			status: false,
			msg: '',
		}
		if (!commonUtils.validata(formData.phone, 'phone')) {
			result.msg = '手机号格式不正确'
			return result
		}
		if (!commonUtils.validata(formData.email, 'email')) {
			result.msg = '邮箱格式不正确'
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
		result.msg = '验证成功'
		return result
	},
}

$(function () {
	userCenterPage.init()
})
