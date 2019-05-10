<template>
  <div class="manage_list">
    <div class="manage_list_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="姓名">
          <el-input v-model="searchData.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="searchData.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage_list_table">
      <el-table :data="tableData" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
        <el-table-column
          header-align="center"
          align="center"
          prop="rn"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="avatar"
          label="头像"
          align="center">
          <template slot-scope="scope">
            <a :href="scope.row.avatar" target="_blank">
              <img class="avatar" :src="scope.row.avatar" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="company"
          label="所属公司">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="role"
          label="角色">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="permission"
          label="拥有权限">
          <template slot-scope="scope">
            <el-col :span="24" v-for="(permissionItem,index) in scope.row.permission" :key="index">
              <el-button type="text" size="small">{{permissionItem}}</el-button>
            </el-col>
          </template>
        </el-table-column>
         <el-table-column
          header-align="center"
          align="center"
          prop="operation"
          label="操作">
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
    <div class="application_list_pagination">
      <el-pagination
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper"
      >
      </el-pagination>
    </div>
    <el-dialog :title="editType==='create'?'新增企业管理员':'修改企业管理员'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="company_name" type="text" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="普通管理员手机号">
          <el-input v-model="formData.administrators" type="number"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限">
          <el-checkbox-group v-model="list">
            <el-checkbox 
              v-for="item in permission"
              :key="item.key"
              :label="item.value"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelBtnClick()">取消</el-button>
          <el-button type="primary" @click="saveBtnClick()">{{editType ==='create'?'保存':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { FacsAdmins,FacsAdminsDel } from '_utils/api'
export default {
  data () {
    return {
      dialogFormVisible:false,
      editType: '',
      searchData:{},
      tableData:[],
      loading:false,
      row: 10,
      page: 1,
      total: 0,
      formData:{
        company_name:'',
        administrators:'',
        rights: []
      },
      factory_id:'',
      permission:[],
      keys:[],
      company_name:'',
      phone:'',
      list:''
    }
  },
  mounted() {
    this.initData()
  },
  methods:{
    initData(){
      this.getAdminsList()
    },
    getAdminsList(){
      this.factory_id = this.$route.query.factory_id || ""
      this.loading = true
      let params = {
        username: this.searchData.username,
        phone: this.searchData.phone,
        page: this.page,
        row: this.row,
        factory_id: this.factory_id
      }
      FacsAdmins(params,'get').then((res) => {
        this.loading = false;
        this.tableData = res.data
        this.permission = res.permission
        this.total = res.total
        this.company_name = res.data[0].company
      }).catch(() => {
        this.loading = false;
        // this.$message.error('获取数据失败')
      })
    },
    searchBtnClick(){
      this.getAdminsList()
    },
    createBtnClick(){
      this.dialogFormVisible = true;
      this.editType = 'create';
      this.formData = {company_name:'',administrators:'',rights:[]};
      this.list = []
      this.keys = []  
    },
    editClick(index,row){
      this.dialogFormVisible = true;
      this.editType = 'edite';
      this.formData = this.$_.cloneDeep(row);
      this.formData.administrators = this.formData.phone;
      this.phone = row.phone;
      // this.formData.rights = this.formData.permission;
      this.list = row.permission;
    },
    deleteClick(index,row){
      this.$confirm('是否删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = '/' + this.factory_id + '/' + row.phone
        FacsAdminsDel({},'delete',params).then((res) => {
          if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "提交成功",});
              this.initData();
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
    saveBtnClick(){
        this.permission.forEach((item) => {
        this.list.forEach((items) =>{
          if(items===item.value){
            this.keys.push(item.key)
          }
        })
        if(this.list === item.value){
          this.keys.push(item.key)
        }
      })

        let params = {
          'company_name': this.company_name,
          'administrators': this.phone,
          'new_administrators': this.formData.administrators,
          'permission': this.keys,
          'factory_id': this.factory_id
        }
        if (!this.formData.administrators || this.keys.length<=0) {
          this.$message({type: 'error', message: '请完善信息再提交'});
          return;
        }
        this.dialogFormVisible = false;
        FacsAdmins(params,this.editType==='create'?'post':'put').then((res) => {
          if (parseInt(res.res) === 0) {
              this.$message({type: 'success', message: "提交成功",});
              this.initData();
              this.list = []
              this.keys = []  
              this.dialogFormVisible = false;
            } else {
              this.$message({type: 'error', message: res.errmsg});
            }
        }).catch(() => {
          this.$message({type: 'error', message: '操作失败',});
        })
    },
    beforeOneUpload(opt){
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(opt.file)
      reader.onload = function () {
        that.imageUrl1 = this.result
      }
    },
    handleCurrentChange(){
      this.getAdminsList()
    }
  }
}
</script>

<style lang="less">
.manage_list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .manage_list_search{
      display: flex;
      flex-direction: row;
      margin: 20px;
      form {
        width: 100%;
        .el-form-item {
          display: inline-block;
          margin-right: 10px;
          vertical-align: top;
        }
      }
    }
    .manage_list_table {
      flex: 1;
      display: flex;
      flex-direction: column;

      .el-table__body-wrapper {
        overflow: scroll;
      }

      .avatar {
        width: 80px;
        height: 80px;
      }

      .avatars {
        width: 100%;
        height: 100%;
      }
    }
    .application_list_pagination {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

    }
    .pic-uploader{
    width: 178px;
    height: 178px;
    display: inline-block;
    margin-right: 20px;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .pic {
      width: 178px;
      height: 178px;
      display: block;
    }
    
  } 
  .el-dialog{
    width: 40%;
  }
  
 
  }
  .el-dialog__body{
    .el-form-item__label{
      width: 140px!important;
    }
    .el-form-item__content{
      margin-left: 140px!important;
    }
  }
</style>
