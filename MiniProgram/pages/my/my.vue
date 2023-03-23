<template>
	<view class="my-container">
		<!-- 用户未登录时，显示登录组件 -->
		<my-login v-if="!token"></my-login>

		<!-- 用户登录后，显示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>

</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {mapState} from 'vuex'

	export default {
		mixins: [badgeMix],
		data() {
			return {
				
			};
		},
		onLoad() {
		},
		computed: {
			// token 是用户登录成功之后的 token 字符串
			...mapState('m_user', ['userinfo','token']),
		}
	}
</script>

<style lang="scss">
	page,
	.my-container {
		height: 100%;
	}
</style>
