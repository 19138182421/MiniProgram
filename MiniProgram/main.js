
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 导入网络请求包escook
import { $http } from '@escook/request-miniprogram'
//挂载$http到uni全局对象上
uni.$http = $http
//配置根路径
$http.baseUrl = 'http://localhost:8080'

//配置拦截器
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}

//封装数据请求失败的弹框方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif