<template>
	<view class="nav-container" :style="{'--color':color}">
		<view class="nav-title">
			<image :src="navData.cat_imgsrc" mode=""></image>
		</view>

		<view class="info-bar" :style="{'--color':colorBar}">
			<text style="padding-left: 10rpx;">共{{total}}件商品</text>
			<view class="price-up-down" @click="changeUpDown">
				<text v-if="upDown">价格升序</text>
				<text v-else>价格降序</text>
			</view>
		</view>

		<view class="cat-title" v-if="!isNull" v-for="(cat,index) in catList" :key="index">
			<view class="cat-yangshi">
				<!-- 分类名 -->
				{{cat.cat_name}}
			</view>
			<view class="goods-list" >
				<view class="goods-item" v-for="(good,index) in goodsArr(cat.cat_id)" :key="index" @click="gotoDetail(good)">
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
		</view>

		<image src="~@/static/my-icons/end.png" mode="widthFix" class="footer"></image>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				navData: {},
				color: '',
				cat_id: 0,
				catList: [],
				goodsList: [],
				isNull: true,
				upDown: false,
				total: 0,
				colorBar: '',
			};
		},
		computed: {},
		onLoad(options) {
			this.navData = JSON.parse(decodeURIComponent(options.data))
			// console.log(options)
			this.color = options.color
			this.colorBar = options.colorBar
			this.cat_id = this.navData.cat_id
			uni.setNavigationBarTitle({
				title: this.navData.cat_name
			})
			this.getGoodsList()
		},
		methods: {
			goodsArr(catId){
				// console.log(catId)
				return this.goodsList.filter(x => x.cat_id === catId)
			},
			async getGoodsList() {
				const {
					data: res
				} = await uni.$http.get(`/getnavgoods?cat_id=${this.cat_id}`)
				this.isNull = false
				if (res.meta.status !== 200) return uni.$showMsg("数据加载失败！")
				//商品列表
				this.goodsList = res.message.goodsList
				//分类列表
				this.catList = res.message.catList
				this.total = this.goodsList.length

			},
			changeUpDown() {
				this.upDown = !this.upDown
				if (!this.upDown) {
					this.goodsList.sort((a, b) => {
						return a.good_price - b.good_price
					})
				} else {
					this.goodsList.sort((a, b) => {
						return b.good_price - a.good_price
					})
				}
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
	.nav-container {
		background-color: var(--color);

		.nav-title {
			width: 750rpx;
			height: 400rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info-bar {
			width: 100%;
			height: 80rpx;
			background-color: var(--color);
			position: sticky;
			top: -1px;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			color: #FFFFFF;
			font-weight: 800;

			.price-up-down {
				padding-right: 30rpx;
			}

		}
		
		.cat-yangshi{
			font-size: 40rpx;
			color: #ff4e70;
			font-weight: 800;
			margin:50rpx 0 20rpx 300rpx;
		}

		.goods-list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;

			.goods-item {
				width: 49%;
				height: 550rpx;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				background-color: #FFFFFF;

				.good-image {
					width: 100%;
					height: 80%;

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
