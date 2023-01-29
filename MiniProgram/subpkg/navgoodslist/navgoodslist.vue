<template>
	<view>
		主页导航跳转过来的
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad(options) {
			const myData = JSON.parse(decodeURIComponent(options.data))
			console.log(myData)
			uni.setNavigationBarTitle({
			    title: myData.cat_name
			});
		
		}
	}
</script>

<style lang="scss">

</style>
