// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);
import axios from 'axios'
import store from './store'
import getUrl from '@/assets/js/getUrl.js';
import '@/assets/css/font_a2eluq0ymij/iconfont.css';
import $ from 'jquery'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts 
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
/* eslint-disable no-new */

axios.interceptors.request.use(function(config){
	//请求开始
	store.dispatch('show')
    return config
},function(err){
    return Promise.reject(err)
});
axios.interceptors.response.use(function(response){
	//请求结束
	let timer=null;
	timer=setInterval(()=>{
		clearInterval(timer)
		store.dispatch('show')
	},200)
	
    return response
},function(err){
    return Promise.reject(err)
});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
