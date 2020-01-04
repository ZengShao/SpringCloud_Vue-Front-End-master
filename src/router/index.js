import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
				{
					path: '/ContractManagement',
					component: () => import(/* webpackChunkName: "table" */ '../components/page/ContractManagement.vue'),
					meta: { title: '公共账号管理'},
				},
				{
					path: '/UserList',
					component: () => import(/* webpackChunkName: "table" */ '../components/page/UserList.vue'),
					meta: { title: '用户功能列表'}
				},
				{
					path: '/ProductManagement',
					component: () => import(/* webpackChunkName: "table" */ '../components/page/ProductManagement.vue'),
					meta: { title: '关键字管理' ,permission: true}
				},
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录'}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
