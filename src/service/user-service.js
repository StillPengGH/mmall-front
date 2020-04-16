const commonUtils = require('util/commonUtils')

const userService = {
	// 检查登录状态，并返回用户信息
	checkLogin: function (resolve,reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/get_user_info.do'),
			method: 'POST',
			success: resolve,
			error: reject,
		})
	},
	// 退出
	logout: function (resolve, reject) {
		commonUtils.request({
			url: commonUtils.getServerUrl('user/logout.do'),
			method: 'POST',
			success: resolve,
			error: reject,
		})
	},
}

module.exports = userService
