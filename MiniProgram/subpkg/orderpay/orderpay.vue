<template>
	<view class="pay-container">
		<!-- 顶部图片 -->
		<view class="pay-title">
			<image src="../../static/order_title.png" mode="widthFix" style="position: relative; left: -1px;"></image>
		</view>

		<my-address></my-address>

		<view class="goods-list">
			<view class="goods-item" v-for="(goods,index) in goods" :key="index">
				<view class="goods-item-left">
					<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
				</view>
				<!-- 商品右侧信息区域 -->
				<view class="goods-item-right">
					<view class="goods-info-box">
						<view class="goods-name">{{goods.goods_name}}</view>
						<view class="goods-tp">
							<text style="font-size: 12px; font-weight: 100px; color: gray;">规格：{{goods.goods_tp}}</text>
						</view>
					</view>

					<view class="goods-price-count">
						<text style="color: #ff3c62;font-size: 15px;">￥</text>
						<text
							style="color: #ff3c62;font-size: 20px;">{{goods.goods_price.toString().split('.')[0]}}</text>
						<text
							style="color: #ff3c62;font-size: 15px;">.{{goods.goods_price.toString().split('.')[1] || '00'}}</text>
						<text style="color: gray;font-size: 12px; margin-left: 120px;">x{{goods.goods_count}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="order-info">
			<view class="order-info-item">
				<text>商品总价</text>
				<text style="font-size: 15px;">￥{{total}}</text>
			</view>
			<view class="order-info-item">
				<text>运费</text>
				<text style="font-size: 13px;">免运费</text>
			</view>
			<view class="order-info-item">
				<text>支付方式</text>
				<!-- <image src="../../static/my-icons/wechatpay.png" ></image>s -->
				<view class="">
					<uni-icons type="weixin" size="20" color="#3b9f30"></uni-icons>
					<text>微信支付</text>
				</view>
			</view>
		</view>

		<view class="addOrder">
			<view class="addorder-left">
				<text style="color: gray; margin-left: 5px;">实付</text>
				<text style="color: #ff3c62;font-size: 15px;">￥</text>
				<text
					style="color: #ff3c62;font-size: 20px; font-weight: 600;">{{total.toString().split('.')[0]}}</text>
				<text style="color: #ff3c62;font-size: 15px;">.{{total.toString().split('.')[1] || '00'}}</text>
			</view>

			<view class="addorder-right">
				<view class="btn-settle" @click="showQR">提交订单</view>
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
	import {
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				goods: [],
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				total: 10.00,
				payResult: false,
				showqr: false,
				address: {},
				order: {},
				timer: '',
				isDelete:false,
			};
		},
		onLoad(options) {
			//接收传入的商品数组
			if (options.goods) {
				// console.log(options.total)
				this.goods = JSON.parse(decodeURIComponent(options.goods))
				// console.log(this.goods)
				this.total = options.total
				// console.log("isDelete"+ options.isDelete)
				//等于0 不删除，等于1才删除
				if(options.isDelete == 0){
					this.isDelete = false
				}else{
					this.isDelete = true
				}
			}
		},
		onShow() {
			// console.log(123)
			uni.$on('updateData', (data) => {
				this.address = data
			})
		},
		methods: {

			...mapMutations('m_cart', ['updateAllGoodsChecked']),

			async showQR() {

				if (JSON.stringify(this.address) === '{}') {
					uni.$showMsg("请先选择收货地址", 2000)
				} else {
					this.order = {
						order_price: +this.total,
						receiver_name: this.address.receiver_name,
						receiver_phone: this.address.receiver_phone,
						order_address: `${this.address.address_area}-${this.address.address_detail}`,
						order_pay: "微信支付",
						pay_status: "待付款",
						goods: this.goods
					}
					console.log(this.order)

					// //插入数据库并返回订单编号
					const {
						data: res
					} = await uni.$http.post('/addOrders', this.order)


					if (res.meta.status !== 200) return uni.$showMsg("创建订单失败，服务器异常！")

					uni.$showMsg("成功创建订单")
					this.order = res.message.data
					console.log(res.message.data)

					//根据订单编号生成预支付二维码
					this.showqr = true

					//轮询查看订单的支付结果

					//如果3秒内无任何操作就跳转支付成功的界面
					this.timer = setTimeout(() => {
						// 调用修改订单状态的函数
						// console.log("修改数据库")
						this.modifyStatus()
					}, 3000)
				}

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

				// console.log(this.order)
				const {
					data: res
				} = await uni.$http.get(`/modifyOrderStatus?orderId=${this.order.order_id}&payStatus=待发货`)

				if (res.meta.status !== 200) {
					return uni.$showMsg("支付失败！")
				} else {
					uni.$showMsg("支付成功")
					this.payResult = true
					this.order.payStatus = "待发货"
					this.order.pay_status = "待发货"
					this.showqr = false
					this.gotoPayResult()
					
				}

			},
			gotoPayResult() {
				//如果是从购物车进来就删除，从商品详情进来就不执行删除
				//删除购物车中对应的商品
				if (this.isDelete) {
					// console.log("操作数据库")
					this.updateAllGoodsChecked()
				}

				uni.navigateTo({
					url: '/subpkg/pay_result/pay_result?payResult=' + this.payResult +
						`&order=${encodeURIComponent(JSON.stringify(this.order))}`
				})
			}
		}

	}
</script>

<style lang="scss">
	.pay-container {
		padding-bottom: 50px;
		position: relative;

		.pay-title {
			position: sticky;
			top: 0;
			background-color: #ffffff;
		}

		.goods-list {
			width: 310px;
			margin: 0 5px 0 5px;
			background-color: #ffffff;
			border-radius: 10px;

			.goods-item {
				width: 100%;
				height: 140px;
				// background-color: red;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.goods-item-left {
					width: 100px;
					height: 100px;

					.goods-pic {
						width: 100%;
						height: 100%;
						border-radius: 10px;
					}
				}

				.goods-item-right {
					flex: 1;
					height: 80%;
					margin-left: 10px;
					display: flex;
					flex-direction: column;
					align-content: space-between;

					.goods-info-box {
						flex: 1;
					}

					.goods-price-count {}
				}

			}

		}

		.order-info {
			width: 310px;
			height: 158px;
			margin: 10px 5px 50px 5px;
			background-color: #ffffff;
			border-radius: 10px;

			.order-info-item {
				width: 90%;
				height: 50px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: solid 1px lightgray;
				margin: 0 5px 0 10px;
			}

		}

		.addOrder {
			width: 100%;
			height: 50px;
			position: fixed;
			bottom: 0;
			display: flex;
			background-color: #ffffff;
			justify-content: space-between;
			align-items: center;

			.addorder-left {
				flex: 1;
			}

			.addorder-right {
				.btn-settle {
					height: 45px;
					min-width: 100px;
					background: linear-gradient(to right, #ff5236, #ff2563);
					color: white;
					line-height: 45px;
					text-align: center;
					padding: 0 10px;
					border-radius: 30px;
				}
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
