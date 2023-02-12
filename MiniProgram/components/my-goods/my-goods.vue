<template>
	<view class="goods-item" >
		<!-- 商品左侧图片区域 -->
		<view class="goods-item-left">
			<radio :checked='goods.goods_state' color="deeppink" class="item-radio" @click="radioClickHandler"></radio>
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic" @click="gotoGoodDetail"></image>
		</view>
		<!-- 商品右侧信息区域 -->
		<view class="goods-item-right" >
			<!-- 商品标题 -->
			<view class="goods-name" @click="gotoGoodDetail">{{goods.goods_name}}
				<view class="goods-tp">{{goods.goods_tp}}</view>
			</view>
			
			<view class="goods-info-box">
				<!-- 商品价格 -->
				<view class="goods-price">￥{{goods.goods_price}}</view>

				<!-- 商品的数量 -->
				<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			// 商品的信息对象
			goods: {
				type: Object,
				default: {},
			},
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
		methods: {
			gotoGoodDetail(){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?good_id=' + this.goods.goods_id + '&cat_id=' + this.goods.cat_two_id
				})
			},
			//radio点击事件
			radioClickHandler() {
				//子传父数据，通过emit发射  【被监听的事件名】  与  【数据】
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_tp:this.goods.goods_tp,
					goods_state: !this.goods.goods_state
				})
			},
			//数量修改事件
			numChangeHandler(val){
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_tp:this.goods.goods_tp,
					//当传入的不是数值时，可以使用加号用来把字符串转为数字
					goods_count: +val
				})
				// console.log(123)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		margin-bottom: 5px;
		border-bottom: 1px solid #f0f0f0;
		border-radius: 10px;
		background-color: #ffffff;

		.goods-item-left {
			margin-right: 8px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item-radio {
				zoom: 60%;
			}

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
				border-radius: 10px;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-tp{
				margin-top: 20rpx;
				font-size: 30rpx;
				color: #989898; 
			}
			
			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.goods-price {
					font-size: 16px;
					color: #fb3b60;
				}
			}

		}
	}
</style>
