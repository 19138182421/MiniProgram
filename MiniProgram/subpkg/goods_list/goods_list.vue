<template>
	<view style="position: relative;">
		<!-- 滚动条 -->
		<view class="container" style="position: fixed;background-color: #ffffff;z-index: 999;">
			<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" show-scrollbar="true" scroll-left="80">
				<view id="demo1" :class="['scroll-view-item_H', i === active ? 'active' : '']"
					v-for="(item, i) in cateList " :key="i" @click="gotoCate(item,i)">{{item.cat_name}}
					<view class="xiahuaxian" v-show="i===active">
						_____
					</view>
				</view>

			</scroll-view>
		</view>
		<!--商品列表  -->
		<view class="goods-list" style="position: absolute;top: 40px;">
			<block v-for="(goods,i) in goodsList" :key="i">
				<view class="good-item" @click="gotoDetail(goods)">
					<view class="goods-img">
						<image :src="goods.good_big_logo || defaultPic" class="goods-pic"></image>
					</view>
					<view class="goods-info">
						<view class="goods-name">
							{{goods.good_name}}
						</view>
						<view class="goods-price">
							￥{{goods.good_price}}
						</view>
					</view>
				</view>

			</block>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//分类列表
				cateList: [],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				active: 0,
				//查询参数对象
				queryObj: {
					//查询关键字
					query: '',
					//分类id
					cat_id: '',
					pageNum: 1,
					pageSize: 4
				},
				// 商品列表
				goodsList: [],
				//总数量
				total: 0,
				//默认图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				//节流阀 是否正在请求数据
				isloading: false,
			};
		},
		onLoad(options) {

			const myData = JSON.parse(decodeURIComponent(options.data))
			// console.log(myData)
			uni.setNavigationBarTitle({
				title: myData.cat_name
			});
			this.active = Number(options.active)
			//分类列表
			this.cateList = myData.children
			//首屏显示的商品分类id
			this.queryObj.cat_id = this.cateList[options.active].cat_id
			//请求数据
			this.getGoodsList()
		},
		methods: {
			scroll: function(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			//更改生效的分类
			gotoCate(item, i) {
				this.active = i;
				this.queryObj.cat_id = item.cat_id
				this.queryObj.pageNum = 1
				this.total = 0
				this.goodsList = []

				this.getGoodsList()
			},
			// 获取商品列表
			async getGoodsList() {

				// ** 打开节流阀
				this.isloading = true

				//发请求
				const {
					data: res
				} = await uni.$http.get('/search', this.queryObj)
				if (res.meta.status !== 200) return uni.$showMsg()
				//为商品列表赋值
				// this.goodsList = res.message.goods
				// 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total

				// ** 关闭节流阀
				this.isloading = false

			},
			gotoDetail(goods) {
				// console.log(goods)
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + goods.good_id + '&cat_id=' + goods.cat_id
				})
			}
		},
		onReachBottom() {

			// 判断是否还有下一页数据
			if (this.queryObj.pageNum * this.queryObj.pageSize >= this.total) return uni.$showMsg('数据加载完毕！')

			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isloading) return

			// 让页码值自增 +1
			this.queryObj.pageNum += 1
			// 重新获取列表数据
			this.getGoodsList()
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 30px;

		.scroll-view_H {
			white-space: nowrap;
			width: 100%;

			.scroll-view-item_H {
				display: inline-block;
				width: 80px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				font-size: 15px;
				position: relative;

				.xiahuaxian {
					font-size: 20px;
					position: absolute;
					top: 0;
					left: 17px;
				}
			}

			.active {
				color: red;
			}
		}
	}

	.goods-list {
		display: flex;
		flex-wrap: wrap;

		.good-item {
			width: 150px;
			height: 250px;
			margin: 5px;
			border-radius: 20px;
			background-color: #ffffff;

			.goods-img {
				width: 100%;
				height: 200px;
				border-radius: 20px;

				.goods-pic {
					width: 100%;
					height: 100%;
					border-radius: 20px 20px 0 0 ;
				}
			}

			.goods-info {
				.goods-name {}

				.goods-price {
					color: red;
				}
			}
		}


	}
</style>
