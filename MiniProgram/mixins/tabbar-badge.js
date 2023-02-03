import {
	mapGetters
} from 'vuex'

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	watch: {
		total(newVal) {
			if (newVal == 0) {
				console.log("+", newVal)
				uni.removeTabBarBadge({
					index: 2,
				})
				uni.hideTabBarRedDot({ //隐藏红点
					index: 2
				})

			} else {
				this.setBadge()
			}
		}
	},
	onShow() {
		//在页面刚显示时会执行
		// console.log(this.total)
		if (this.total !== 0) {
			this.setBadge()
		}
	},
	methods: {
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				//text只能是字符串不能是数字，所以加上''变为字符串
				text: this.total + ''
			})
		}
	}
}
