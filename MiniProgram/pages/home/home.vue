<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch" :radius="200" :bgcolor="bgcolor"></my-search>
			<view class="dingbu" v-if="isShow" @click="topBack">
				<image src="~@/static/my-icons/dingbu.jpg" mode=""></image>
			</view>
		</view>
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!-- 循环渲染轮播图的 item 项 -->
			<swiper-item v-for="(item, i) in swiperList" :key="i">
				<navigator class="swiper-item"
					:url="'/subpkg/goods_detail/goods_detail?good_id=' + item.good_id + '&cat_id=' + item.cat_id">
					<!-- 动态绑定图片的 src 属性 -->
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, i) in navList" :key="i" @click="gotonavgoodslist(item,i)">
				<image class="nav-img" :src="item.nav_imgsrc"></image>
				<!-- :src="item.cat_imgsrc" -->
				<view>
					<text>{{item.cat_name}}</text>
				</view>
			</view>
		</view>



		<my-suggest></my-suggest>

	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'

	export default {
		mixins: [badgeMix],
		data() {
			return {
				// 1. 轮播图的数据列表，默认为空数组
				swiperList: [],
				// 分类导航的数据列表
				navList: [],
				bgcolor: '#ffffff',
				isShow: false,
				colorArr:['#fff4d1','#feebda','#f4edff','#fceafe','#ffece6','#e5effe','#fff0f0','#ffeacd','#ffeca9','#ffcebf'],
				colorBar:['#ffc023','#fe9a4a','#a66af9','#d78ce0','#ff8259','#7dafff','#ff8fad','#fbc070','#ebd99c','#f87f5a']

			}
		},
		onLoad() {

			// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
			this.getSwiperList()
			// 调用获取分类数据的方法
			this.getNavList()
		},
		// 触底的事件
		onReachBottom() {
			// 重新获取列表数据
			uni.$emit("getRandom")
			// console.log("获取随机数据")
		},
		onPageScroll(e){ 
			
			if (e.scrollTop >= 200) {
				// 显示
				this.isShow = true
			} else {
				// 隐藏
				this.isShow = false
			}

		},
		methods: {
			topBack() {
				uni.pageScrollTo({
					scrollTop: 0, // 滚动到页面的目标位置  这个是滚动到顶部, 0 
					duration: 300 // 滚动动画的时长
				})
			},
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
			gotonavgoodslist(item,i) {
				uni.navigateTo({
					url: `/subpkg/navgoodslist/navgoodslist?color=${this.colorArr[i]}&colorBar=${this.colorBar[i]}&data=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		},
	}
</script>

<style lang="scss">
	.search-box {
		background-color: #ffffff;
		// 设置定位效果为“吸顶”
		position: sticky;
		// 吸顶的“位置”
		top: 0;
		// 提高层级，防止被轮播图覆盖
		z-index: 999;

		.dingbu {
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			border-radius: 50%;
			top: 800rpx;
			left: 600rpx;
			animation: key 1s;
			
			

			image {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		
		@keyframes key {
		  from{ 
			left: 700rpx;
		  }
		  to{
			left: 600rpx;
		  }
		} 
	}

	swiper {
		height: 500rpx;

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
