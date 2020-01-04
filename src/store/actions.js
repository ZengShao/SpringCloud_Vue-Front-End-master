//链接后台执行异步操作

export default {
	doLogin: function(context, payload) {
			//        setTimeout(() => {
			//          context.commit('setResturantName', payload);//Action提交的是mutation
			//        }, 3000);
			//      }
			var _this = payload._this;
			let url = _this.axios.urls.SYS_USER_DOLOGIN;
				_this.axios.post(url, _this.form).then(resp => {
					context.commit('setUserName',{'UserName':_this.form.userName});
					context.commit('setadminId',{'id':resp.data.id});
					localStorage.setItem('ms_username', _this.form.userName);
					if (resp.data.code === 0) {
						_this.$router.push('/');
						_this.$message({
							message: '登录成功',
							type: 'success'
						});
					} else {
						_this.$message.error('用户名或密码错误');
					}
				}).catch((response) => {
					console.log(response);
				});

		},

}
