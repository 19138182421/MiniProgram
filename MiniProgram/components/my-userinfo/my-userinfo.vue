<template>
	<view class="my-userinfo">
		<view class="my-userinfo-container">

			<view class="top-box">
				<!-- 个人昵称pet_name加个人id user_id -->
				<view class="name-id">
					<text>昵称：{{userinfo.petName}}</text>
					<text>ID：{{userinfo.userId}}</text>
				</view>
				<!-- 头像-->
				<image src="http://8.130.64.111:8800/images/d2aad0a4-9327-4cd2-a1a7-43438a3e851b.png" class="avatar"></image>
			</view>

		</view>

		<!-- 面板的列表区域 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<!-- panel 的主体区域 -->
				<view class="panel-body">
					<!-- panel 的 item 项 -->
					<view class="panel-item">
						<text>0</text>
						<text>收藏</text>
					</view>
					<view class="" style="font-size: 60rpx;color: gray;margin-top: 20rpx;">
						|
					</view>
					<!-- <view class="panel-item">
						<text>0</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>0</text>
						<text>关注的商品</text>
					</view> -->
					<view class="panel-item">
						<text>0</text>
						<text>足迹</text>
					</view>
				</view>
			</view>

			<!-- 第二个面板 -->
			<view class="panel">
				<!-- 面板的标题 -->
				<view class="panel-title" data-index="0" @click="gotoMyOrder">
					<text>全部订单</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<!-- 面板的主体 -->
				<view class="panel-body">
					<!-- 面板主体中的 item 项 -->
					<view class="panel-item" data-index="1" @click="gotoMyOrder">
						<image src="/static/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item" data-index="2" @click="gotoMyOrder">
						<image src="/static/my-icons/icon2.png" class="icon"></image>
						<text>待发货</text>
					</view>
					<view class="panel-item" data-index="3" @click="gotoMyOrder">
						<image src="/static/my-icons/icon3.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item" data-index="4" @click="gotoMyOrder">
						<image src="/static/my-icons/icon4.png" class="icon"></image>
						<text>已签收</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->

			<view class="panel">
				<view class="panel-list-item" @click="gotoAddressInfo">
					<view class="">
						<uni-icons type="location" size="18" color="deeppink"></uni-icons>
						<text style="margin-left: 5px;">收货地址</text>
					</view>
					<uni-icons type="arrowright" size="15"></uni-icons>

				</view>
				<view class="panel-list-item">
					<view class="">
						<uni-icons type="staff" size="18" color="#39b0ff"></uni-icons>
						<text style="margin-left: 5px;">联系客服</text>
					</view>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item" @click="loginout">
					<view class="" >
						<uni-icons type="minus" size="18" color="#ffd7bc"></uni-icons>
						<text style="margin-left: 5px;">退出登录</text>
					</view>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	// 按需导入 mapState 辅助函数
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: "my-userinfo",
		data() {
			return {
				clickItem: '',
			};
		},
		computed: {
			...mapState('m_user',['userinfo'])
		},
		methods: {
			...mapMutations('m_user',['updateToken']),
			//转到我的订单
			gotoMyOrder(e) {
				// console.log(e.currentTarget.dataset.index)
				uni.navigateTo({
					url: '/subpkg/my_order/my_order?index=' + e.currentTarget.dataset.index
				})
			},
			//转到选择地址界面
			gotoAddressInfo() {
				uni.navigateTo({
					url: '/subpkg/address_info/address_info'
				})
			},
			loginout() {
				uni.showModal({
					title: '提示',
					content: '是否退出登录',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.updateToken('')
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.my-userinfo {
		.my-userinfo-container {
			height: 100%;
			// 为整个组件的结构添加浅灰色的背景
			background-color: #f4f4f4;

			.top-box {
				height: 300rpx;
				background: linear-gradient(to right, #ff2266, #e14336);
				padding: 0 20px;
				display: flex;
				// flex-direction: column;
				align-items: center;
				justify-content: space-between;
				border-radius: 0 0 5px 5px;

				.name-id {

					text {
						display: block;
					}
				}

				.avatar {
					display: block;
					width: 60px;
					height: 60px;
					border-radius: 45px;
					border: 2px solid white;
					box-shadow: 0 1px 5px black;
				}

			}
		}

		.panel-list {
			padding: 0 10px;
			position: relative;
			top: -10px;

			.panel {
				background-color: white;
				border-radius: 3px;
				margin-bottom: 8px;

				.panel-title {
					line-height: 45px;
					padding-left: 10px;
					font-size: 15px;
					border-bottom: 1px solid #f4f4f4;

					display: flex;
					justify-content: space-between;
				}


				.panel-body {
					display: flex;
					justify-content: space-around;

					.panel-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
						font-size: 13px;
						padding: 10px 0;

						.icon {
							width: 35px;
							height: 35px;
						}
					}
				}

				.panel-list-item {
					height: 45px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 15px;
					padding: 0 10px;
					border-bottom: 1px solid #e8e8e8;
				}
			}
		}
	}
</style>
