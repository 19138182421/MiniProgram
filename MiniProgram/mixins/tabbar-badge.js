import {
	mapGetters
} from 'vuex'

export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		//在页面刚显示时会执行
		this.setBadge()
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
