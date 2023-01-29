<template>
	<view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的 item 项 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?good_id=' + item.good_id">
					<!-- 动态绑定图片的 src 属性 -->
					<image :src="item.image_src" ></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="gotonavgoodslist(item)">
				<image  class="nav-img" :src="item.nav_imgsrc"></image>
				<!-- :src="item.cat_imgsrc" -->
				<view>
					<text>{{item.cat_name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 1. 轮播图的数据列表，默认为空数组
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
			}
		},
		onLoad() {
			
			// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
			this.getSwiperList()
			// 调用获取分类数据的方法
			this.getNavList()
		},
		methods: {
			// 3. 获取轮播图数据的方法
			async getSwiperList() {
				// 3.1 发起请求
				const {
					data: res
				} = await uni.$http.get('/getMessage')
				// console.log(res)
				// 3.2 请求失败
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 3.3 请求成功，为 data 中的数据赋值
				this.swiperList = res.message
			},
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/getcategory/0')
				if (res.meta.status !== 200) return uni.$showMsg()
				// console.log(res)
				this.navList = res.message
			},
			gotonavgoodslist(item){
				uni.navigateTo({
					url:"/subpkg/navgoodslist/navgoodslist?data="+ encodeURIComponent(JSON.stringify(item))
				})
			}
		},
	}
</script>

<style lang="scss">
	swiper {
		height: 380rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		flex-wrap: wrap;
		font-size: 30rpx;

		.nav-img {
			width: 50px;
			height: 50px;
			margin: 5px;
			border-radius: 50%;
			// background-color: red;
		}
	}
</style>
