<template>
	<view class="settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio color="#ff2266" :checked="isFullCheck" style="zoom: 80%;"/><text>全选</text>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex'
	
	export default {
		name: "my-settle",
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			isFullCheck(){
				return this.total === this.checkedCount
			}
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			changeAllState(){
				// console.log(!this.isFullCheck)
				this.updateAllGoodsState(!this.isFullCheck)
			}
		}
	}
</script>

<style lang="scss">
	.settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 50px;
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #ff3c62;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #ff2d5c;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
