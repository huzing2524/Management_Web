<template>
    <div id="manage-predication">
        <div class="manage-identify-table">
            <el-table :data="tableData" v-loading="loading" style="width: 100%;height: 100%" stripe>
                <el-table-column fixed prop="id" label="ID" ></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="company" label="归属公司"></el-table-column>
                <el-table-column prop="key" label="KEY"></el-table-column>
                <el-table-column prop="time" label="有效期"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-button @click="editClick(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button @click="deleteClick(scope.$index,scope.row)" type="text" size="small">删除</el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="manage-predication-button">
            <el-button type="primary" icon="el-icon-edit" round @click="createBtnClick()" >点击新建</el-button>
        </div>
        <el-dialog title="新建API_KEY" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="ID">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="归属公司">
                    <el-input v-model="form.company"></el-input>
                </el-form-item>
                <el-form-item label="KEY">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="有效期">
                    <el-date-picker type="date" placeholder="选择有效日期" v-model="form.time" style="width: 100%;"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button @click="cancelBtnClick()">取消</el-button>
                    <el-button type="primary" @click="confirmBtnClick()">立即创建</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "manage-predication",
        data(){
            return{
                dialogFormVisible:false,
                form: {
                    id: '',
                    title: '',
                    company: '',
                    key: '',
                    time: '',
                },
                tableData:[],
                loading:false,
            }
        },
        methods: {
            initData(){
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.tableData =  [{
                        id: '101',
                        title: '贪吃蛇币价预测',
                        company: 'Yeecall',
                        key: 'set $args $args&api_key= 1Brh37P2scdkhWX5%2FHm3GmkXuJwdPgV7MIcVFVcAjBqOW50bOIb1;',
                        time: '2018.10.01',
                    },{
                        id:'102',
                        title:'贪吃蛇币价预测222',
                        company:'Yeecall22',
                        key:'set $args $args&api_key= 1Brh37P2scdkhWX5%2FHm3GmkXuJwdPgV7MIcVFVcAjBqOW50bOIb1;',
                        time:'2018.10.01',
                    }];
                },2000);
            },
            createBtnClick(){
                this.form= {id: '',title: '', company: '', key: '', time: '',};
                this.dialogFormVisible = true;
            },
            editClick(index,row){
                this.form = row;
                this.dialogFormVisible = true;
            },
            deleteClick(index){
                this.$prompt('','是否删除该API_KEY?', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.tableData.splice(index, 1);
                    // let id = row.phone;
                    // let state = '2';
                    // let msg = value;
                    // api.postBgauth(id,state,msg).then((res) => {
                    //     if(parseInt(res.data.res) === 0){
                    //         row.state = '2';
                    //         this.$message({type: 'success', message: "操作完成!",});
                    //     }else {
                    //         this.$message({type: 'error', message: res.data.errmsg,});
                    //     }
                    // }).catch(() => {
                    //     this.$message({type: 'error', message: '操作失败',});
                    // })
                }).catch(() => {
                });
            },
            cancelBtnClick(){
                this.dialogFormVisible = false;
            },
            confirmBtnClick(){
            }
        },
        mounted(){
            this.initData();
        }
    }
</script>

<style lang="less">
    @rem:46.875rem;

    #manage-predication{
        width: 100%;
        height: 100%;
        overflow: scroll;
    }
    .manage-predication-button{
        position: fixed;
        right:50px;
        bottom:100px;

    }


</style>
