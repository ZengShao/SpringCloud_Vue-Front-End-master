<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 用户功能管理
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.customerName" placeholder="用户姓名" class="handle-input mr10"
						  style="margin-left:100px "></el-input>
				<el-button type="primary" icon="el-icon-search" @click="list()">搜索</el-button>
			</div>
			<el-table
					:data="tableData"
					border
					class="table"
					ref="multipleTable"
					v-loading="fullscreenLoading"
					header-cell-class-name="table-header"
			>
				<el-table-column prop="uid" label="用户编号"></el-table-column>
				<el-table-column label="用户身份">
					<template slot-scope="scope">{{scope.row.name}}</template>
				</el-table-column>
				<el-table-column label="用户账号" align="center">
					<template slot-scope="scope">{{scope.row.username}}</template>
				</el-table-column>
				<el-table-column label="用户状态" align="center">
					<template slot-scope="scope">
<!--						<el-switch v-if = "scope.row.state === true" @click.native = SetCustomerStatus(scope.row) v-model="scope.row.state" active-text="禁用" inactive-text="开启"></el-switch>-->
<!--						<el-switch v-else 	 @click.native = SetCustomerStatus(scope.row) v-model="scope.row.state" active-text="开启" inactive-text="禁用"></el-switch>-->
<!--						<el-switch @click.native = SetCustomerStatus(scope.row) v-model="scope.row.state" ></el-switch>-->

						<toggle-button
								v-if="scope.row.state == 'false'"
								:value="false"
								@change="SetCustomerStatus(scope.row)"
								:labels="{checked: '开启', unchecked: '禁用'}"/>
						<toggle-button
								v-if="scope.row.state == 'true'"
								:value="true"
								@change="SetCustomerStatus(scope.row)"
								:labels="{checked: '开启', unchecked: '禁用'}"/>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template slot-scope="scope">
					<el-button type="primary" @click="menu(scope.row),dialogVisible = true" plain>设置权限</el-button>
				</template>
				</el-table-column>
<!--				<el-table-column label="导出信息" width="180" align="center">-->
<!--						<download-excel class="el-icon-download" type="button" :data="tableData" :fields="json_fields" name="用户信息.xls"></download-excel>-->
<!--				</el-table-column>-->
			</el-table>

			<el-dialog
					title="授权菜单"
					:visible.sync="dialogVisible"
					width="50%"
					:before-close="handleClose">

				<div style="height: 30vh;">
					<!-- 注意需要给 el-scrollbar 设置高度，判断是否滚动是看它的height判断的 -->
					<el-scrollbar style="height: 100%;"> <!-- 滚动条 -->
						<el-tree
								style="height: 70px"
								:data="data"
								show-checkbox
								default-expand-all
								node-key="id"
								ref="tree"
								:default-expand-all="false"
								:default-checked-keys="this.Arr"
								highlight-current
								:props="defaultProps">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								      <i :class="data.icon"></i>
      						<span style="padding-left: 50px;">{{node.label}}</span>
                        <span>
                                <el-tag v-if="data.parentId == '1'" type="success" style="margin-left: 70px;">目录</el-tag>
							<el-tag v-else-if="data.parentId == '2'" type="warning" style="margin-left: 70px;">菜单</el-tag>
							<el-tag v-else-if="data.parentId == '3'" type="info" style="margin-left: 70px;">按钮</el-tag>
                        </span>
								<span>
									<el-tag style="margin-left: 100px;">权限：{{data.permission}}</el-tag>
                        </span>
								<span>
									<el-tag v-if="data.url != ''" type="info" style="margin-left: 120px;">路径：{{data.url}}</el-tag>
									<el-tag v-else-if="data.url == '' || data.url == null " type="info" style="margin-left: 120px;">暂无</el-tag>
                        </span>
                			</span>
						</el-tree>
					</el-scrollbar><!-- /滚动条 -->
				</div>

				<span slot="footer" class="dialog-footer">
