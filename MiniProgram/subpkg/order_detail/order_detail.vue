<template>
	<view class="detail-container" v-if="!isNull">
		<view class="detail-title">
			<view class="paystatus">
				<text style="font-size: 50rpx;color:#222222;">{{payStatus}}</text>
			</view>
			<image src="~@/static/my-icons/detailtitle.png"></image>
		</view>

		<view class="address">
			<uni-icons type="location" size="28" color="#5b5b5b" style="position: relative;top:0rpx">
			</uni-icons>
			<view class="info">
				<view class="name-phone">
					<text
						style="font-size: 35rpx; color: #777777; margin-right: 20rpx;">{{orderDetail.receiver_name}}</text>
					<text style="font-size: 30rpx; color: #aaaaaa;">{{phone}}</text>
				</view>
				<view class="address-info">
					<text style="font-size: 30rpx; color: #b3b3b3;">{{orderDetail.order_address}}</text>
				</view>
			</view>
		</view>

		<view class="item-goods" v-for="(good,index) in goods" :key="index">
			<view class="item-info">
				<view class="order-image">
					<image :src="good.good_big_logo"></image>
				</view>
				<view class="name-tp">
					<view style="font-size: 35rpx;color: #222222;">
						{{good.good_name}}
					</view>
					<text style="font-size: 30rpx;color: #999999;">{{good.good_tp}}</text>
				</view>
				<view class="price-count">
					<view style="font-size: 30rpx;color: #5f5f5f;">
						￥{{good.good_price}}
					</view>
					<view style="font-size: 30rpx;color: #a3a3a3;padding-left: 60rpx;">
						x{{good.good_number}}
					</view>
				</view>
			</view>
		</view>

		<view class="detail-info">
			<view class="detail-item">
				<text style="color:#222222;">商品总价</text>
				<text style="color:#4f4f4f;font-size: 30rpx;font-weight: 600;">￥{{orderDetail.order_price}}</text>
			</view>
			<view class="detail-item">
				<text style="color:#222222;">运费</text>
				<text style="color:#666666;font-size: 30rpx;">免运费</text>
			</view>
			<view class="detail-item">
				<text style="color:#222222;">税费</text>
				<text style="color:#666666;font-size: 30rpx;">包税</text>
			</view>
			<view class="detail-item">
				<text style="color:#222222;">实付款</text>
				<text style="color:#ff3c62;font-size: 35rpx;font-weight: 700;">￥{{orderDetail.order_price}}</text>
			</view>
		</view>

		<view class="order-number-time">
			<view class="detail-item">
				<text style="color:#222222;">订单编号</text>
				<view class="order-number">
					<text
						style="color:#505050;font-size: 30rpx;margin-right: 20rpx;">{{orderDetail.order_number}}</text>
					<text style="color:#505050;font-size: 30rpx;">复制</text>
				</view>
			</view>
			<view class="detail-item">
				<text style="color:#222222;">下单时间</text>
				<text style="color:#505050;font-size: 30rpx;">{{orderDetail.create_time}}</text>
			</view>
		</view>

		<view class="footer">
			<view class="">
				<button type="default" v-if="payStatus === '待付款' || payStatus === '交易完成'" plain="true" @click="deleteConfirm">删除订单</button>
				<button type="default" v-if="payStatus === '待收货'" plain="true" @click="receiveConfirm">确认收货</button>
			</view>
			<view class="">
				<button type="default" plain="true">在线客服</button>
			</view>
			<view class="" v-if="payStatus === '待付款'" @click="showQR">
				<button type="default" plain="true" style="color: #ff2266; border-color: #ff2266;">付款</button>
			</view>
		</view>

		<view class="mask" v-if="showqr">
		</view>
		<view class="qr" v-if="showqr">
			<view class="qrtext" hover-class="hover" @click="closeQR">
				<text>x</text>
			</view>
			<image src="~@/static/qr.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			phone() {
				if (this.isNull) {
					return ""
				} else {
					return `${this.orderDetail.receiver_phone.substr(0,3)}***${this.orderDetail.receiver_phone.slice(7)}`
				}
			},
			isNull() {
				return JSON.stringify(this.orderDetail) == "{}"
			}
		},
		data() {
			return {
				orderDetail: {},
				goods: [],
				payStatus: '',
				showqr: false,
				payResult: false,
			};
		},
		onLoad(options) {
			this.orderDetail = JSON.parse(decodeURIComponent(options.orderDetail))
			console.log(this.orderDetail)
			this.goods = this.orderDetail.goods
			this.payStatus = this.orderDetail.pay_status
		},
		methods: {
			deleteConfirm() {
				uni.showModal({
					title: '提示',
					content: '是否删除该订单',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.deleteOrder()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			receiveConfirm() {
				uni.showModal({
					title: '提示',
					content: '是否确认收货?',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.receiveOrder()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async deleteOrder() {
				// console.log(456)
				const {
					data: res
				} = await uni.$http.get(`/deleteOrder?order_id=${this.orderDetail.order_id}`)
				if (res.meta.status !== 200) return uni.$showMsg("删除失败！！")
				uni.$showMsg("删除完成！！")
				//返回上层
				uni.navigateBack({
					delta: 1
				});
			},
			async receiveOrder() {
				const {
					data: res
				} = await uni.$http.get(`/modifyOrderStatus?orderId=${this.orderDetail.order_id}&payStatus=交易完成`)

				if (res.meta.status !== 200) {
					return uni.$showMsg("修改失败！")
				} else {
					uni.$showMsg("此交易已完成！")
				}
				//返回上层
				uni.navigateBack({
					delta: 1
				});
			},
			showQR() {
				//展示二维码
				this.showqr = true
				this.timer = setTimeout(() => {
					// 调用修改订单状态的函数
					// console.log("修改数据库")
					this.modifyStatus()
				}, 3000)
			},
			closeQR() {
				//点击叉号表示未付款
				this.payResult = false
				this.showqr = false
				clearTimeout(this.timer)
				//关闭qr，跳转支付结果界面，支付结果为false
				this.gotoPayResult()
			},
			async modifyStatus() {
				const {
					data: res
				} = await uni.$http.get(`/modifyOrderStatus?orderId=${this.orderDetail.order_id}&payStatus=待发货`)
				// console.log(res)

				if (res.meta.status !== 200) {
					return uni.$showMsg("支付失败！")
				} else {
					uni.$showMsg("支付成功")
					this.payResult = true
					this.orderDetail.pay_status = "待发货"
					this.showqr = false
					this.gotoPayResult()
				}
			},
			gotoPayResult() {
				uni.navigateTo({
					url: '/subpkg/pay_result/pay_result?payResult=' + this.payResult +
						`&order=${encodeURIComponent(JSON.stringify(this.orderDetail))}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail-container {
		// background-color: #222222;
		padding-bottom: 200rpx;

		.detail-title {
			width: 100%;
			height: 200rpx;
			display: flex;

			.paystatus {
				width: 400rpx;
				height: 200rpx;
				padding-left: 20rpx;
				font-weight: 800;
				line-height: 200rpx;
				background-color: #f7f7f7;
			}

			image {
				width: 100%;
				height: 100%;
			}
		}

		.address {

			width: 720rpx;
			height: 150rpx;
			margin: 0 20rpx 20rpx 20rpx;
			background-color: #ffffff;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-radius: 10rpx;

			.info {
				margin-left: 20rpx;
				flex: 1;

				.name-phone {}

				.address-info {}
			}

		}

		.item-goods {
			width: 690rpx;
			background-color: #ffffff;
			padding: 0 20rpx;
			margin: 10rpx 0 0 10rpx;
			border-radius: 20rpx;

			.item-info {

				display: flex;
				justify-content: flex-start;
				align-items: center;

				.order-image {

					width: 200rpx;
					height: 200rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.name-tp {
					padding-left: 20rpx;
					flex: 1;
					position: relative;
					top: -30rpx;


				}

				.price-count {
					position: relative;
					top: -30rpx;
				}
			}

		}

		.detail-info {
			width: 690rpx;
			background-color: #ffffff;
			padding: 0 20rpx;
			margin: 10rpx 0 0 10rpx;
			border-radius: 20rpx;

			.detail-item {
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				justify-content: space-between;
				align-items: center;
			}

		}

		.order-number-time {
			width: 690rpx;
			background-color: #ffffff;
			padding: 0 20rpx;
			margin: 10rpx 0 0 10rpx;
			border-radius: 20rpx;


			.detail-item {
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				justify-content: space-between;
				align-items: center;
			}

		}

		.footer {
			width: 100%;
			height: 150rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			background-color: #ffffff;
			padding-right: 20rpx;
			position: fixed;
			bottom: 0;

			button {
				width: 200rpx;
				font-size: 30rpx;
				height: 80rpx;
				line-height: 50rpx;
				padding: 10rpx;
				border-radius: 40rpx;
				margin-right: 20rpx;
			}
		}

		.mask {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: black;
			opacity: .5;
			z-index: 500;
		}

		.qr {
			width: 500rpx;
			height: 600rpx;
			background-color: #ffffff;
			position: fixed;
			z-index: 999;
			top: 300rpx;
			left: 150rpx;

			.qrtext {
				width: 50rpx;
				height: 60rpx;
				text-align: center;
				line-height: 50rpx;
				position: absolute;
				left: 450rpx;
			}

			.hover {
				background-color: #ff2563;
			}

			image {
				width: 80%;
				height: 80%;
				position: relative;
				top: 80rpx;
				left: 45rpx;

			}
		}
	}
</style>
