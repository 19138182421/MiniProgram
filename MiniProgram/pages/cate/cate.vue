<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item, i) in cateList" :key="i">
					<view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<view class="">
					<image style="width: 100%; height: 100px; margin-top: 10px;" :src="cateList[active].cat_imgsrc" ></image>
				</view>
				<view class="nav-list">
					<view class="nav-item" v-for="(item, i) in cateLevel2" :key="i" @click="gotoGoodsList">
						<img class="nav-img" :src="item.cat_imgsrc"></img>
						<!-- :src="item.cat_imgsrc"   -->
						<view>
							<text>{{item.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				// 一级分类数据列表
				cateList: [],
				// 二级分类数据列表
				cateLevel2: [],
				// 当前选中项的索引，默认让第一项被选中
				active: 0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			// 为 wh 窗口可用高度动态赋值
			this.wh = sysInfo.windowHeight
			// 调用获取分类列表数据的方法
			this.getCateList()
		},
		methods: {
			async getCateList() {

				const {
					data: res
				} = await uni.$http.get('/getcatitems')
				if (res.meta.status !== 200) return uni.$showMsg();
				console.log(res)
				// 为一级分类赋值
				this.cateList = res.message;
				// 为二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			// 选中项改变的事件处理函数
			activeChanged(i) {
				//修改一级分类的index索引，以此修改样式，突出选中的标签。
				this.active = i;
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[i].children
			},
			gotoGoodsList(){
				uni.navigateTo({
					url:"/subpkg/goods_list/goods_list?data="+ encodeURIComponent(JSON.stringify(this.cateList[this.active]))
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}

		.right-scroll-view {
			.nav-list {
				display: flex;
				// justify-content: center;
				margin: 15px 0;
				flex-wrap: wrap;
				font-size: 30rpx;

				.nav-item {
					width: 65px;
					height: 70px;
					margin: 0 0 8px 10px;
					
					.nav-img {
						width: 60px;
						height: 50px;
						// background-color: red;
					}
				}


			}
		}
	}
</style>
