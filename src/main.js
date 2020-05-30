import Vue from 'vue';
import App from './App';
import axios from 'axios';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 变成蓝色样式
Vue.config.productionTip = false;

// 将axios添加至Vue的原型中
axios.defaults.baseURL = '/api';
Vue.prototype.axios = axios;
Vue.use(ElementUI);
new Vue({
	el : '#appIndex'
	,render : h => h(App)
});
