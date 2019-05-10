<template>
  
  <div class="rights_list">
    <header>
      <div class="logo" @click="toIndex">
        <img :src="Logo">
      </div>
      <p class="title">DSD智能制造</p>
      <div class="user_info">
        <span>{{userName}}</span>
        <span @click="loginOut">退出</span>
        <span @click="toManager" class="to_manager">管理员列表</span> 
        <!-- <span v-if="right==='0'" @click="toManager" class="to_manager">管理员列表</span>  -->
        <!-- <span v-else @click="toChangePwd" class="changePwd">修改密码</span>    -->
      </div>
    </header>
    <div class="rights_list_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="姓名">
          <el-input v-model="searchData.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchData.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="searchData.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">新增管理员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="rights_list_table">
      <el-table :data="tableData" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
        <el-table-column
          header-align="center"
          align="center"
          prop="rn"
          label="序号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="username"
          label="用户名">
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
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button @click="editClick(scope.$index,scope.row)" type="text" size="small">修改姓名</el-button>
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
    <el-dialog :title="editType==='create'?'新增管理员':'修改管理员'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="管理员姓名">
          <el-input v-model="formData.name" type="text" :disabled="editType ==='create'?false:true"></el-input>
        </el-form-item>
        <el-form-item label="管理员手机号">
          <el-input v-model="formData.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelBtnClick()">取消</el-button>
          <el-button type="primary" @click="saveBtnClick()">{{editType ==='create'?'保存':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改姓名" :visible.sync="dialogNameFormVisible">
      <el-form ref="form" :model="nameData" label-width="120px">
        <el-form-item label="管理员姓名">
          <el-input v-model="nameData.new_name" type="text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelNameBtnClick()">取消</el-button>
          <el-button type="primary" @click="saveNameBtnClick()">{{editType ==='create'?'保存':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogPwdFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="输入原密码">
          <el-input v-model="formData.old_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码">
          <el-input v-model="formData.new_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码">
          <el-input v-model="formData.new_password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelPwdBtnClick()">取消</el-button>
          <el-button type="primary" @click="savePwdBtnClick()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Logo from '../../assets/images/dsd_icon.png'
import { RightsList,RightsNew,RightsDel,RightsName } from '_utils/api'
export default {
  data () {
    return {
      Logo,
      dialogFormVisible:false,
      dialogNameFormVisible:false,
      dialogPwdFormVisible:false,
      editType: '',
      searchData:{},
      tableData:[],
      loading:false,
      row: 10,
      page: 1,
      total: 0,
      formData:{},
      nameData:{},
      rightList:[
        {
          key:'1',
          value:'市场部'
        },
        {
          key:'2',
          value:'市场部'
        },
        {
          key:'3',
          value:'市场部'
        },
        {
          key:'4',
          value:'市场部'
        },
        {
          key:'5',
          value:'市场部'
        },
        {
          key:'6',
          value:'市场部'
        }
      ],
      phone:'',
      old_password:'',
      
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('USERNAME')
    },
    // right(){
    //   return localStorage.getItem('RIGHT')
    // }
  },
  mounted() {
    this.initData()
  },
  methods:{
    toIndex(){
      this.$router.push('/')
    },
    loginOut() {
      localStorage.clear()
      this.$router.push('/login?url=' + this.$route.fullPath)
    },
    toManager(){
      this.$router.push('/rights')
    },
    toChangePwd(){
      this.dialogPwdFormVisible = true;
    },
    initData(){
      this.page = 1
      this.getRightsList()
    },
    getRightsList(){
      this.loading = true
      let params = {
        name: this.searchData.name,
        username: this.searchData.username,
        phone: this.searchData.phone,
        page: this.page,
        row: this.row
      }
      RightsList(params,'get').then((res) => {
        this.loading = false;
        this.tableData = res.data
        this.total = res.total
      }).catch(() => {
        this.loading = false;
        this.$message.error('获取数据失败')
      })
    },
    searchBtnClick(){
      this.page = 1
      this.getRightsList()
    },
    createBtnClick(){
      this.dialogFormVisible = true;
      this.editType = 'create';
      this.formData = {phone:'',name:''}
    },
    editClick(index,row){
      this.dialogNameFormVisible = true;
      this.phone = row.phone;
    },
    deleteClick(index,row){
      this.$confirm('是否删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'phone': row.phone
        };
        RightsDel(params,'delete').then((res) => {
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
    cancelNameBtnClick(){
      this.dialogNameFormVisible = false;
    },
    saveBtnClick(){
      let params = {
        'phone': this.formData.phone,
        'name': this.formData.name
      }
      let {phone, name} = this.formData
      if(!phone || !name){
        this.$message({type: 'error', message: '请完善信息再提交'})
        return
      }
      this.dialogFormVisible = false
      RightsNew(params,'post').then((res) => {
         if (parseInt(res.res) === 0) {
            this.$message({type: 'success', message: "提交成功",});
            this.initData();
            this.dialogFormVisible = false;
          } else {
            this.$message({type: 'error', message: res.errmsg});
          }
      }).catch(() => {
        this.$message({type: 'error', message: '操作失败',})
      })
    },
    saveNameBtnClick(){
      let params = {
        'phone': this.phone,
        'new_name': this.nameData.new_name
      }
      if(!this.nameData.new_name){
        this.$message({type: 'warning', message: '姓名不能为空'})
          return
      }
      RightsName(params,'put').then((res) => {
         if (parseInt(res.res) === 0) {
            this.$message({type: 'success', message: "修改成功",});
            this.nameData = {};
            this.initData();
            this.dialogNameFormVisible = false;
          } else {
            this.$message({type: 'error', message: res.errmsg});
          }
      }).catch(() => {
        this.$message({type: 'error', message: '操作失败',})
      })
      
    },
    savePwdBtnClick(){

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

    }
  }
}
</script>

<style lang="less">
.rights_list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    header{
      display: flex;
      align-items: center;
      padding: 20px;
      font-size: 20px;
      background: #f7f7f7;
      .logo{
        width: 30px;
        height: 30px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .title{
        margin-left: 15px;
        flex: 1;
      }
      .user_info{
        span:nth-of-type(2){
          margin-left: 10px;
          color: #409EFF;
        }
        .changePwd{
          margin-left: 10px;
          color: #409EFF;
        }
        .to_manager{
          margin-left: 10px;
          color: #409EFF;
        }
      }
    }
    .rights_list_search{
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
    .rights_list_table {
      flex: 1;
      display: flex;
      flex-direction: column;

      .el-table__body-wrapper {
        overflow: scroll;
        height: auto!important;
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
