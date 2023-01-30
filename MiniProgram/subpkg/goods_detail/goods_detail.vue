<template>
	<view v-if="goods_info.good_name" class="goods-detail">
		<!-- 轮播图区域 -->
		<view class="goods-swiper">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="false">
				<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
					<image :src="item.pic_url" @click="preview(i)"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.good_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.good_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
			<view class="biezhu">
				<image class="yes" src="../../static/tab_icons/yes.png"></image>
				<text>假一赔十</text>
				<image class="yes" src="../../static/tab_icons/yes.png"></image>
				<text>权威测试</text>
				<image class="yes" src="../../static/tab_icons/yes.png"></image>
				<text>不支持七天无理由</text>
			</view>
		</view>
		<view class="suggest" style="width:100%;height:200px;background-color: snow;">
			<view style="font-size: 16px; color: dimgray;">
				为你推荐
			</view>
			<scroll-view class="goods-list" scroll-x="true" @scroll="scroll" show-scrollbar="true" scroll-left="80">
				<block v-for="(goods,i) in goodsList" :key="i">
					<view class="good-item" @click="gotoDetail(goods)">
						<view class="goods-img">
							<image :src="goods.good_big_logo || defaultPic" class="goods-pic"></image>
						</view>
						<view class="goods-info">
							<view class="goods-name" style="color: black;">
								{{goods.good_name}}
							</view>
							<view class="goods-price" style="color: red;">
								￥{{goods.good_price}}
							</view>
						</view>
					</view>

				</block>
			</scroll-view>


		</view>




		<!-- 售后 -->
		<view class="shouhou">
			<image src="http://localhost:8080/upload/%E5%94%AE%E5%90%8E.png" mode=""></image>
			<image src="http://localhost:8080/upload/价格说明.png" mode="aspectFit"></image>
		</view>
		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				// 左侧按钮组的配置对象
				options: [{
					icon: 'staff',
					text: '客服'
				}, {
					icon: 'home',
					text: '首页',
				}, {
					icon: 'cart',
					text: '购物车',
					info: 3
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#000000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ff6781',
						color: '#fff'
					}
				],
				goodsList: [],
				queryObj: {
					//查询关键字
					query: '',
					//分类id
					cat_id: 15,
					pageNum: 1,
					pageSize: 5
				},
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad(options) {
			console.log(options)
			//获取传入的商品id
			const good_id = options.good_id
			this.queryObj.cat_id = options.cat_id
			//根据id获取详情信息
			this.getGoodDetail(good_id)
			this.getGoodsList()

		},
		methods: {
			async getGoodDetail(good_id) {
				const {
					data: res
				} = await uni.$http.get('/detail', {
					good_id
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				//为商品信息赋值
				this.goods_info = res.message

			},
			async getGoodsList() {
				//发请求
				const {
					data: res
				} = await uni.$http.get('/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				//为商品列表赋值
				this.goodsList = res.message.goods

			},
			preview(i) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，默认显示图片的索引
					current: i,
					// 所有图片 url 地址的数组
					urls: this.goods_info.pics.map(x => x.pic_url)
				})
			},
			onClick(e) {
				console.log(e)
				if (e.content.text === '首页') {
					// 切换到购物车页面
					uni.switchTab({
						url: '/pages/home/home'
					})
				}
				if (e.content.text === '购物车') {
					// 切换到购物车页面
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			gotoDetail(goods) {
				// console.log(goods)
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + goods.good_id + '&cat_id=' + goods.cat_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-detail {

		padding-bottom: 50px;

		.goods-swiper {
			swiper {
				height: 520rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.goods-info-box {
			padding: 10px;
			padding-right: 0;
			background-color: #ffffff;

			.price {
				color: #c00000;
				font-size: 18px;
				margin: 10px 0;
			}

			.goods-info-body {
				display: flex;
				justify-content: space-between;

				.goods-name {
					font-size: 13px;
					padding-right: 10px;
				}

				// 收藏区域
				.favi {
					width: 120px;
					font-size: 12px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-left: 1px solid #efefef;
					color: gray;
				}
			}

			// 运费
			.yf {
				width: 100%;
				margin: 10px 0;
				font-size: 12px;
				color: gray;
			}


			.biezhu {
				height: 30px;
				background-color: #ffffff;
				border-top: 1px solid lightgray;
				padding: 5px 0 5px 0;
				position: relative;
				left: -8px;

				.yes {
					width: 15px;
					height: 15px;
					border-radius: 50%;
					margin-right: 2px;
				}

				text {
					font-size: 13px;
					margin-right: 15px;
				}
			}


		}

		.suggest {
			.goods-list {
				white-space: nowrap;
				width: 100%;
				font-size: 12px;

				.good-item {
					display: inline-block;
					width: 80px;
					margin: 0 5px 0 5px;

					.goods-img {
						width: 100%;
						height: 100px;

						// background-color: #c00000;
						.goods-pic {
							width: 100%;
							height: 100%;
						}
					}

					.goodd-info {}
				}
			}
		}

		.shouhou {}

		.goods_nav {
			// 为商品导航组件添加固定定位
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
	}
</style>
