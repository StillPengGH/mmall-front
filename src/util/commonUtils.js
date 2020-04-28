/*
 *@description: 通用工具
 *@author: StillPeng
 *@date: 2020-04-13 10:29:42
 *@version: V1.0.0
 */
const Hogan = require('hogan')

const conf = {
	// 测试地址
	serverHost: 'http://localhost.charlesproxy.com:8089/',
}
var commonUtils = {
	// 1.通用网络请求方法
	request: function (param) {
		var _this = this
		$.ajax({
			type: param.method || 'GET',
			url: param.url || '',
			dataType: param.dataType || 'json',
			data: param.data || '',
			success: function (res) {
				if (res.status === 0) {
					// 当响应状态为0的时候，才把数据(data)和信息(msg)返回回去
					typeof param.success === 'function' &&
						param.success(res.data, res.msg)
					// 没有登录状态，需要强制登录
				} else if (res.status === 10) {
					_this.doLogin()
					// 请求数据错误（后端定义的错误）
				} else if (res.status == 1) {
					typeof param.error === 'function' && param.error(res.msg)
				}
			},
			// 404，,501等
			error: function (err) {
				typeof param.error === 'function' && param.error(err.statusText)
			},
		})
	},
	// 2.统一跳转
	doLogin: function () { // 去登录页
		// 这里需要记录当前路径，以便登录后直接返回当前页面，并对当前页面url进行编码（防止特殊字符被截断问题）
		window.location.href =
			'./user-login.html?redirect=' + encodeURIComponent(window.location.href)
  },
  goHome:function(){ // 去首页
    window.location.href = './index.html'
  },
	// 3.获取服务器接口地址
	getServerUrl: function (path) {
		return conf.serverHost + path
	},
	// 4.获取url指定参数的值
	getUrlParamByKey: function (keyName) {
		// url:http://localhost:8089/view/index.html?name=李雷%BD&age=12
		var reg = new RegExp('(^|&)' + keyName + '=([^&]*)(&|$)')
		// name=李雷%BD&age=12
		var paramStr = window.location.search.substr(1)
		// 匹配后的结果是个数据，index=2的是匹配到的value值
		var result = paramStr.match(reg)
		// 注意：value值为中文需要进行解码
		return result ? decodeURIComponent(result[2]) : null
	},
	// 5.渲染html模板(htmlTemp为html模板，data为需要渲染到html的数据)
	renderHtml: function (htmlTemp, data) {
		var template = Hogan.compile(htmlTemp)
		var result = template.render(data)
		return result
	},
	// 6.成功提示
	successTips: function (msg) {
		alert(msg || '操作成功！')
	},
	// 7.错误提示
	errorTips: function (msg) {
		alert(msg || '哪里不对了~')
	},
	// 8.字段的验证：支持非空、手机、邮箱
	validata: function (value, type) {
		var value = $.trim(value)
		// 非空验证
		if ('require' === type) {
			return !!value
		}
		// 手机号验证
		if ('phone' === type) {
			return /^1\d{10}$/.test(value)
		}
		// 邮箱验证
		if ('email' === type) {
			return /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/.test(
				value
			)
		}
	},
}

module.exports = commonUtils
