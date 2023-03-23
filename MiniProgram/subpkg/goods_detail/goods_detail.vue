<template>
	<view class="goods" @click="shutdown">
		<view class="bar-list" v-show="scrolltop > 0">
			<text>商品</text>
			<text>详情</text>
			<text>推荐</text>
		</view>
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
				<image src="http://8.130.64.111:8800/upload/%E5%94%AE%E5%90%8E.png" mode=""></image>
				<image src="http://8.130.64.111:8800/upload/价格说明.png" mode="aspectFit"></image>
			</view>
			<!-- 商品导航组件 -->
			<view class="goods_nav" @click.stop="tryshut">
				<!-- fill 控制右侧按钮的样式 -->
				<!-- options 左侧按钮的配置项 -->
				<!-- buttonGroup 右侧按钮的配置项 -->
				<!-- click 左侧按钮的点击事件处理函数 -->
				<!-- buttonClick 右侧按钮的点击事件处理函数 -->
				<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click.stop="onClick"
					@buttonClick="buttonClick" />


			</view>



		</view>
		<!-- 点击加入购物车和立即购买时显示 -->
		<view class="cart-buy" v-show="clickText">
		</view>
		<view class="tp-trans" v-show="clickText">
			<view class="tp">
				<!-- 图片与价格与已选择的规格 -->
				<view class="tp-image">
					<view class="" style="width: 250rpx;height: 250rpx;">
						<image :src="activeTp.tp_imgsrc" mode=""></image>
					</view>
					<view class="tp-price">
						<view class="price-text">
							<text>￥</text>
							<text style="font-size: 25px;">{{activeTp.tp_price}}</text>
							<!-- <text>. </text> -->
						</view>
						<view class="tp-choosed">
							<text style="font-size: 12px;color: gray;">已选择：{{activeTp.tp_name}}</text>
						</view>
					</view>
				</view>
				<!-- 规格 -->
				<view class="tp-name">
					<view class="" style="font-size:35rpx ;">
						规格
					</view>
					<view class="tp-attrs">
						<view :class="['tp-item', activeIndex === index ? 'active': '']" v-for="(item,index) in attrs"
							:key="index" @click.stop="chooseTp(item,index)">
							{{item.tp_name}}
						</view>
					</view>
				</view>
				<!-- 数量 -->
				<view class="tp-count" @click.stop="tryshut">
					<text style="font-size:35rpx ;">数量</text>
					<uni-number-box :min="1" :value="goods_count" @change="numChangeHandler"></uni-number-box>
				</view>
				<!-- 确定按钮 -->
				<view class="tp-confirm">
					<button type="default" plain="true" @click="confirm">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'


	export default {
		computed: {
			...mapState('m_cart', []),
			...mapState('m_user', ['token']),
			...mapGetters('m_cart', ['total']),
		},
		watch: {
			// total(newVal){
			// 	const findResult = this.options.find(x => x.text === '购物车')

			// 	if(findResult){
			// 		findResult.info = newVal
			// 	}
			// }
			total: {
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				// 商品详情对象
				goods_info: {},
				//商品的规格数组
				attrs: [],
				activeIndex: 0,
				//点击的tp对象
				activeTp: {},
				goods_count: 1,
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
					info: 0
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#333333',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ff345b',
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
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				//判断是加入购物车还是立即购买
				clickText: '',
				scrolltop: 0,
				// 倒计时的秒数
				seconds: 3,
				// 定时器的 Id
				timer: null,
			};
		},
		onLoad(options) {
			// console.log(options)
			//获取传入的商品id
			const good_id = options.good_id
			this.queryObj.cat_id = options.cat_id
			//根据id获取详情信息
			this.getGoodDetail(good_id)
			this.getGoodsList()

		},
		methods: {
			...mapMutations('m_cart', ['addToCart']),
			...mapMutations('m_user', ['updateRedirectInfo']),

			showTips(n) {
				// 调用 uni.showToast() 方法，展示提示消息
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '登录后才能购买！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			numChangeHandler(val) {
				this.goods_count = val
				console.log(this.goods_count)
			},
			async getGoodDetail(good_id) {
				const {
					data: res
				} = await uni.$http.get('/detail', {
					good_id
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				//为商品信息赋值
				this.goods_info = res.message
				this.attrs = this.goods_info.attrs
				this.attrs.forEach((item) => {
					item.tp_price = item.tp_price.toFixed(2).toString()
				})
				this.activeTp = this.attrs[0]
				// console.log(this.activeTp)

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
				// console.log(e)
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
			buttonClick(e) {
				this.clickText = e.content.text
			},
			confirm() {
				console.log(12314545)
				if (this.clickText === '加入购物车') {

					//添加上商品的分类id！！！！！！！！！！！！！！
					const goods = {
						goods_id: this.goods_info.good_id,
						goods_name: this.goods_info.good_name,
						cat_one_id: this.goods_info.cat_one_id,
						cat_two_id: this.goods_info.cat_two_id,
						goods_price: this.activeTp.tp_price,
						goods_count: this.goods_count,
						goods_tp: this.activeTp.tp_name,
						goods_small_logo: this.activeTp.tp_imgsrc,
						goods_state: true
					}
					this.addToCart(goods)
					this.clickText = ''
				} else if (this.clickText === '立即购买') {
					if (this.token === '') {
						console.log("请先登录")
						return this.delayNavigate()
					} else {
						const goods = {
							goods_id: this.goods_info.good_id,
							goods_name: this.goods_info.good_name,
							cat_one_id: this.goods_info.cat_one_id,
							cat_two_id: this.goods_info.cat_two_id,
							goods_price: this.activeTp.tp_price,
							goods_count: this.goods_count,
							goods_tp: this.activeTp.tp_name,
							goods_small_logo: this.activeTp.tp_imgsrc,
							goods_state: true
						}
						const goodsArr = [goods] 
						uni.navigateTo({
							url: '/subpkg/orderpay/orderpay?goods=' + encodeURIComponent(JSON.stringify(goodsArr)) + '&total=' + goods.goods_price +'&isDelete=0'
						})
					}
				}

			},
			// 延迟导航到 my 页面
			delayNavigate() {
				// 把 data 中的秒数重置成 3 秒
				this.seconds = 3
				// 1. 展示提示消息，此时 seconds 的值等于 3
				this.showTips(this.seconds)

				// 2. 创建定时器，每隔 1 秒执行一次
				this.timer = setInterval(() => {
					// 2.1 先让秒数自减 1
					this.seconds--
					// 2. 判断秒数是否 <= 0
					if (this.seconds <= 0) {
						// 2.1 清除定时器
						clearInterval(this.timer)

						// 2.2 跳转到 my 页面
						uni.switchTab({
							url: '/pages/my/my',
							// 页面跳转成功之后的回调函数
							success: () => {
								// 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
								this.updateRedirectInfo({
									// 跳转的方式
									openType: 'navigateTab',
									// 从哪个页面跳转过去的
									from: `/subpkg/goods_detail/goods_detail?good_id=${this.goods_info.good_id}&cat_id=${this.goods_info.cat_id}`
								})
							}
						})
						console.log("跳转")

						// 2.3 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					// 2.2 再根据最新的秒数，进行消息提示
					this.showTips(this.seconds)
				}, 1000)
			},
			tryshut() {
				// console.log(5489489)
			},
			gotoDetail(goods) {
				// console.log(goods)
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + goods.good_id + '&cat_id=' + goods.cat_id
				})
			},
			shutdown() {
				this.clickText = ''
			},
			chooseTp(item, index) {
				//点击的规格索引
				this.activeIndex = index
				//点击的规格的属性值
				this.activeTp = item
			},
			scroll(){
				
			},
		},
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			this.scrolltop = e.scrollTop;
		}
	}
</script>

<style lang="scss">
	.goods {
		position: relative;

		.bar-list {
			width: 100%;
			height: 30px;
			line-height: 30px;
			position: fixed;
			background-color: #ffffff;
			z-index: 105;

			text {
				margin: 0 30px 0 40px;
			}
		}

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

		.cart-buy {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			background-color: black;
			opacity: .5;
			z-index: 100;
		}

		.tp-trans {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			z-index: 101;

			.tp {
				width: 100%;
				height: 400px;
				position: absolute;
				background-color: #ffffff;
				bottom: 0;
				animation: myfirst 0.5s;
				opacity: 1;
				border-radius: 10px;
				padding-left: 20rpx;
				display: flex;
				flex-direction: column;
				z-index: 999;

				.tp-image {
					width: 750rpx;
					height: 300rpx;
					// background-color: aqua;
					display: flex;
					justify-content: flex-start;
					align-items: center;

					image {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}

					.tp-price {
						// width: 200rpx;
						// height: 200rpx;
						flex: 1;
						padding: 100rpx 0 0 25rpx;

						.price-text {
							font-size: 15px;
							color: #ff3c62;
							// background-color: #ff3c62;
						}

						.tp-choosed {}
					}
				}

				.tp-name {
					width: 750rpx;

					.tp-attrs {
						width: 100%;
						padding: 25rpx 0 0 0;
						// background-color: #c00000;
						display: flex;
						flex-wrap: wrap;
						justify-content: flex-start;
						align-items: center;

						.tp-item {
							font-size: 30rpx;
							background-color: #f7f7f7;
							padding: 20rpx 25rpx;
							border-radius: 100rpx;
							margin: 0 10rpx 10rpx 0;
							border: 1px solid transparent;
						}

						.active {
							border: 1px solid #ff3c62;
							color: #ff3c62;
						}
					}
				}

				.tp-count {
					width: 750rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.tp-confirm {
					width: 750rpx;
					position: relative;
					bottom: -200rpx;
					// background-color: brown;

					button {
						width: 90%;
						height: 100rpx;
						border-radius: 100rpx;
						border: 1px solid transparent;
						line-height: 100rpx;
						color: white;
						background: linear-gradient(to right, #ff6180, #ff2c55)
					}
				}

			}

			@keyframes myfirst {
				from {
					bottom: -400px;
				}

				to {
					bottom: 0px;
				}
			}
		}


	}
</style>
