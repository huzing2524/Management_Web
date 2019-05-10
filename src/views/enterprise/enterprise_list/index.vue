<template>
  <div class="enterprise_list">
    <div class="enterprise_list_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="公司名称">
          <el-input v-model="searchData.company_name" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员">
          <el-input v-model="searchData.administrators" placeholder="超级管理员"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="enterprise_list_table">
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
          prop="company_name"
          label="公司名称">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="company_area"
          label="公司地区">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="company_category"
          label="公司类别">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="contact"
          label="联系人">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="administrators"
          label="超级管理员">
          <template slot-scope="scope">
            <el-col :span="24" v-for="(adminItem,index) in scope.row.administrators" :key="index">
              <span type="text" size="small">{{adminItem}}</span>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="normal_admin"
          label="普通管理员">
          <template slot-scope="scope">
            <div style="cursor: pointer;color:#409EFF;" @click="toManageClick(scope.$index,scope.row)">{{scope.row.normal_admin}}</div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="auth_file"
          label="授权文件">
          <template slot-scope="scope" v-if="scope.row.auth_file">
            <img :src="scope.row.auth_file" style="width: 100%;height: 100%">
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="business_licence"
          label="营业执照">
          <template slot-scope="scope" v-if="scope.row.business_licence">
            <img :src="scope.row.business_licence" style="width: 100%;height: 100%">
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="operation"
          label="操作">
          <template slot-scope="scope">
            <el-row :gutter="20">
              <el-col>
                <el-button @click="editClick(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog :title="editType ==='create'?'新增企业':'修改企业'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="formData.company_name" type="text" placeholder="请填写公司名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="formData.contact" type="text" placeholder="请填写联系人"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员手机号">
          <el-input v-model="formData.administrators" type="text" placeholder="请填写超级管理员手机号"></el-input>
        </el-form-item>
        <el-form-item label="地区（选填）">
          <!--<el-input v-model="formData.company_area" type="text" placeholder="请填写地区"></el-input>-->
          <el-cascader
            expand-trigger="hover"
            :options="areaList"
            v-model="dialogArea"
            :props="{
              value: 'label'
            }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="类别（选填）">
          <el-select v-model="formData.company_category" placeholder="选择类别" clearable>
            <el-option
              v-for="(item, idx) in company_category"
              :key="idx"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权文件（选填）" class="pic-uploader-box">
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeOneUpload">
            <img v-if="imageUrl1" :src="imageUrl1" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业执照（选填）" class="pic-uploader-box">
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeTwoUpload">
            <img v-if="imageUrl2" :src="imageUrl2" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  import { GetFacsList,FacsNew,FacsModify } from '_utils/api'
  import { ArrangeParams } from '_utils/common'
  import { company_category } from '_utils/company_category'
  import { areaList } from '_utils/area.js'

  export default {
    data() {
      return {
        areaList,
        company_category,
        factory_id:'',
        dialogFormVisible:false,
        editType:'',
        imageUrl1:'',
        imageUrl2:'',
        searchData:{},
        tableData:[],
        loading:false,
        row: 10,
        page: 1,
        total: 0,
        formData:{
          company_name:'',
          contact:'',
          administrator:'',
          company_area:'',
          company_category:'',
          auth_file:'',
          business_licence:''
        },
        categoryList: [{
          value:'机械制造',
          label:'1'
        },{
          value:'塑胶制造',
          label:'2'
        }],
        dialogArea: [],
        handleChange: ''
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData(){
        this.page = 1
        this.getFacsList()
      },
      async getFacsList(){
        this.loading = true
        let params = {
          company_name: this.searchData.company_name,
          administrators: this.searchData.administrators,
          page: this.page,
          row: this.row
        }
        try{
          let res = await GetFacsList(ArrangeParams(params))
          this.loading = false;
          this.tableData = res.data;
          this.total = res.total;
        }catch (e) {
          this.loading = false
        }
      },
      searchBtnClick(){
        this.page = 1
        this.getFacsList()
      },
      toManageClick(index, row){
        this.$router.push(`/enterprise/manage?factory_id=${row.factory_id}`)
      },
      createBtnClick(){
        this.dialogFormVisible = true
        this.editType = 'create'
        this.formData = {company_name:'',contact:'',administrators:'',company_area:'',company_category:'',auth_file:'',business_licence:''}
        this.imageUrl1 = ''
        this.imageUrl2 = ''
        this.dialogArea = []
      },
      beforeOneUpload(opt){
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function() {
          that.imageUrl1 = this.result
        }
      },
      beforeTwoUpload(opt){
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function() {
          that.imageUrl2 = this.result
        }
      },
      editClick(index, row){
        this.editType = 'edit';
        this.dialogFormVisible = true;
        this.factory_id = row.factory_id
        this.formData = this.$_.cloneDeep(row);
        this.imageUrl1 = this.formData.auth_file;
        this.imageUrl2 = this.formData.business_licence;
        this.formData.administrators = this.formData.administrators[0]
        this.dialogArea = this.formData.company_area.split(' ')
        this.categoryList.forEach((item) => {
        if(this.formData.company_category === item.label){
            this.formData.company_category = '' + item.value
          }
        })
      },
      cancelBtnClick(){
        this.dialogFormVisible = false;
      },
      saveBtnClick(){
        this.categoryList.forEach((item) => {
        if(this.formData.company_category === item.value){
            this.formData.company_category = '' + item.label
          }
        })
        if (this.imageUrl1 && (this.imageUrl1.indexOf("https")===-1)){
          this.formData.auth_file = this.imageUrl1
        }else{
          let str = this.imageUrl1.substring(this.imageUrl1.length-22)
          this.imageUrl1 = str.split('.')[0]
        }
         if (this.imageUrl2 && (this.imageUrl2.indexOf("https")===-1)){
          this.formData.business_licence = this.imageUrl2
        }else{
          let str = this.imageUrl2.substring(this.imageUrl2.length-22)
          this.imageUrl2 = str.split('.')[0]
        }
        this.formData.company_area = this.dialogArea.join(' ')
        let params = {
          'company_name': this.formData.company_name,
          'contact': this.formData.contact,
          'administrators': '' + this.formData.administrators,
          'company_area': this.formData.company_area,
          'company_category': this.formData.company_category,
          'auth_file': this.imageUrl1,
          'business_licence': this.imageUrl2,
          'factory_id': this.factory_id
        }
        let {company_name, contact, administrators} = this.formData
        if(!company_name || !contact || !administrators){
          this.$message({type: 'error', message: '请完善信息再提交'})
          return
        }
        this.dialogFormVisible = false
        if(this.editType==='create'){
          FacsNew(params,'post').then((res) => {
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
        }
        if(this.editType==='edit'){
          FacsModify(params,'put').then((res) => {
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
        }

      },
      handleCurrentChange(){
        this.getFacsList()
      }
    },
  }
</script>

<style lang="less">
  .enterprise_list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .enterprise_list_search{
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
    .enterprise_list_table {
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
