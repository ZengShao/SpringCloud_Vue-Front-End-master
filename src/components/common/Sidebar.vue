<script src="../../router/index.js"></script>
<template>
	<div class="sidebar">
		<el-menu router class="sidebar-el-menu" :default-active="$route.path" :collapse="collapse" background-color="#FFFFFF"
		 text-color="#000000" active-text-color="#07C4A8" unique-opened :collapse-transition="bb">

			<el-submenu v-for="n1 in treeNodelIST" :index="'index-'+n1.id" :key="'key-'+n1.id">
				<template slot="title">
					<i :class="n1.icon" style="margin-right: 10px"></i>
					<span>{{n1.name}}</span>
				</template>
				<el-menu-item v-for="n2 in n1.children" :key="'key-'+n2.id" :index="n2.url">
					<i :class="n2.icon"></i>
					<span>{{n2.name}}</span>
				</el-menu-item>

			</el-submenu>
		</el-menu>

	</div>
</template>

<script>
	import bus from '../common/bus';
	export default {
		data() {
			return {
				collapsed: false,
				bb: true,
				treeNodelIST: [],
				collapse: false,
			}
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			},
		},
		created() {
			// 通过 Event Bus 进行组件间通信，来折叠侧边栏
			bus.$on('collapse', msg => {
				this.collapse = msg;
			})
		},
		beforeCreate: function() {
			//加载后台菜单数据
			let url = this.axios.urls.SYS_TREENODE_LISTALL;
			this.axios.post(url).then(resp => {
				this.treeNodelIST = resp.data.result;
			}).catch((response) => {
				console.log(response);
			})
			this.$root.Bus.$on("aside-togger", (a, b, c) => {
				this.collapsed = a;
			});
		}
	}
</script>
<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;
	}

	.sidebar::-webkit-scrollbar {
		width: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;
	}

	.sidebar>ul {
		height: 100%;
	}
</style>
