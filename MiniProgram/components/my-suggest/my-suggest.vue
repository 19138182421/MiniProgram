<template>
	<view class="suggest-container">
		<view class="suggest-image">
			<image src="~@/static/my-icons/suggest.png" mode=""></image>
		</view>

		<view class="goods-list" v-if="!isNull">
			<view class="goods-item" v-for="(good,index) in goodsList" :key="index" @click="gotoDetail(good)">
				<view class="good-image">
					<image :src="good.good_big_logo" mode=""></image>
				</view>
				<view class="good-name">
					<text>{{good.good_name}}</text>
				</view>
				<view class="good-price">
					<text>￥{{good.good_price}}</text>
				</view>
			</view>
		</view>

		<image src="~@/static/my-icons/end.png" mode="widthFix" class="footer"></image>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	export default {
		name: "my-suggest",
		data() {
			return {
				goodsList: [],
				isNull: true,
				isLoading: false,
			};
		},
		computed: {
			...mapState('m_user', ['token'])
		},
		mounted() {
			//获取商品列表
			if (this.token === '') {
				this.getRandom()  
			} else {
				this.getGoodsList()
			}
			uni.$on("getRandom", () => {
				if (this.isloading) return
				this.getRandom()
				// console.log("jain")
			})
		},
		methods: {
			async getGoodsList() {
				const {
					data: res
				} = await uni.$http.get('/getsuggest')
				this.isNull = false
				if (res.meta.status !== 200) return uni.$showMsg("数据加载失败！")
				// console.log(res) 
				this.goodsList = res.message.data
			},
			async getRandom() {
				this.isLoading = true
				const {
					data: res
				} = await uni.$http.get('/getrandom')
				this.isNull = false
				if (res.meta.status !== 200) return uni.$showMsg("数据加载失败！")
				// console.log(res)
				this.goodsList = [...this.goodsList, ...res.message.data]

				this.isLoading = false
			},
			gotoDetail(good) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + good.good_id + '&cat_id=' + good.cat_id
				})
			}
		}

	}
</script>

<style lang="scss">
	.suggest-container {
		width: 720rpx;
		margin: 20rpx;

		.suggest-image {
			width: 100%;
			height: 60rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.goods-list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;

			.goods-item {
				width: 49%;
				height: 450rpx;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				background-color: #FFFFFF;

				.good-image {
					width: 100%;
					height: 70%;

					image {
						border-radius: 20rpx;
						width: 100%;
						height: 100%;
					}
				}

				.good-name {
					padding: 10rpx 50rpx 0 20rpx;
					font-size: 35rpx;
					color: #222222;
				}

				.good-price {
					padding: 10rpx 30rpx 0 20rpx;
					font-size: 35rpx;
					font-weight: 800;
					color: #ff4e70;
				}
			}
		}


		.footer {
			width: 100%;
			position: relative;
			// left: -20px;
		}


	}
</style>
