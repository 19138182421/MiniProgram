<template>
	<view class="cart-container">
		<view class="cart-bar">
			<!-- <image src="http://localhost:8080/upload/cart/title.png" mode="widthFix"></image> -->
			<image src="~@/static/my-icons/cart-title.png" mode="widthFix"></image>
		</view>

		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18" color="#ff9966"></uni-icons>
			<!-- 右侧文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 循环渲染购物车内的信息 -->
		<view class="cart-content">
			<!-- 无数据时显示图片 -->
			<view class="" v-if="cart.length === 0">
				<image src="http://localhost:8080/upload/cart/kong.png" mode="widthFix"></image>
				<view class=""
					style="border:1px solid red;color: red;margin: auto;width: 50px;padding: 10px 30px;border-radius: 20px;"
					@click="gotoHome">
					<text>去逛逛 </text>
				</view>
			</view>

			<!-- 商品列表区域 -->
			<view class="cart-List" v-else>
				<uni-swipe-action>
					<block v-for="(goods, i) in cart" :key="i">
						<uni-swipe-action-item :right-options="options" @click="swiperItemClickHandler(goods)">
							<my-goods :goods="goods" @radio-change="radioChangeHandler"
								@num-change="numberChangeHandler">
							</my-goods>

						</uni-swipe-action-item>
					</block>
				</uni-swipe-action>
			</view>

		</view>

		<!-- 为你推荐 -->
		<my-suggest></my-suggest>
 
		<!-- 订单结算组件 -->
		<my-settle></my-settle>


	</view>

</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#ff59a1'
					}
				}]
			};
		},
		// 触底的事件
		onReachBottom() {
			// 重新获取列表数据
			uni.$emit("getRandom")
			// console.log("获取随机数据")
		},
		methods: {
			//去逛逛
			gotoHome() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			//修改选中状态
			radioChangeHandler(e) {
				// console.log(e)
				this.updateGoodsState(e)
			},
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			//修改商品数量
			numberChangeHandler(e) {
				// console.log(e)
				this.updateGoodsCount(e)
			},
			//删除商品
			swiperItemClickHandler(goods) {
				// console.log(goods)
				this.removeGoodsById(goods)
			}

		}
	}
</script>

<style lang="scss">
	.cart-container {
		// position: relative;
		padding-bottom: 100rpx;

		.cart-bar {
			position: fixed;
			border-top: 50rpx solid #ff6781;
			// box-sizing: border-box;
			top: 0px;
			background-color: #f7f7f7;
			z-index: 999;
		}

		.cart-title {
			height: 30px;
			display: flex;
			align-items: center;
			margin-top: 62px;
			padding-left: 5px;
			border-bottom: 1px solid #efefef;
			// border-top: 1px solid #ff5e62;
			background-color: #ffffff;

			.cart-title-text {
				margin-left: 10px;
				font-size: 14px;
			}
		}

		.cart-content {
			margin: 5px;

			.cart-List {
				// background-color: #ffffff;

			}
		}

		
		.cart-suggest {}

	}
</style>
