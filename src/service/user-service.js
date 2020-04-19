const commonUtils = require('util/commonUtils')

const userService = {
	// 验证用户名是否存在
	checkUsername: function (username, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/check_valid.do'),
			method: 'POST',
			data: {
				type: 'username',
				str: username,
			},
			success: resolve,
			error: reject,
		})
	},
	// 用户注册
	register: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/register.do'),
			method: 'POST',
			data: userInfo,
			success: resolve,
			error: reject,
		})
	},
	// 用户登录
	login: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/login.do'),
			data: userInfo,
			method: 'POST',
			success: resolve,
			error: reject,
		})
	},

	// 检查登录状态，并返回用户信息
	checkLogin: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/get_user_info.do'),
			method: 'GET',
			success: resolve,
			error: reject,
		})
	},
	// 根据用户名获取找回密码问题
	getQuestion: function (username, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/forget_get_question.do'),
			method: 'POST',
			data: {
				username: username,
			},
			success: resolve,
			error: reject,
		})
	},
	// 检查重置密码答案是否正确
	checkAnswer: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/forget_check_answer.do'),
			method: 'POST',
			data: userInfo,
			success: resolve,
			error: reject,
		})
	},
	// 忘记密码-重置密码
	resetPassword: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/forget_reset_password.do'),
			method: 'POST',
			data: userInfo,
			success: resolve,
			error: reject,
		})
	},
	// 获取用户信息
	getUserInfo: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/get_user_info.do'),
			method: 'GET',
			success: resolve,
			error: reject,
		})
	},
	// 更新用户信息
	updateUserInfo: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/update_information.do'),
			method: 'POST',
			data: userInfo,
			success: resolve,
			error: reject,
		})
  },
  // 修改密码
	updatePassword: function (userInfo, resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/reset_password.do'),
			method: 'POST',
			data: userInfo,
			success: resolve,
			error: reject,
		})
	},
	// 退出
	logout: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/logout.do'),
			method: 'GET',
			success: resolve,
			error: reject,
		})
	},
}

module.exports = userService
