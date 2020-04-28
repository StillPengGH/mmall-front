const commonUtils = require('util/commonUtils.js')
const cities = require('util/cities/index.js')
var addressService = require('service/address-service.js')
var tempAddressModal = require('./address-modal.string')

// 添加/修改地址模态框模块
var addressModal = {
	// 显示modal框
	show: function (option) {
		// 将option绑定到对象上
		this.option = option
		// 如果option有data属性，将绑定到对象上，没有则赋值为空对象
		this.option.data = option.data || {}
		// 将modal外部容器包装成jquery对象,并绑定到当前对象上
		this.$modalWrap = $('.modal-wrap')
		// 渲染modal框
		this.loadModal()
		// 绑定事件
		this.bindEvent()
	},
	// 渲染modal框
	loadModal: function () {
		var addressModalHtml = commonUtils.renderHtml(tempAddressModal, {
			isUpdate: this.option.isUpdate, // 是否是更新操作
			data: this.option.data, // 渲染页面的数据
		})
		this.$modalWrap.html(addressModalHtml)
		// 加载省市信息
		this.loadProvince()
  },
  // 事件绑定
	bindEvent: function () {
		var _this = this
		// 省份和城市的二级联动
		this.$modalWrap.find('#receiver-province').change(function () {
			var selectedProvince = $(this).val()
			_this.loadCities(selectedProvince)
		})

		// 提交收货地址
		this.$modalWrap.find('.address-btn').click(function () {
			// 封装地址信息
			var receiverInfo = _this.getReceiverInfo()
			// 判断是否是更新操作
			var isUpdate = _this.option.isUpdate
			// 添加操作且数据验证通过
			if (!isUpdate && receiverInfo.status) {
				addressService.saveAddress(
					receiverInfo.data,
					function (res) {
						commonUtils.successTips('地址添加成功')
						// 关闭modal框
						_this.hide()
						// 将返回结果（res：地址的ID）通过回调函数返还回去
						typeof _this.option.onSuccess === 'function' &&
							_this.option.onSuccess(res)
					},
					function (errMsg) {
						commonUtils.errorTips(errMsg)
					}
				)
			}
			// 更新操作且数据验证通过
			else if (isUpdate && receiverInfo.status) {
				addressService.updateAddress(
					receiverInfo.data,
					function (res) {
						commonUtils.successTips('更新地址成功')
						_this.hide()
						typeof _this.option.onSuccess === 'function' &&
							_this.option.onSuccess(res)
					},
					function (errMsg) {
						commonUtils.errorTips(errMsg)
					}
				)
			}
			// 验证不通过
			else {
				commonUtils.errorTips(receiverInfo.errMsg || '好像哪里不对~')
			}
		})

		// 点击叉号/蒙版区域，关闭模态框
		this.$modalWrap.find('.modal-close').click(function () {
			_this.hide()
		})

		// 组织点击内容区造成事件冒泡，关闭模态框
		this.$modalWrap.find('.modal-container').click(function (e) {
			e.stopPropagation()
		})
	},
	// 加载省份信息
	loadProvince: function () {
		// 获取所有省数组
		var provinces = cities.getProvince() || []
		// 包装省份select为jquery对象
		var $provinceSelect = this.$modalWrap.find('#receiver-province')
		// 渲染option
		$provinceSelect.html(this.getSelectOption(provinces))
		// 如果是更新，并且有省份信息，做省份回填
		if (this.option.isUpdate && this.option.data.receiverProvince) {
			$provinceSelect.val(this.option.data.receiverProvince)
			this.loadCities(this.option.data.receiverProvince)
		}
	},
	// 加载市信息
	loadCities: function (provinceName) {
		var cityArr = cities.getCities(provinceName) || []
		var $citySelect = this.$modalWrap.find('#receiver-city')
		$citySelect.html(this.getSelectOption(cityArr))
		// 如果是更新，并且有市信息，进行回填
		if (this.option.isUpdate && this.option.data.receiverCity) {
			$citySelect.val(this.option.data.receiverCity)
		}
	},
	// 获取select框的选项，输入：Array，输出：HTML
	getSelectOption: function (optionArray) {
		var html = '<option value="">请选择</option>'
		for (var i = 0, length = optionArray.length; i < length; i++) {
			html +=
				'<option value="' +
				optionArray[i] +
				'">' +
				optionArray[i] +
				'</option>'
		}
		return html
	},
	// 封装收货地址信息
	getReceiverInfo: function () {
		var receiverInfo = {}
		// 验证结果
		var result = {
			status: false,
		}
		// 如果是更新操作，将id添加到receiverInfo
		if (this.option.isUpdate) {
			receiverInfo.id = this.$modalWrap.find('#receiver-id').val()
		}
		receiverInfo.receiverName = $.trim(
			this.$modalWrap.find('#receiver-name').val()
		)
		receiverInfo.receiverProvince = $.trim(
			this.$modalWrap.find('#receiver-province').val()
		)
		receiverInfo.receiverCity = $.trim(
			this.$modalWrap.find('#receiver-city').val()
		)
		receiverInfo.receiverAddress = $.trim(
			this.$modalWrap.find('#receiver-address').val()
		)
		receiverInfo.receiverPhone = $.trim(
			this.$modalWrap.find('#receiver-phone').val()
		)
		receiverInfo.receiverZip = $.trim(
			this.$modalWrap.find('#receiver-zip').val()
		)
		// 表单验证
		if (!receiverInfo.receiverName) {
			result.errMsg = '请输入收件人姓名'
		} else if (!receiverInfo.receiverProvince) {
			result.errMsg = '请选择收件人所在省份'
		} else if (!receiverInfo.receiverCity) {
			result.errMsg = '请选择收件人所在城市'
		} else if (!receiverInfo.receiverAddress) {
			result.errMsg = '请输入收件人详细地址'
		} else if (!receiverInfo.receiverPhone) {
			result.errMsg = '请输入收件人手机号'
		} else {
			result = {
				status: true,
				data: receiverInfo,
			}
		}
		return result
	},
	// 关闭modal框
	hide: function () {
		this.$modalWrap.empty()
	},
}

module.exports = addressModal
