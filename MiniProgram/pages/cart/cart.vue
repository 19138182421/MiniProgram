<template>
	<view class="cart-container">
		<view class="cart-bar">
			<image src="http://localhost:8080/upload/cart/title.png" mode="widthFix"></image>
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
		<view class="cart-suggest" style="width: 100%; height: 800px; background-color: pink; margin-top: 30px;">
			<text>为你推荐</text>

		</view>

		<image src="http://localhost:8080/upload/%E5%88%B7%E6%96%B0.png" mode="widthFix" class="footer"></image>



		<!-- 结算 -->
		<!-- <view class="cart-pay" @click="gotoOrderPay" >
		结算
		</view> -->

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
		methods: {
			//去逛逛
			gotoHome() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			//修改选中状态
			radioChangeHandler(e) {
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
				this.removeGoodsById(goods.goods_id)
			},
			//转到订单结算界面
			gotoOrderPay() {
				// console.log(this.cart)
				//此处对this.cart数组做过滤，过滤出未选中的商品
				const goods = this.cart.filter(x => x.goods_state == true)
				// console.log(goods)
				uni.navigateTo({
					url: '/pages/orderpay/orderpay?goods=' + encodeURIComponent(JSON.stringify(goods))
				})
			}

		}
	}
</script>

<style lang="scss">
	.cart-container {
		// position: relative;
		padding-bottom: 45px;

		.cart-bar {
			position: fixed;
			top: 0px;
			padding: 10px 0 0 0;
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
			border-top: 1px solid #ff5e62;
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

		.footer {
			position: relative;
			left: -1px;
		}

		.cart-suggest {}

	}
</style>
