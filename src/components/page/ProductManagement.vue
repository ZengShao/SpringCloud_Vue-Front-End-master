<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 关键字管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.proName" placeholder="产品名" class="handle-input mr10"
                          style="margin-left:100px "></el-input>
                <el-button type="primary" icon="el-icon-search" @click="list()">搜索</el-button>
            </div>

            <el-button style="margin-left: 20px" class="el-icon-plus" type="warning" @click=handleEdit1()  plain>增加产品</el-button>



            <el-row>
                <el-col :span="6"  v-for="(sublist, index) in tableData">
                    <el-card :body-style="{ padding: '10px' }"  shadow="hover" style="margin-left: 20px;margin-top: 20px">
                        <img :src="form[index].proPhoto" class="image">
                        <div style="padding: 14px;">
                            <span>{{form[index].proName}}</span>
                                <div class="bottom clearfix">
                                <span class="time">{{form[index].proContent}}</span>
                                    <el-button style="margin-left: 10px" type="success"  @click=handleEdit(index) round>操作</el-button>
                                    <el-button type="warning"  @click=del(form[index]) round>删除</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <!--分页-->
            <div class="pagination">
                <el-pagination style="margin-top: 20px;" @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="query.page" :page-sizes="[2, 4, 8]" :page-size="query.rows"
                               layout=" sizes, prev, pager, next, jumper"
                               :total="query.total">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="form1.proName" :visible.sync="editVisible" width="50%"  >
            <el-card :visible.sync="editVisible" :model="form1" class="box-card"  label-width="80px">
                <div slot="header" class="clearfix">
                    产品编号：<span style="margin-top: 20px">{{form1.proId}}</span><br>
                </div>
                产品名称：<el-input v-model="form1.proName" class="mr10" style="margin-top: 10px;width: 300px">
                </el-input>
                <br>
                产品期数：  <el-select v-model="form1.proPeriods" placeholder="请选择" style="margin-top: 20px"><br>
                <el-option label="3" value="3"></el-option>
                <el-option label="6" value="6"></el-option>
                <el-option label="9" value="9"></el-option>
                <el-option label="12" value="12"></el-option>
                <el-option label="24" value="24"></el-option>
                <el-option label="36" value="36"></el-option>
            </el-select><br>

                产品额度：<el-input-number v-model="form1.proMoney" @change="handleChange" :min="1" :max="10000000" label="产品额度" style="margin-top: 20px"></el-input-number><br>
                产品介绍：<el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="form1.proContent" style="width: 90%;padding-top: 20px"></el-input>
                <el-button @click="qx()" style="margin-left: 700px;margin-top: 20px">取消</el-button> <el-button type="primary" @click="SetCustomerStatus(form1)">确定</el-button>
            </el-card>
        </el-dialog>

        <!-- 增加弹出框 -->
        <el-dialog :visible.sync="editVisible1" width="50%">
            <el-card :visible.sync="editVisible1" :model="form2" class="box-card">
                产品名称：<el-input v-model="form2.proName" placeholder="" class="handle-input mr10" style="margin-top: 10px"></el-input><br>
                产品期数：  <el-select v-model="form2.proPeriods" placeholder="请选择" style="margin-top: 20px"><br>
                <el-option label="3" value="3"></el-option>
                <el-option label="6" value="6"></el-option>
                <el-option label="9" value="9"></el-option>
                <el-option label="12" value="12"></el-option>
                <el-option label="24" value="24"></el-option>
                <el-option label="36" value="36"></el-option>
            </el-select><br>

                产品额度：<el-input-number v-model="form2.proMoney" @change="handleChange" :min="1" :max="10000000" label="产品额度" style="margin-top: 20px"></el-input-number><br><br>
                产品介绍：<el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="form2.proContent" style="width: 90%;padding-top: 5px"></el-input>
                <el-button style="margin-left: 700px;margin-top: 20px" @click="qx()">取消</el-button><el-button type="primary" @click="add()">确定</el-button>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'basetable',
        data() {
            return {
                drawer: false,
                direction: 'btt',
                fullscreenLoading: false,
                query: {
                    page: 1,
                    total: 0,
                    rows: 4,
                    proName: null
                },
                bannerForm:{
                    iconPath:null,
                },
                form:null,
                form1:{
                    proName:null,
                    proPeriods:null,
                    proMoney:null,
                    proContent:null
                },
                form2:{
                    proName:null,
                    proPeriods:null
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                editVisible1: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        methods: {
            add(){
                this.$confirm('确定增加该产品?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = this.axios.urls.SYS_PRODUCTCONTROLLER_addProduct;
                    this.axios.post(url, this.form2).then(resp => {
                        this.$notify({
                            title: '成功',
                            message: '产品已增加',
                            type: 'success'
                        });
                        this.editVisible1=false
                        this.list();
                    }).catch((response) => {
                        this.$notify.info({
                            title: '消息',
                            message: '已取消'
                        });
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消增加'
                    });
                });

            },
            del(proid){
                this.$confirm('确定要删除该产品?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = this.axios.urls.SYS_PRODUCTCONTROLLER_Del;
                    this.axios.post(url, {
                        proId:proid.proId,

                    }).then(resp => {
                        this.$notify({
                            title: '成功',
                            message: '产品已删除',
                            type: 'success'
                        });
                        this.editVisible=false
                        this.list();
                    }).catch((response) => {
                        this.$notify.info({
                            title: '消息',
                            message: '产品已删除取消'
                        });
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            qx(){
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
                this.editVisible=false
            },
            handleChange(value) {
                console.log(value);
            },

            SetCustomerStatus(form1) {
                this.$confirm('确定要修改此产品?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = this.axios.urls.SYS_PRODUCTCONTROLLER_UPPRODUCT;
                    this.axios.post(url, {


                        proId:form1.proId,
                        proName:form1.proName,
                        proMoney:form1.proMoney,
                        proPeriods:form1.proPeriods,
                        proContent:form1.proContent,
                        proPhoto:form1.proPhoto,

                    }).then(resp => {
                        this.$notify({
                            title: '成功',
                            message: '产品信息修改成功',
                            type: 'success'
                        });

                        this.editVisible=false
                    }).catch((response) => {
                        this.$notify.info({
                            title: '消息',
                            message: '信息修改取消'
                        });
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            list: function() {
                this.fullscreenLoading = true;
                setTimeout(() => {
                    this.fullscreenLoading = false;
                    let url = this.axios.urls.SYS_PRODUCT_MANAGEMENT;
                    this.axios.post(url, this.query).then(resp => {

                        this.query.proName = null;

                        this.form = resp.data.result;

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
            handleEdit(index) {
                this.form1 = this.form[index];
                this.editVisible = true;
            },
            // 增加操作
            handleEdit1() {
                this.editVisible1 = true;
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
            }, 500);
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .mr10 {
        margin-right: 10px;
    }

    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }


</style>
