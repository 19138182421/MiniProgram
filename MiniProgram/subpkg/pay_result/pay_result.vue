<template>
	<view class="payResult-container">
		<view class="title">
			<image src="~@/static/my-icons/left.png" mode="" @click="goBackCart"></image>
			<text>付款结果</text>
		</view>
		<view class="payResult" v-if="payResult !== 0">
			<view class="pay-result" v-if="!payResult">
				<uni-icons type="info-filled" size="25" color="#ff4f58" style="margin-left: 20px;"></uni-icons>
				<text style="font-size: 20px;color: #ff4f58;">付款失败</text>
				<view style="font-size: 14px; color: darkgray; margin-top: 10px;">
					<text style="display: block;">请在半小时内尽快支付订单</text>
					<text style="display: block;margin-left: 15px;">否则订单将被自动取消</text>
				</view>
				<view class="button-group">
					<button type="default" plain="true" style="font-size: 15px;line-height:40px ; color: gray;"
						data-index="1" @click="gotoMyOrder">查看订单</button>
					<button type="default" plain="true"
						style="font-size: 15px;line-height:40px ; color: #ff4f58;border-color: #ff4f58;"
						@click="showQR">重新付款</button>

				</view>

			</view>

			<view class="pay-result" v-else>
				<uni-icons type="checkmarkempty" size="25" color="#1aa034" style="margin-left: 20px;"></uni-icons>
				<text style="font-size: 20px;color: #1aa034;">付款成功</text>
				<view style="font-size: 14px; color: darkgray; margin-top: 10px;">
					<text style="display: block;margin-left: 29px;">感谢你的购买！</text>
				</view>
				<view class="button-group">
					<button type="default" plain="true" style="font-size: 15px;line-height:40px ; color: gray;"
						data-index="2" @click="gotoMyOrder">查看订单</button>
					<button type="default" plain="true"
						style="font-size: 15px;line-height:40px ; color: #1aa034;border-color: #1aa034;"
						@click="gotoHome">继续逛逛</button>

				</view>
			</view>

		</view>

		<view class="" v-else>
		</view>

		<text class="zhuyi">
			注意：本平台以及销售商不会以订单异常、系统升级等任何理由要求您点击任何网址链接进行退款、转账操作，所有售后服务可以通过APP联系客服。
		</text>

		<view class="mask" v-if="showqr">
		</view>
		<view class="qr" v-if="showqr">
			<view class="qrtext" hover-class="hover" @click="closeQR">
				<text>x</text>
			</view>
			<image src="~@/static/qr.png" mode="widthFix"></image>
		</view>

		<view class="">
			<!-- 后续扩展 -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payResult: 0,
				showqr: false,
				orderDetail:{},
			};
		},
		onLoad(options) {
			// console.log(options.payResult)
			if (options.payResult === 'false') {
				this.payResult = false
			} else {
				this.payResult = true
			}
			this.orderDetail = JSON.parse(decodeURIComponent(options.order))
			// console.log(JSON.parse(decodeURIComponent(options.order)))
		},
		methods: {
			//转至首页
			gotoHome() {
				// console.log(123) 
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			//转到我的订单
			gotoMyOrder(e) {
				// console.log(e.currentTarget.dataset.index)
				uni.navigateTo({
					url: '/subpkg/my_order/my_order?index=' + e.currentTarget.dataset.index
				})
			},
			goBackCart() {
				console.log(123)
				uni.navigateBack({
					delta: 2,
					animationType: 'pop-out',
					animationDuration: 200
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
					this.orderDetail.payStatus = "待发货"
					this.showqr = false
					this.gotoPayResult()
				}
			},
			gotoPayResult() {
				// uni.redirectTo({
				// 	url: '/subpkg/pay_result/pay_result?payResult=' + this.payResult +
				// 		`&order=${encodeURIComponent(JSON.stringify(this.orderDetail))}`
				// })
				this.$router.go(0)
			}
		},

	}
</script>

<style lang="scss">
	.payResult-container {

		.title {
			width: 750rpx;
			height: 150rpx;
			background-color: #ff6781;
			position: relative;

			image {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				top: 80rpx;
			}

			text {
				position: absolute;
				top: 80rpx;
				left: 300rpx;
				color: white;
				font-size: 36rpx;
			}
		}

		.payResult {
			width: 100%;
			height: 200px;
			background-color: #FFFFFF;

			.pay-result {
				width: 80%;
				height: 100%;
				position: relative;
				top: 50px;
				left: 80px;

				.button-group {
					display: flex;
					justify-content: space-around;
					align-items: center;

					position: relative;
					top: 10px;
					left: -45px;

					button {
						width: 90px;
						height: 40px;
						border-radius: 30px;
						background-color: #FFFFFF;
						border: 1px solid gray;
					}
				}

			}
		}

		.zhuyi {
			display: block;
			margin: 5px 5px 0 5px;
			font-size: 12px;
			color: lightgray;
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
