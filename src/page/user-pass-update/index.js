require('./index.css')
require('page/common/header/index.js')
require('page/common/nav/index.js')
const navSide = require('page/common/nav-side/index.js')
const commonUtils = require('util/commonUtils.js')
const userService = require('service/user-service.js')

const passUpdatePage = {
	init: function () {
		this.onLoad()
		this.bindEvent()
	},
	onLoad: function () {
		// 初始化右侧栏目
		navSide.init({
			name: 'user-pass-update',
		})
	},
	bindEvent: function () {
		var _this = this
		$('.btn-submit').click(function () {
			// 组装form数据
			var userInfo = {
					password: $.trim($('#password').val()),
					passwordNew: $.trim($('#passwordNew').val()),
					passwordComfirm: $.trim($('#passwordComfirm').val()),
				},
				// 验证数据
				validataRes = _this.validataFormData(userInfo)
			if (validataRes.status) {
				userService.updatePassword(
					{
						passwordOld: userInfo.password,
						passwordNew: userInfo.passwordNew,
					},
					function (res, msg) {
						commonUtils.successTips(msg)
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
	validataFormData: function (formData) {
		var result = {
			status: false,
			msg: '',
    }
		if (!commonUtils.validata(formData.password, 'require')) {
			result.msg = '原密码不能为空'
			return result
		}
		if (!formData.passwordNew || formData.passwordNew.length < 6) {
			result.msg = '密码长度不能少于6位'
			return result
		}
		if (formData.passwordNew !== formData.passwordComfirm) {
			result.msg = '两次输入的密码不一致'
			return result
		}
		result.status = true
		result.msg = '验证成功'
		return result
	},
}

$(function () {
	passUpdatePage.init()
})
