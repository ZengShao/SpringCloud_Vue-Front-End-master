<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 合同管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.customerName" placeholder="客户姓名" class="handle-input mr10"
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
                <el-table-column prop="customerId" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="contractId" label="合同编号"></el-table-column>
                <el-table-column label="客户姓名">
                    <template slot-scope="scope">{{scope.row.customerName}}</template>
                </el-table-column>
                <el-table-column label="身份证号" align="center">
                    <template slot-scope="scope">{{scope.row.customerIdNumber}}</template>
                </el-table-column>
                <el-table-column prop="customerTel" label="手机号码"></el-table-column>
                <el-table-column prop="customerBorrowMoney" label="借款金额" align="center"></el-table-column>

                <el-table-column prop="customerPeriods" label="期数"></el-table-column>
                <el-table-column prop="contractTime" label="添加时间">
                    <template slot-scope="scope">{{formartDate(scope.row.contractTime)}}</template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="text" @click="handleEdit(scope.$index, scope.row)">查看合同
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

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

        <!-- 编辑弹出框 -->
        <el-dialog :title="form.dictItem" :visible.sync="editVisible" width="30%">
            <el-card :visible.sync="editVisible" :model="form" class="box-card">
                <div slot="header" class="clearfix">
                    <download-excel class="el-icon-download" type="button" :data="tableData" :fields="json_fields" name="个人借贷合同.xls"></download-excel>
                    <el-button class="el-icon-download" style="margin-left: 180px" @click="exportWord" size="small" type="primary">导出word</el-button>
                </div>
                <div v-for="o in 4" :key="o" class="text item">
                    {{form.dictValue}}
                </div>
            </el-card>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import M from 'minimatch';

    export default {
        name: 'basetable',
        data() {
            return {
                json_fields: {
                    '用户ID': 'customerId',    //常规字段
                    '合同ID': 'contractId', //支持嵌套属性
                    '用户名': 'customerName',
                    '身份证号码':'customerIdNumber',
                    '手机号':'customerTel',
                    '用户借款金额':'customerBorrowMoney',
                    '用户借款期数':'customerPeriods',
                    '合同生成日期':'contractTime'
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
                    customerName: null
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
            // 点击导出word
            exportWord: function() {
                let _this = this;
                // 读取并获得模板文件的二进制内容
                JSZipUtils.getBinaryContent("input.docx", function(error, content) {
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
                    saveAs(out, "个人借贷合同.docx");
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
                setTimeout(() => {
                    this.fullscreenLoading = false;
                    let url = this.axios.urls.SYS_CONTRACT_MANAGEMENT;
                    this.axios.post(url, this.query).then(resp => {

                        console.log(resp.data.result);

                        this.form.dictItem = resp.data.result.dictItem;
                        this.form.dictValue = resp.data.result.dictValue;

                        this.query.customerName = null;

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