<!--					 <el-button @click="resetChecked">清空</el-button>-->
   					 <el-button @click="resetChecked1()">取 消</el-button>
   					 <el-button type="primary" @click="Updata()">确 定</el-button>
  				</span>
			</el-dialog>

			<!--分页-->
			<div class="pagination">
				<el-pagination style="margin-top: 20px;" @size-change="handleSizeChange"
							   @current-change="handleCurrentChange"
							   :current-page="query.page" :page-sizes="[3, 5, 10, 20]" :page-size="query.rows"
							   layout=" sizes, prev, pager, next, jumper"
							   :total="query.total">
				</el-pagination>
			</div>
		</div>

	</div>
</template>

<script>
	import M from 'minimatch';

	export default {
		name: 'basetable',
		data() {
			return {
				data: [],
				data1:{},
				Arr:[],
				ArrRole:[],
				rid:null,
				defaultProps: {
					children: 'children',
					label: 'name',
					icon:'icon',
				},
				dialogVisible:false,
				json_fields: {
					'用户ID': 'customerId',    //常规字段
					'用户真实姓名': 'customerName',
					'身份证号码':'customerIdNumber',
					'手机号':'customerTel',
					'用户地址':'customerAddress',
					'用户银行卡号':'customerBank',
					'用户创建日期':'customerTime'
				},
				json_meta: [
					[
						{
							' key ': ' charset',
							' value ': ' utf-8 '
						}
					]
				],
				fullscreenLoading: false,
				downloadLoading: false,
				autoWidth: true,
				query: {
					page: 1,
					total: 10,
					rows: 5,
					id:null
				},
				tableData: [],
				multipleSelection: [],
				delList: [],
				editVisible: false,
				pageTotal: 0,
				form: {},
				idx: -1,
				id: -1
			};
		},
		methods: {
			Updata(){
				var a;
				var b;
				var keys=this.$refs.tree.getCheckedKeys();
				a =keys.join("-")
				var hkeys= this.$refs.tree.getHalfCheckedKeys();
				b =hkeys.join("-");
				var xuanz = keys+","+hkeys;
				var xuan;
				xuan =this.Arr
				console.log(keys)
				this.$confirm('确定要修改此用户权限?, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let url = this.axios.urls.SYS_UPDATA_PERMISSISON;
					this.axios.post(url, {
						ac:xuanz,
						li:JSON.stringify(xuan),
						id:this.ArrRole.id
					}).then(resp => {
						if (resp.data.code === 1){
							this.list();
							this.Arr.splice(0,this.Arr.length)
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							});
						}
						if (resp.data.code === -1){
							this.list();
							this.Arr.splice(0,this.Arr.length)
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							});
						}
					}).catch((response) => {

					});
				}).catch(() => {
					this.list();
					this.Arr.splice(0,this.Arr.length)
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},

			menu(row){
				this.menu1(row);
				let url = this.axios.urls.SYS_MENU;
				this.axios.post(url, {
					// uid:row.uid
				}).then(resp => {
					this.data = resp.data.result;
				}).catch((response) => {
					console.log(response);
				});

					let url1 = this.axios.urls.SYS_SELECTROLE;
					this.axios.post(url1,{
						uid:row.uid
					}).then(resp => {

						for (var i = 0; i < resp.data.result.length; i++) {
							this.ArrRole = resp.data.result[i];
						}
					}).catch((response) => {
						console.log(response);
					});

			},

			menu1(row){
				let url = this.axios.urls.SYS_LISTMENU;
				this.axios.post(url, {
					uid:row.uid
				}).then(resp => {
					console.log(resp)
					for (var i = 0; i < resp.data.result.length; i++) {
						this.Arr.push(resp.data.result[i].id);
					}
					console.log(this.Arr)

				}).catch((response) => {
					console.log(response);
				});

			},
			resetChecked() {
				this.$refs.tree.setCheckedKeys([]);
				this.Arr.splice(0,this.Arr.length)
			},
			resetChecked1() {
				this.dialogVisible = false;
				this.Arr.splice(0,this.Arr.length)
				this.$refs.tree.setCheckedKeys([]);
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
						.then(_ => {
							done();
							this.resetChecked();
							this.list();
						})
						.catch(_ => {});
			},
			SetCustomerStatus(row) {
				this.$confirm('确定要修改此用户状态?, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					if (row.state==false){
						row.state=true
					}else if (row.state==true){
						row.state=false
					}else {
						row.state = row.state?row.state !== 'true':'false'
					}
					let url = this.axios.urls.SYS_MODIFY_USER_STATUS;
					this.axios.post(url, {
							uid: row.uid,
							state: row.state?row.state !== 'true':'false'

					}).then(resp => {
						if (resp.data.code === 0){
							this.list();
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success'
							});
						}else if (resp.data.code === -1){
							this.list();
							this.$notify({
								title: '失败',
								message: '修改失败',
								type: 'success'
							});
						}
						else if (resp.data.code === 403){
							this.list();
							this.$notify({
								title: '失败',
								message: '您暂无该权限'
							});
						}
					}).catch((response) => {

					});

				}).catch(() => {
					this.list();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
				// 点击导出word
			exportWord: function() {
				let _this = this;
				// 读取并获得模板文件的二进制内容
				JSZipUtils.getBinaryContent("input1.docx", function(error, content) {
					// input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
					// 抛出异常
					if (error) {
						throw error;
					}

					// 创建一个JSZip实例，内容为模板的内容
					let zip = new JSZip(content);
					// 创建并加载docxtemplater实例对象
					let doc = new window.docxtemplater().loadZip(zip);
					// 设置模板变量的值
					doc.setData({
						..._this.form,
						table: _this.tableData
					});

					try {
						// 用模板变量的值替换所有模板变量
						doc.render();
					} catch (error) {
						// 抛出异常
						let e = {
							message: error.message,
							name: error.name,
							stack: error.stack,
							properties: error.properties
						};
						console.log(JSON.stringify({ error: e }));
						throw error;
					}

					// 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
					let out = doc.getZip().generate({
						type: "blob",
						mimeType:
								"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
					});
					// 将目标文件对象保存为目标类型的文件，并命名
					saveAs(out, "用户详细信息.docx");
				});
			},


			formartDate(param) {
				let date = new Date(param);
				var Y = date.getFullYear() + '-';
				var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
				var D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
				var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
				var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			},



			list: function() {
				this.fullscreenLoading = true;
				this.dialogVisible = false
				setTimeout(() => {
					this.fullscreenLoading = false;
					let url = this.axios.urls.SYS_USER_MANAGEMENT;
					this.axios.post(url, this.query).then(resp => {

						console.log(resp.data.result);

						this.form.dictItem = resp.data.result.dictItem;
						this.form.dictValue = resp.data.result.dictValue;

						this.query.name = null;

						this.tableData = this.json_data;

						this.tableData = resp.data.result;

						this.query.page = resp.data.page;
						this.query.total = resp.data.total;
						this.query.rows = resp.data.rows;

					}).catch((response) => {
						console.log(response);
					});
				}, 500);

			},
			// 编辑操作
			handleEdit(index, row) {
				this.idx = index;
				this.form = row;
				this.editVisible = true;
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, 'pageIndex', val);
				this.getData();
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				console.log(`当前` + this.query.total);
				this.query.page = val;
				this.list();
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.query.rows = val;
				this.query.page = 1;
				this.list();
			}
		},
		created: function() {

			this.fullscreenLoading = true;
			setTimeout(() => {
				this.fullscreenLoading = false;
				this.list();
				this.menu1();
				this.SelectRole();
			}, 500);


		}
	};
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}


	.mr10 {
		margin-right: 10px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}
</style>
