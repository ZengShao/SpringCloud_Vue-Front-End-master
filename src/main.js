import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import './assets/icon/iconfont.css'
import { messages } from './components/common/i18n';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import axios from '@/api/http'

import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import axios1 from 'axios'

axios1.defaults.withCredentials=true;//让ajax携带cookie

Vue.prototype.$axios = axios1;

import store from './store'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import Blob from '@/vendor/Blob.js'
import Export2Excel from '@/vendor/Export2Excel.js'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'


import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

window.vm =new Vue({
    router,
    i18n,
	store,
    render: h => h(App),
	data: {
		//自定义的事件总线对象，用于父子组件的通信
		Bus: new Vue()
	}
}).$mount('#app');
