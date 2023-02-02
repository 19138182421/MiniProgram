<template>
	<view class="address">
		<view class="address-item">
			<!-- 顶部边框线 -->
			<view class="address-image">
				<!-- <image src="../../static/fenge.png" mode="widthFix" style="position: relative; right: -1px;"></image> -->
			</view>

			<view class="address-info">

			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "my-address",
		data() {
			return {};
		},
	}
</script>

<style lang="scss">
	.address {
		.address-item {
			width: 310px;
			
			.address-image{
				width: 100%;
				height: 10px;
				background: url("../../static/fenge.png");
			}

			.address-info {
				width: 100%;
				height: 120px;
				margin: 0 5px 5px 5px;
				background-color: #ffffff;
				border-radius: 10px;

			}
		}
	}
</style>
