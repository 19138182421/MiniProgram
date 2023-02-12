<template>
	<view class="address-container">
		<view class="address-kong" v-if="JSON.stringify(addressList) === '[]'">
			<image src="@/static/my-icons/addresskong.png" mode=""></image>
		</view>

		<view class="address-list" v-else>
			<view class="address-item" v-for="(address,index) in addressList" :key="index">
				<view class="address-info-box" @click="goBack(address)">
					<view class="user-info">
						<text style="font-size: 15px; ">{{address.receiver_name}}</text>
						<text
							style="font-size: 13px; color: gray;margin-left: 10px;font-weight: 600;">{{address.receiver_phone.substr(0,3)}}</text>
						<text style="font-size: 13px; color: gray;font-weight: 600;">****</text>
						<text
							style="font-size: 13px; color: gray;font-weight: 600;">{{address.receiver_phone.slice(7)}}</text>
						<text
							style="font-size: 10px; color:#ff7993 ;border: 1px solid #ff7993;padding: 0 2px;margin-left: 5px;"
							v-if="address.is_default == 0">默认</text>
					</view>
					<view class="address-info">
						<text
							style="font-size: 15px;">{{getAddressStr(address.address_area,address.address_detail)}}</text>
					</view>
				</view>

				<view class="address-modify">
					<text style="font-size: 15px; color: lightgray;margin: 10px 10px 0 0;"
						@click="deleteConfirm(address)">X</text>
					<view class="" style="margin: 10px;" @click="gotomodifyAddress(address)">
						<!-- <uni-icons type="gear-filled" color="gray"></uni-icons> -->
						<text style="font-size: 13px; color: gray;">编辑</text>
					</view>
				</view>
			</view>
		</view>


		<view class="footer">
			<button class="backButton" @click="gotoaddAddress">添加收货地址</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
				addressStr: '',

			};
		},
		onShow() {
			this.getAllAddress()
		},
		computed: {
			sortedAddressList() {
				return this.addressList.sort((a, b) => {
					return a.is_default - b.is_default
				})
			},
			hasDefault() {
				return this.addressList.some((item) => {
					return item.is_default == 0
				})
			}
		},
		methods: {
			goBack(address) {
				uni.$emit('updateData', address)
				// console.log(address)
				uni.navigateBack({
					delta: 1
				})
			},
			async getAllAddress() {
				const {
					data: res
				} = await uni.$http.get('/getAddress')

				if (res.meta.status !== 200) return uni.$showMsg()
				// console.log(res)
				this.addressList = res.message
			},
			getAddressStr(area, detail) {
				return `${area}-${detail}`
			},
			gotoaddAddress() {
				uni.navigateTo({
					url: '/subpkg/ac_address/ac_address?hasDefault=' + this.hasDefault
				})
			},
			gotomodifyAddress(address) {
				uni.navigateTo({
					url: '/subpkg/ac_address/ac_address?address=' + encodeURIComponent(JSON.stringify(address)) +
						`&hasDefault=${this.hasDefault}`
				})
			},
			deleteConfirm(address) {

				console.log(123)
				uni.showModal({
					title: '提示',
					content: '是否删除该地址',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.deleteAddress(address)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			async deleteAddress(address) {
				const {
					data: res
				} = await uni.$http.get('/deleteAddress?addressId=' + address.address_id)

				if (res.meta.status !== 200) return uni.$showMsg()
				// console.log(res)
				this.addressList = this.addressList.filter((item) => {
					return item.address_id !== address.address_id
				})
			}

		}
	}
</script>

<style lang="scss">
	.address-container {
		position: relative;

		.address-kong {
			width: 730rpx; 
			height: 700rpx;
			background-color: #FFFFFF;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.address-list {
			width: 100%;

			.address-item {
				width: 93%;
				height: 100px;
				margin: 10px 15px 0 10px;
				background-color: #FFFFFF;
				border-radius: 8px;
				display: flex;
				justify-content: space-between;

				.address-info-box {
					width: 80%;
					margin-top: 20px;
					margin-left: 10px;

					.address-info {
						margin-top: 8px;
					}
				}

				.address-modify {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-end;
				}

			}
		}

		.footer {
			width: 100%;
			height: 80px;
			position: fixed;
			bottom: 0;
			background-color: #FFFFFF;

			.backButton {
				margin-top: 15px;
				width: 300px;
				height: 50px;
				font-size: 20px;
				line-height: 50px;
				color: white;
				border-radius: 25px;
				background: linear-gradient(to right, #ff5335, #f2245e);
			}
		}

	}
</style>
