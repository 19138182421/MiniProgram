<template>
	<view class="address" @click="gotoAddressInfo">
		<view class="address-item">
			<!-- 顶部边框线 -->
			<view class="address-image">
				<!-- <image src="../../static/fenge.png" mode="widthFix" style="position: relative; right: -1px;"></image> -->
			</view>

			<view class="address-info" v-if="!isNull">
				<view class="address-info-left">
					<uni-icons type="location" size="28" color="deeppink" style="position: relative;top:8px">
					</uni-icons>
					<view class="" style="padding-left: 8px;">
						<text style="font-weight: 700;padding-right: 10px;">{{address.receiver_name}}</text>
						<text style="font-weight: 700;">{{phone}}</text>
						<text style="display: block;margin-top: 10px;font-size: 13px;">{{addressInfo}}</text>
					</view>
				</view>
				<uni-icons type="arrowright" size="15"></uni-icons>
			</view>

			<view class="choose-address" v-else>
				<text class="choose-button">请选择收货地址+</text>
				<uni-icons type="arrowright" size="15"></uni-icons>
			</view>
		</view>



	</view>
</template>

<script>
	export default {
		name: "my-address",
		computed: {
			phone() {
				if (this.isNull) {
					return ""
				} else {
					return `${this.address.receiver_phone.substr(0,3)}***${this.address.receiver_phone.slice(7)}`
				}
			},
			addressInfo: function() {
				return `${this.address.address_area}-${this.address.address_detail}`
			},
			isNull() {
				return JSON.stringify(this.address) == "{}"
			}
		},
		data() {
			return {
				address: {},
			};
		},
		methods: {
			gotoAddressInfo() {
				// console.log("asdf")
				uni.navigateTo({
					url: '/subpkg/address_info/address_info'
				})
			}
		},
		mounted() {
			// let that = this
			uni.$on('updateData', (data) => {
				this.address = data
			})
			// console.log(typeof this.isNull)
			// console.log( this.isNull)
		}
	}
</script>

<style lang="scss">
	.address {
		.address-item {
			width: 310px;

			.address-image {
				width: 100%;
				height: 10px;
				background: url("../../static/fenge.png");
			}

			.address-info {
				width: 100%;
				height: 100px;
				margin: 0 5px 5px 5px;
				background-color: #ffffff;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.address-info-left {
					display: flex;
					justify-content: flex-start;
				}

			}

			.choose-address {
				width: 100%;
				height: 100px;
				margin: 0 5px 5px 5px;
				background-color: #ffffff;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.choose-button {
					margin-left: 50px;
					background-color: #fd2c5b;
					padding: 5px 15px;
					color: white;
					border-radius: 5px;

				}

			}
		}
	}
</style>
