<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: "my-login",
		data() {
			return {
				userInfo: {},
			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo']),
		},
		methods: {

			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

			// 获取微信用户的基本信息
			getUserInfo(e) {
				//小程序不通过微信验证，无法获取到用户信息！！！
				//用自定义的信息来模拟
				this.userInfo = {
					userName: "杨亚威",
					petName: '那年夏天',
					userPhone: '19138182421'
				}

				//存入用户信息
				this.updateUserInfo(this.userInfo)
				//获取token
				this.getToken()
			},
			async getToken() {
				const {
					data: res
				} = await uni.$http.post('/userLogin', this.userInfo)
				if (res.meta.status !== 200) return uni.$showMsg('登录失败！')
				console.log(res)
				uni.$showMsg('登录成功')

				//存入vuex，并持续化存储，方便退出登录时删除信息
				this.updateToken(res.message.data.token)
				//更新userInfo，存入用户id
				this.updateUserInfo(res.message.data.User)

				this.navigateBack()

			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'navigateTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.navigateTo({ 
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background: linear-gradient(to right, #FC466B, #3F5EFB);
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
