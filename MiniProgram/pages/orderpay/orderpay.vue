<template>
	<view class="pay-container">
		<!-- 顶部图片 -->
		<view class="pay-title">
			<image src="../../static/order_title.png" mode="widthFix" style="position: relative; left: -1px;"></image>
		</view>

		<my-address></my-address>

		<view class="goods-list">
			<view class="goods-item">

			</view>
		</view>

		<view class="order-info">
			<view class="">
				<text>商品总价</text>
				<text>￥99.6</text>
			</view>
			<view class="">
				<text>运费</text>
				<text>免运费</text>
			</view>
			<view class="">
				<text>支付方式</text>
				<text>微信支付</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: [],
			};
		},
		onLoad(options) {
			//接收传入的商品数组
			if (options.goods) {
				this.goods = JSON.parse(decodeURIComponent(options.goods))
				// console.log(this.goods)
			}


		}
	}
</script>

<style lang="scss">
	.pay-container {
		
		.pay-title {
			position: sticky;
			top: 0;
			background-color: #ffffff;
		}

		.goods-list {
			width: 310px;
			height: 300px;
			margin: 0 5px 0 5px;
			background-color: #ffffff;
			border-radius: 10px;

			.goods-item {
				width: 100%;
				height: 120px;
				// background-color: red;

			}

		}

		.order-info {}
	}
</style>
