<template>
	<view class="region-box">
		<picker-view :value="region" @change="bindChange">
			<picker-view-column>
				<view class="center" v-for="(item, index) in regionList" :key="index">
					{{ item.name }}
				</view>
			</picker-view-column>
			<picker-view-column v-if="regionList[region[0]]">
				<view class="center" v-for="(item, index) in regionList[region[0]].cityList" :key="index">
					{{ item.name }}
				</view>
			</picker-view-column>
			<picker-view-column v-if="regionList[region[0]]">
				<view class="center" v-for="(item, index) in regionList[region[0]].cityList[region[1]].areaList"
					:key="index">
					{{ item.name }}
				</view>
			</picker-view-column>
		</picker-view>

		<view style="width: 100%;" class="btn-Block center">
			<view class="btn-left center" @click="onCancel">取消</view>
			<view class="btn-right center" @click="onSubmit">
				确定
			</view>
		</view>

	</view>
</template>

<script>
	import data from '@/store/region.js' //引入的省市区静态数据文件

	export default {
		name: "my-picker",
		created() {
			// console.log(data)
			this.regionList = data
			// console.log(this.regionList[0])
			// console.log(this.regionList.length)
		},
		data() {
			return {
				region: [0, 0, 0], //地址每列的index
				regionList: [], //地址数据，格式为 三级地址全返回
				regionText: ''
			};
		},
		methods: {
			//选择值改变事件
			bindChange(e) {
				// 用于对比滑动的是哪一列数据
				const val = e.detail.value
				// console.log(val)
				if (this.region[0] !== val[0]) {
					// 如果滑动的是第一列数据，让二三列恢复到0
					this.region = [val[0], 0, 0]
				} else if (this.region[1] !== val[1]) {
					// 滑动的是第二列数据
					this.region = [val[0], val[1], 0]
				} else {
					this.region = e.detail.value;
				}
				// const val = e.detail.value
				// this.year = this.years[val[0]]
				// this.month = this.months[val[1]]
				// this.day = this.days[val[2]]
			},
			//确定按钮操作
			onSubmit: function() {
				// console.log(123)
				this.regionText = `${this.regionList[this.region[0]].name}-${this.regionList[this.region[0]].cityList[this.region[1]].name}-${this.regionList[this.region[0]].cityList[this.region[1]].areaList[this.region[2]].name}`
				// console.log(this.regionText)
				this.$emit("choosePicker",this.regionText)
			},
			onCancel() {
				// 调用父组件方法关闭
				// this.$emit('onCancel')
			}
		}
	}
</script>

<style lang="scss">
	.region-box {
		background-color: #FFFFFF;

		.center {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.btn-Block {
			width: 100%;
			background-color: #FFFFFF;
			padding: 25upx;
			height: 230upx;

			.btn-left {
				width: 250upx;
				height: 80upx;
				border-radius: 10upx;
				color: #289CFD;
				background-color: rgba(153, 153, 153, 0.2);
				margin-right: 150upx;
			}

			.btn-right {
				width: 250upx;
				height: 80upx;
				border-radius: 10upx;
				color: #FFFFFF;
				background-color: #289CFD;
			}
		}

		.picker-view {
			background-color: #FFFEFD;
		}

		picker-view {
			width: 100%;
			height: 600upx;
		}
	}
</style>
