<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="form" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="adminName">
					<el-input v-model="form.userName" placeholder="adminName">
						<el-button slot="prepend" icon="el-icon-lx-people"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item prop="adminPassword">
					<el-input type="Password" placeholder="adminPassword" v-model="form.password">
						<el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm()" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data: function() {
			return {
				fullscreenLoading: false,
				form: {
					userName: null,
					password: null,
					id: null,
					jwt: 888888
				},
				rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
				},
			};
		},
		methods: {
			submitForm() {
				this.fullscreenLoading = true;
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.$store.dispatch('doLogin', {
						setUserName: this.form.userName,
						setadminId: this.form.id,
						_this: this,
						xhrFields: {
							withCredentials: true
						},
					});
					console.log(this.form.userName);
				}, 1000);
			},

		},
	};
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../../assets/img/1.jpg);
		background-size: 100%;
	}

	.ms-title {
		width: 100%;
		line-height: 100px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -180px 0 0 -185px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.ms-content {
		padding: 100px 50px;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 30px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
	}
</style>
