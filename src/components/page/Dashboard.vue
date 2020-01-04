<template>
	<div>
		<el-backtop target="" :bottom="100">
			<div style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }">UP</div>
		</el-backtop>
		<el-row :gutter="20">
			<el-col :span="24">
				<el-card shadow="hover" class="mgb20" style="height:252px; text-align: center;">
					<div class="user-info">
						<img src="../../assets/img/Crm.png" class="user-avator" alt="">
						<div class="user-info-cont">
							<div class="user-info-name">{{name}}</div>
							<div>{{role}}</div>
						</div>
					</div>
					<div class="user-info-list">上次登录时间：<span>2020-01-05</span></div>
					<div class="user-info-list">上次登录地点：<span>湖南省长沙市</span></div>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="24">
				<el-carousel :interval="4000" type="card" height="400px">
					<el-carousel-item v-for="item in 5" :key="item">
						<h3 class="medium">{{ item }}</h3>
					</el-carousel-item>
				</el-carousel>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import Schart from 'vue-schart';
	import bus from '../common/bus';
	export default {
		name: 'dashboard',
		data() {
			return {
				name: this.$store.state.UserName,
			}
		},
		components: {
			Schart
		},
		computed: {
			role() {
				if (this.name === 'admin') {
					return '平台管理员'
				} else if(this.name === 'vip'){
					return 'VIP'
				}else {
					return '员工'
				}
			}
		},
		methods: {
			toCIS: function() {
				if(this.name == null){
					this.$router.push('/login');
				}
			}
		},
		created: function() {
				this.toCIS();
		}
	}
</script>


<style scoped>
	.el-carousel__item h3 {
		color: #475669;
		opacity: 0.75;
		line-height: 70px;
		margin: 0;
	}
	.el-carousel__item:nth-child(2n) {
		background-image: url(../../assets/img/2.jpg);
	}

	.el-carousel__item:nth-child(2n+1) {
		background-image: url(../../assets/img/3.jpg);
	}
	.el-carousel__item:nth-child(3n) {
		background-image: url(../../assets/img/4.jpg);
	}
	.el-carousel__item:nth-child(4n) {
		background-image: url(../../assets/img/1.jpg);
	}
	.el-carousel__item:nth-child(5n) {
		background-image: url(../../assets/img/5.jpg);
	}

	.el-row {
		margin-bottom: 30px;
	}

	.grid-content {
		display: flex;
		align-items: center;
		height: 100px;
	}

	.grid-cont-right {
		text-align: center;
		font-size: 14px;
		color: #999;
	}

	.grid-num {
		font-size: 30px;
		font-weight: bold;
	}

	.grid-con-icon {
		font-size: 50px;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: #fff;
	}

	.grid-con-1 .grid-con-icon {
		background: rgb(45, 140, 240);
	}

	.grid-con-1 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-2 .grid-con-icon {
		background: rgb(100, 213, 114);
	}

	.grid-con-2 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-3 .grid-con-icon {
		background: rgb(242, 94, 67);
	}

	.grid-con-3 .grid-num {
		color: rgb(242, 94, 67);
	}

	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}

	.user-avator {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}

	.user-info-cont {
		padding-right: 120px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}

	.user-info-cont div:first-child {
		font-size: 30px;
		color: #222;
	}

	.user-info-list {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}

	.user-info-list span {
		margin-left: 50px;
	}

	.mgb20 {
		margin-bottom: 20px;
	}

	.todo-item {
		font-size: 14px;
	}

	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}

	.schart {
		width: 100%;
		height: 300px;
	}
</style>
