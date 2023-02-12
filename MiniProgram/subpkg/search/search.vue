<template>
	<view class="search-page">
		<view class="search-box" style="background-color: #FFFFFF;">
			<!-- 使用 uni-ui 提供的搜索组件 -->
			<uni-search-bar v-model="kw" @focus="focus" @confirm="confirm" @input="input" @clear="clear" :radius="100"
				cancelButton="none" :placeholder="placeholder" :bgColor="bgColor">
			</uni-search-bar>
			<view
				style="width:50px;height:56px;position: absolute; top: 0px;left:270px; background-color: #FFFFFF;line-height: 56px;color: darkgray;border-bottom: 1px solid lightgray;"
				@click="goBack">取消</view>
		</view>


		<view class="history" style="width:350px;height:500px;background-color:#FFFFFF" v-show="active == 0">
			<!-- 搜索历史 -->
			<view class="history-box">
				<!-- 标题区域 -->
				<view class="history-title">
					<text>搜索历史</text>
					<uni-icons type="trash" size="20" @click="cleanHistory"></uni-icons>
				</view>
				<!-- 列表区域 -->
				<view class="history-list">
					<uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="getGoods(item)"></uni-tag>
				</view>
			</view>

		</view>

		<view style="position: relative;">
			<!-- 搜索建议列表 -->
			<view :class="['sugg-list']" v-if="searchResults.length !== 0">
				<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="getGoodsList(item)">
					<view class="goods-name">{{item.kw_value}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<!-- <view style="width: 100px;height: 100px; background-color: aqua;" >
				
			</view> -->

			<!--商品列表  -->
			<view :class="['goods-list']" v-if="goodsList.length !== 0">
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




	</view>

</template>

<script>
	export default {
		data() {
			return {
				placeholder: "搜索关键词，找到你想要的",
				bgColor: 'lightgray',
				//延时器的timerId
				timer: null,
				//搜索关键词
				kw: '',
				active: 0,
				//搜索结果列表
				searchResults: [],
				// 商品列表
				goodsList: [],
				// 搜索关键词的历史记录
				historyList: ['asjkdf'],
			};
		},
		computed: {
			historys() {
				// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse()
			}
		},
		methods: {
			// 清空搜索历史记录
			cleanHistory() {
				uni.showModal({
					title: '提示',
					content: '是否清空搜索历史',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							// 清空 data 中保存的搜索历史
							this.historyList = []
							// 清空本地存储中记录的搜索历史
							uni.setStorageSync('kw', '[]')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			input(e) {
				this.goodsList = []
				//输入框的e为输入的值。
				console.log(e)
				//清除timer延时器
				clearTimeout(this.timer)
				//重启一个延时器
				this.timer = setTimeout(() => {
					//设置延时器为500ms，500ms内没有输入就开始搜索，否则就清除延时器并重新开一个延时器，防止不断发起请求、
					this.kw = e
					//获取搜索建议列表
					this.getSearchList()
				}, 500)
			},
			confirm(e) {
				console.log(e)
				let item = {
					kw_value: e.value
				}
				console.log(item)
				//获取搜索建议列表
				this.getGoodsList(item)
			},
			focus(e) {
				this.goodsList = []
				this.getSearchList()
			},
			clear(e) {
				this.searchResults = []
			},
			goBack() {

				uni.navigateBack({
					delta: 1
				});
			},
			getGoods(item) {
				let key = {
					kw_value: item
				}
				console.log(key)
				//获取搜索建议列表
				this.getGoodsList(key)
			},
			// 根据关键词，搜索关键词建议列表
			async getSearchList() {
				this.active = 1
				// 判断关键词是否为空
				if (this.kw === '') {
					this.searchResults = []
					this.active = 0
					// this.goodsList = []
					return
				}
				// console.log(this.active)
				// 发起请求，获取搜索建议列表
				const {
					data: res
				} = await uni.$http.get('/getquery', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg("暂无数据")
				this.searchResults = res.message
				//存储搜索的关键字
				this.saveSearchHistory()
				// console.log(13)
			},
			async getGoodsList(item) {

				// 发起请求，获取搜索建议列表
				this.kw = item.kw_value
				const {
					data: res
				} = await uni.$http.get('/qsearch', {
					query: item.kw_value
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.goodsList = res.message
			},
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?good_id=' + goods.good_id + '&cat_id=' + goods.cat_id
				})
			},
			saveSearchHistory() {
				// 2.1 直接把搜索关键词 push 到 historyList 数组中
				// this.historyList.push(this.kw)

				//解决关键字重复问题
				// 1. 将 Array 数组转化为 Set 对象
				const set = new Set(this.historyList)
				// 2. 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete(this.kw)
				// 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add(this.kw)
				// 4. 将 Set 对象转化为 Array 数组
				this.historyList = Array.from(set)

				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			}
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		}
	}
</script>

<style lang="scss">
	.search-page {
		position: relative;
		// height: 1000px;

		.search-box {
			width: 270px;
			position: fixed;
			top: 0;
			z-index: 999;
			border-bottom: 1px solid lightgray;
		}

		.history {
			position: absolute;
			top: 55px;

			.history-box {
				padding: 0 5px;

				.history-title {
					width: 300px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 40px;
					font-size: 13px;
					border-bottom: 1px solid #efefef;
				}

				.history-list {
					margin-top: 15rpx;
					display: flex;
					flex-wrap: wrap;
					height: 65px;

					.uni-tag {
						margin-top: 50px;
						margin-right: 5px;

					}
				}
			}
		}


		.showtop {
			// z-index: 80;
		}

		.sugg-list {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 55px;
			padding: 0 5px;
			background-color: #ffffff;

			.sugg-item {
				width: 300px;
				font-size: 12px;
				padding: 13px 0;
				border-bottom: 1px solid #efefef;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.goods-name {
					// 文字不允许换行（单行文本）
					white-space: nowrap;
					// 溢出部分隐藏
					overflow: hidden;
					// 文本溢出后，使用 ... 代替
					text-overflow: ellipsis;
					margin-right: 3px;
				}
			}
		}

		.goods-list {
			position: absolute;
			top: 55px;
			background-color: #ffffff;
			display: flex;
			flex-wrap: wrap;

			.good-item {
				width: 150px;
				height: 250px;
				margin: 5px;
				background-color: #ffffff;

				.goods-img {
					width: 100%;
					height: 200px;

					.goods-pic {
						width: 100%;
						height: 100%;
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
	}
</style>
