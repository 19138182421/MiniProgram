<template>
	<view class="address-container" @click="shutdown">
		<view class="name">
			<text>收货人</text>
			<input type="text" v-model="address.receiver_name" placeholder="请填写收货人姓名"
				placeholder-style="font-size:15px;color:lightgray;">
		</view>
		<view class="phone">
			<text>手机号码</text>
			<input type="number" v-model="address.receiver_phone" placeholder="请填写收货人手机号"
				placeholder-style="font-size:15px;color:lightgray;">
		</view>
		<view class="area">
			<text>所在地区</text>
			<input type="text" disabled="true" v-model="address.address_area" placeholder="省市区县等"
				placeholder-style="font-size:15px;color:lightgray;" @click.stop="showPicker">
		</view>
		<view class="detail">
			<text>详细地址</text>
			<textarea class="textArea" v-model="address.address_detail" placeholder="  详细地址,如乡镇,街道,楼牌号"
				placeholder-style="font-size:15px;color:lightgray;"></textarea>
		</view>
		<view class="default">
			<text>设置为默认地址</text>
			<switch :checked="address.is_default == 0" @change="changeDefault" color="#f2245e"
				style="position: relative; left: 250rpx; transform:scale(0.8)" />
		</view>


		<view class="picker-container" v-show="showpicker">
		</view>
		<view class="picker" v-show="showpicker">
			<view class="picker-component">
				<my-picker @choosePicker="pickerHandler"></my-picker>
			</view>
		</view>


		<view class="footer">
			<button class="backButton" @click="addOrmodify()">保存</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: {
					receiver_name: '',
					receiver_phone: '',
					address_area: '',
					address_detail: '',
					is_default: 1,
				},
				hasDefault: true,
				am: '',
				showpicker: false,

			};
		},
		onLoad(options) {
			if (options.address) {
				this.address = JSON.parse(decodeURIComponent(options.address)) || {}
				this.am = 'modify'
			} else {
				this.am = 'add'
			}
			this.hasDefault = options.hasDefault
			// console.log(options.hasDefault)
		},
		methods: {
			pickerHandler(e) {
				this.address.address_area = e
			},
			changeDefault() {
				if (this.address.is_default == 0) {
					this.address.is_default = 1
				} else {
					this.address.is_default = 0
				}
			},
			addOrmodify() {
				if (this.address.receiver_name === '') {
					uni.showToast({
						title: '收件人姓名格式不正确！',
						icon: 'none',
						duration: 2000
					})
				} else if (this.address.receiver_phone.length !== 11 || this.address.receiver_phone.charAt(0) != 1) {
					uni.showToast({
						title: '收件人手机号码格式不正确！',
						icon: 'none',
						duration: 2000
					})
				} else if (this.address.address_detail === '') {
					uni.showToast({
						title: '收件人地址信息不完整！',
						icon: 'none',
						duration: 2000
					})
				} else {
					// console.log(this.address.address_detail === '')
					if (this.am === 'add') {
						// console.log(789)
						this.addAddress()
					} else if (this.am === 'modify') {
						this.modifyAddress()
					}
				}

			},
			async addAddress() {
				// console.log(1234564)
				//如果有默认地址且此地址要设为默认就先设置所有地址为非默认地址，则传isChange为0
				//其他均可直接插入，即isChange传1
				const addressObj = {
					receiverName: this.address.receiver_name,
					receiverPhone: this.address.receiver_phone,
					addressArea: this.address.address_area,
					addressDetail: this.address.address_detail,
					isDefault: this.address.is_default,
				}
				if (this.hasDefault && addressObj.isDefault === 0) {
					// console.log("默认地址")
					const {
						data: res
					} = await uni.$http.post('/addAddress?isChange=0', addressObj)

					if (res.meta.status !== 200) return uni.$showMsg("添加失败！")

				} else {
					// console.log("非默认地址")
					const {
						data: res
					} = await uni.$http.post('/addAddress?isChange=1', addressObj)

					if (res.meta.status !== 200) return uni.$showMsg("添加失败！")

				}
				
				uni.navigateBack({
					delta: 1
				})

			},
			async modifyAddress() {
				const addressObj = {
					addressId: this.address.address_id,
					receiverName: this.address.receiver_name,
					receiverPhone: this.address.receiver_phone,
					addressArea: this.address.address_area,
					addressDetail: this.address.address_detail,
					isDefault: this.address.is_default,
				}

				if (this.hasDefault && addressObj.isDefault === 0) {
					// console.log("默认地址")
					const {
						data: res
					} = await uni.$http.post('/modifyAddress?isChange=0', addressObj)

					if (res.meta.status !== 200) return uni.$showMsg("添加失败！")

				} else {
					// console.log("非默认地址")
					const {
						data: res
					} = await uni.$http.post('/modifyAddress?isChange=1', addressObj)

					if (res.meta.status !== 200) return uni.$showMsg("添加失败！")

					console.log(res)

				}

				uni.navigateBack({
					delta: 1
				})

			},
			showPicker() {
				this.showpicker = true
			},
			shutdown() {
				this.showpicker = false
			}
		}
	}
</script>

<style lang="scss">
	.address-container {
		width: 700rpx;
		height: 900rpx;
		margin: 10px;
		background-color: #ffffff;
		border-radius: 10px;
		padding: 10rpx 0 0 40rpx;

		.name,
		.phone,
		.area {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			position: relative;


			input {
				width: 480rpx;
				height: 100rpx;
				// background-color: #f2245e;
				position: absolute;
				left: 200rpx;
				top: 0;
			}
		}

		.detail {
			width: 100%;
			height: 450rpx;
			margin-top: 50rpx;

			.textArea {
				width: 90%;
				height: 300rpx;
				margin-top: 50rpx;
				background-color: #f7f7f7;
				border-radius: 5px;
				padding: 20rpx 0 0 20rpx;
			}
		}

		.default {}


		.picker-container {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: black;
			opacity: .5;
			z-index: 100;

		}

		.picker {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 101;


			.picker-component {
				width: 100%;
				height: 800rpx;
				position: absolute;
				background-color: #ffffff;
				bottom: 0;
				animation: myfirst 0.25s;
				opacity: 1;
				border-radius: 10px;
				z-index: 999;
			}

			@keyframes myfirst {
				from {
					bottom: -400px;
				}

				to {
					bottom: 0px;
				}
			}
		}



		.footer {
			width: 100%;
			height: 160rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #FFFFFF;

			.backButton {
				margin-top: 30rpx;
				width: 90%;
				height: 120rpx;
				font-size: 50rpx;
				line-height: 120rpx;
				color: white;
				border-radius: 80rpx;
				background: linear-gradient(to right, #ff5335, #f2245e);
			}
		}
	}
</style>
