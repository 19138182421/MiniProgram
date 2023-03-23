<template>
	<view class="order-container">

		<!-- 顶部不动元素 -->
		<view class="order-title">
			<view class="search-bar">
				<uni-search-bar @clear="clear" :radius="100" cancelButton="none" :placeholder="placeholder"
					:bgColor="bgColor">
				</uni-search-bar>
			</view>
			<view class="order-bar">
				<view :data-payStatus="item" :class="['bar-item', activeIndex == index?'active' : '']"
					v-for="(item,index) in titleArr" :key="index" @click="gotoBarItem($event,index)">
					{{item}}
				</view>
			</view>
		</view>

		<view class="back" style="">
			<image src="../../static/my-icons/loading.png" mode=""></image>
		</view>

		<view class="placeholder" v-if="JSON.stringify(orderList) === '[]'">
			<image src="../../static/my-icons/orderkong.png" mode=""></image>
		</view>

		<view class="order-list" v-else>
			<view class="order-item" v-for="(order,index) in orderList" :key="index">
				<view class="item-title">
					<view class="" @click="gotoOrderDetail(index)">
						<text style="font-size: 35rpx;color: #8e8e8e;">订单编号：</text>
						<text style="font-size: 30rpx;color: #8e8e8e;">{{order.order_number}}</text>
					</view>
					<view class="">
						<text style="font-size: 35rpx;color: #ff3c62; margin-right: 20rpx;">{{order.pay_status}}</text>
						<uni-icons type="trash" @click="deleteConfirm(order)" v-if="orderStatus(order.pay_status)"></uni-icons>
					</view>
				</view>
				<view class="item-goods" v-for="(good,index) in order.goods" :key="index">
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
							<view style="font-size: 30rpx;color: #a3a3a3;padding-left: 70rpx;">
								x{{good.good_number}}
							</view>
						</view>
					</view>
				</view>
				<view class="item-detail">
					<text style="font-size: 30rpx;color:#a3a3a3;margin-right: 20rpx;">共{{order.goods.length}}件商品</text>
					<text style="font-size: 35rpx;color:#ff3c62;">实付：￥{{order.order_price}}</text>
				</view>

			</view>
		</view>

		<!-- 为你推荐 -->
		<my-suggest></my-suggest>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				placeholder: "搜索我的订单",
				bgColor: '#eeeeee',
				titleArr: ['全部', '待付款', '待发货', '待收货', '已收货'],
				activeIndex: 0,
				orderList: [],
				payStatus: '',
			};
		},
		onLoad(options) {
			console.log(options.index)
			this.activeIndex = options.index
			this.payStatus = this.titleArr[this.activeIndex]
			this.getOrderList()
		},
		onShow() {
			this.getOrderList()
		},
		onPullDownRefresh() {
			this.getOrderList(() => uni.stopPullDownRefresh())
		},
		methods: {
			orderStatus(orderStatus){
				if(orderStatus === '待付款' || orderStatus === '交易完成' || orderStatus === '交易关闭'){
					return true
				}else{
					return false
				}
			},
			gotoBarItem(e, index) {
				uni.pageScrollTo({
					scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0 
					duration: 300 // 滚动动画的时长
				})
				this.activeIndex = index
				// console.log(e)
				const paystatus = e.currentTarget.dataset.paystatus
				if (paystatus === '已收货') {
					this.payStatus = '交易完成'
				} else {
					this.payStatus = paystatus
				}
				// console.log(this.payStatus)
				this.getOrderList()
			},
			async getOrderList(cb) {
				if (this.activeIndex == 0) {
					const {
						data: res
					} = await uni.$http.get('/getAllOrders')
					// console.log(res)
					if (res.meta.status !== 200) return uni.$showMsg("数据加载失败！")
					this.orderList = res.message.data.reverse()
				} else {
					//调用根据状态搜索订单
					// console.log(this.activeIndex)
					// console.log(this.payStatus)
					const {
						data: res
					} = await uni.$http.get(`/getOrdersByStatus?pay_status=${this.payStatus}`)
					cb && cb()
					if (res.meta.status !== 200) return uni.$showMsg("数据加载失败！")
					this.orderList = res.message.data.reverse()
				}

			},
			gotoOrderDetail(index) {
				// console.log(index)
				uni.navigateTo({
					url: '/subpkg/order_detail/order_detail?orderDetail=' + encodeURIComponent(JSON.stringify(this
						.orderList[index]))
				})
			},
			deleteConfirm(order) {
				uni.showModal({
					title: '提示',
					content: '是否删除该订单',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.deleteOrder(order)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			async deleteOrder(order) {
				// console.log(456)
				const {
					data: res
				} = await uni.$http.get(`/deleteOrder?order_id=${order.order_id}`)
				if (res.meta.status !== 200) return uni.$showMsg("删除失败！！")
				uni.$showMsg("删除完成！！")
				this.orderList = this.orderList.filter(x => x.order_id !== order.order_id)
			}
		}
	}
</script>

<style lang="scss">
	.order-container {
		padding-top: 200rpx;
		position: relative;

		.back {
			width: 200rpx;
			height: 100rpx;
			background-color: #ff3c62;
			position: absolute;
			top: 90rpx;
			left: 35%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.order-title {
			width: 730rpx;
			position: fixed;
			top: 0;
			z-index: 100;
			padding-top: 10rpx;
			padding-right: 10rpx;
			padding-left: 10rpx;
			background-color: #FFFFFF;

			.search-bar {
				height: 100rpx;
				background-color: #ffffff;
			}


			.order-bar {
				width: 100%;
				background-color: #FFFFFF;
				font-size: 35rpx;
				padding-top: 20rpx;
				color: #8e8e8e;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.bar-item {
					padding: 0 0 20rpx 0;
					border: 2px solid transparent;
					background-color: #FFFFFF;
				}

				.active {
					color: #ff3c62;
					border-bottom: 2px solid #ff3c62;
				}

			}
		}

		.placeholder {
			width: 730rpx;
			height: 700rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.order-list {
			.order-item {
				width: 700rpx;
				background-color: #ffffff;
				padding: 0 20rpx;
				margin: 10rpx 10rpx 20rpx 10rpx;
				border-radius: 20rpx;

				.item-title {
					display: flex;
					justify-content: space-between;
					align-items: center;

				}

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

				.item-detail {
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
			}
		}
	}
</style>
