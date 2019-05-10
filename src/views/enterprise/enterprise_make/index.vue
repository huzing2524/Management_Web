<template>
  <div id="manage-enterprise">
    <div class="manage-enterprise-table">
      <el-table :data="tableData" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
        <el-table-column fixed prop="id" label="ID" ></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="name" label="归属公司"></el-table-column>
        <el-table-column prop="administrators" label="超级管理员">
          <template slot-scope="scope">
            <el-col :span="24" v-for="(adminItem,index) in scope.row.administrators" :key="index">
              <el-button type="text" size="small">{{adminItem}}</el-button>
            </el-col>
          </template>
        </el-table-column>
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

    <div class="manage-enterprise-button">
      <el-button type="primary" icon="el-icon-edit" round @click="createBtnClick()" >点击新建</el-button>
    </div>
    <el-dialog :title="editType ==='create'?'新建企业信息':'修改企业信息'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="ID">
          <el-input v-model="formData.id" :disabled="editType ==='create'?false:true"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="归属公司">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-input v-for="(adminItem,index) in formData.administrators" :key="index" v-model="formData.administrators[index]">
            <template v-if="index === formData.administrators.length-1" slot="append">
              <span @click="formData.administrators.push('')">添加</span>
            </template>
            <template v-else slot="append">
              <span @click="formData.administrators.splice(index,1)">删除</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelBtnClick()">取消</el-button>
          <el-button type="primary" @click="confirmBtnClick()">{{editType ==='create'?'立即创建':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import  * as api from '_utils/api'

  export default {
    name: "manage-enterprise",
    data(){
      return{
        dialogFormVisible:false,
        formData: {
          id: '',
          title: '',
          name: '',
          administrators:[],
        },
        tableData:[],
        loading:false,
        editType:'',
      }
    },
    methods: {
      initData(){
        this.loading = true;
        api.GetFacsList().then((res) => {
          this.loading = false;
          this.tableData = res.data;
        }).catch(() => {
          this.loading = false;
        })
      },
      createBtnClick(){
        this.dialogFormVisible = true;
        this.editType = 'create';
        this.formData= {id: '',title: '', name: '', administrators: ['']};
      },
      editClick(index,row){
        this.dialogFormVisible = true;
        this.editType = 'modify';
        this.formData = this.$_.cloneDeep(row);
      },
      deleteClick(index,row){
        this.$confirm('是否删除该企业信息?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let id = row.id;
          api.postFacsDel({id}).then((res) => {
            if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "删除成功",});
              this.tableData.splice(index, 1);
            }else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }).catch(() => {
        });
      },
      cancelBtnClick(){
        this.dialogFormVisible = false;
      },
      confirmBtnClick(){
        let params = this.formData;
        let {id,title, name, administrators} = this.formData;
        if(!id.length || !title.length || !name.length || !administrators.length){
          this.$message({type: 'error', message:'请完善信息再提交'});
          return;
        }
        let hasEmpty = 0;
        administrators.forEach((adminItem) => {
          if(/^1[3456789]\d{9}$/.test(adminItem)){
            hasEmpty++;
            return hasEmpty;
          }
        })
        if(hasEmpty !== administrators.length){
          this.$message({type: 'error', message:'请确认信息正确再提交'});
          return;
        }
        // if(!/^[a-zA-Z]\w*$/.test(id)){
        //   this.$message({type: 'error', message:'格式错误，id必须以字母开头，不能包含中文等特殊字符'});
        //   return;
        // }
        this.dialogFormVisible = false;
        if(this.editType === 'create'){
          api.postFacsNew(params).then((res) => {
            if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "提交成功",});
              this.initData();
            }else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }else {
          api.postFacsModify(params).then((res) => {
            if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "提交成功",});
              this.initData();
            }else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }

      }
    },
    mounted(){
      this.initData();
    }
  }
</script>

<style lang="less">

  #manage-enterprise{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .manage-enterprise-table{
    flex: 1;
    .el-table__body-wrapper{
      overflow: scroll;
    }
  }


  .manage-enterprise-button{
    position: fixed;
    right:50px;
    bottom:100px;
  }


</style>
