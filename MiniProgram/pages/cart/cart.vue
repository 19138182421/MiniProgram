<template>
	<view class="cart-container">
		<view class="cart-title" style="position: sticky; top: 0;">
			<image src="http://localhost:8080/upload/cart/title.png" mode="widthFix"></image>
		</view>
		
		<view class="cart-content">
			<!-- 无数据时显示图片 -->
			<view class="" v-if="cartList.length === 0">
				<image src="http://localhost:8080/upload/cart/kong.png" mode="widthFix"></image>
				<!-- 去逛逛按   钮 -->
				<view class=""
					style="border:1px solid red;color: red;margin: auto;width: 50px;padding: 10px 30px;border-radius: 20px;" 
					@click="gotoHome"
					>
					<text>去逛逛 </text>
				</view>
			</view>
			
			<view class="cart-List" style="width: 100%; height: 100px; background-color: aqua;" v-else>
				
			</view>
			
		</view>
		
		<!-- 为你推荐 -->
		<view class="cart-suggest" style="width: 100%; height: 800px; background-color: pink; margin-top: 30px;">
			
		</view>
		
		
		<!-- 结算 -->
		<view class="cart-pay" >
			
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				cartList:[],
			};
		},
		methods:{
			//去逛逛
			gotoHome(){
				uni.switchTab({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss">
	.cart-container {
		// position: relative;
		
		.cart-title {}

		.cart-content {}
		
		.cart-suggest{}
		
		.cart-pay{
			width: 100%;
			height:70px;
			position: fixed;
			top: 390px;
			background-color: #ffffff;
		}
	}
</style>
