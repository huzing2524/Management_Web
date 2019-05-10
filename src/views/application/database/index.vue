<template>
  <div class="application_database">
    <div class="application_database_search">
      <el-form :inline="true" :model="xdSearch">
        <el-form-item label="用户ID">
          <el-input v-model="xdSearch.phone" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="xdSearch.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="xdSearch.state" placeholder="选择状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-select v-model="xdSearch.keyword" placeholder="选择关键词" clearable>
            <el-option
              v-for="item in keywordList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">创建关键词</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="application_database_table">
      <el-table :data="tableData" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
        <el-table-column
          header-align="center"
          align="center"
          prop="id"
          label="序号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="phone"
          label="用户ID">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="用户名">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="keyword"
          label="关键词">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="image1"
          label="示例图">
          <template slot-scope="scope">
            <a :href="scope.row.image1" target="_blank">
              <img ref="editIcon" class="avatar" :src="scope.row.image1" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="image2"
          label="上传的图">
          <template slot-scope="scope">
            <img ref="editIcon" class="avatar" :src="scope.row.image2" alt="" @click="toExamineClick(scope.$index,scope.row)">
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="上传时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="state"
          label="审核结果">
          <template slot-scope="scope">
            <span>{{scope.row.state | getState}}</span>
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
                <el-button @click="cancelClick(scope.$index,scope.row)" type="text" size="small">删除</el-button>
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
    <el-dialog :title="editType ==='create'?'创建关键词':'修改关键词'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="上级关键词">
          <el-select v-model="formData.type" placeholder="请选择上级关键词" clearable>
            <el-option
              v-for="item in keywordList1"
              :key="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="formData.name" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item label="示例图" class="pic-uploader-box">
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelBtnClick()">取消</el-button>
          <el-button type="primary" @click="saveBtnClick()">{{editType ==='create'?'保存':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogExamineVisible" class="examine_box">
      <div class="title_box">
        <span>{{title}}</span> 
      </div>
      <div class="image_box">
        <img class="examine_image" :src="imageUrl1">
      </div>
      <div class="btn_box" v-if="this.examineData.state==='0'">
        <el-button type="primary" @click="toErroClick">错误</el-button>
        <el-button type="primary" @click="toRightClick">正确</el-button>
      </div>
      <div class="btn_box" v-if="this.examineData.state==='1'">
        <span style="color:green;font-size:20px;">正确</span>
      </div>
      <div class="btn_box" v-if="this.examineData.state==='2'">
        <span style="color:red;font-size:20px;">错误：{{this.examineData.err_reason}}</span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogErroVisible" class="erro_box">
      <el-form :model="errData">
        <el-form-item>
          <el-input v-model="errData.err_reason" placeholder="填写错误的原因"></el-input>
        </el-form-item>
        <div class="err_reason">
          <span @click="confirmErro(item)" v-for="(item,index) in errList" :key="index">{{item}}</span>
        </div>
        <div class="btn_box">
          <el-button type="primary">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getFullDate,setImageUrl } from '_utils/common'
import { LearningXdImages,LearningXdKeyword } from '@/utils/api'
export default {
  data () {
    return {
      setImageUrl,
      getFullDate,
      dialogFormVisible:false,
      dialogExamineVisible:false,
      dialogErroVisible:false,
      editType:'',
      imageUrl:'',
      imageUrl1:'',
      xdSearch:{
        phone: '',
        name: '',
        state: '',
        keyword: '',
      },
      tableData:[],
      loading:false,
      row: 10,
      page: 1,
      total: 0,
      formData:{
        type: '',
        name: '',
        image: '',
      },
      errData:{
        res:'',
        err_reason:'',
      },
      options: [{
        value: '1',
        label: '已审核'
      },{
        value: '0',
        label: '未审核'
      },
      ],
      keywordList: [],
      keywordList1: [],
      examineData:{},
      title:'',
      errList:['标记框标记有误','图片不符','图片不清晰'],
      id:'',
    }
  },
  filters:{
    getState(val){
      switch(parseInt(val)){
        case 0:
          return '未审核';
        case 1:
          return '审核通过';
        case 2:
          return '审核未通过';
        default:
          return '';
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData(){
      // this.loading = true;
      // LearningXdImages({},'get').then((res) => {
      //   this.loading = false;
      //   this.tableData = res.data
      //   this.total = res.total
      // }).catch(() => {
      //   this.loading = false;
      // })
      this.getLearningXdList()
      let type = 2;
      LearningXdKeyword({type},'get').then((res) => {
        this.keywordList = res.list
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    getLearningXdList(){
      this.loading = true;
      let learningXdList = this.xdSearch
      this.keywordList.forEach((item) => {
        if(learningXdList.keyword === item.value){
          learningXdList.key = '' + item.key
        }
      })
      let params = {
        phone: learningXdList.phone,
        name: learningXdList.name,
        state: learningXdList.state,
        keyword: learningXdList.key,
        page: this.page,
        row: this.row
      }
      LearningXdImages(params,'get').then((res) => {
        this.loading = false;
        this.tableData = res.data
        this.total = res.total
        learningXdList.key = null
      }).catch(() => {
        this.loading = false;
        this.$message.error('获取数据失败')
      })
    },
    searchBtnClick(){
      this.page = 1
      this.getLearningXdList()
    },
    beforeUpload(opt){
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(opt.file)
      reader.onload = function() {
        that.imageUrl = this.result
      }
    },
    createBtnClick(){
      this.dialogFormVisible = true;
      this.editType = 'create';
      this.formData = {type:'',name:'',image:''};
      let type = 1;
      LearningXdKeyword({type},'get').then((res) => {
        this.keywordList1 = res.list
        this.keywordList1.unshift({value: "词根", key: 0})
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
      
    },
    cancelBtnClick(){
      this.dialogFormVisible = false;
    },
    saveBtnClick(){
      this.keywordList1.forEach((item) => {
        if(this.formData.type === item.value){
          this.formData.type = '' + item.key
        }
      })
      if(this.imageUrl){
        this.formData.image = this.imageUrl
      }
      let params = {
        'type': this.formData.type,
        'name': this.formData.name,
        'image': this.formData.image
      }
      let {type,name,image} = this.formData;
      if(!type.length || !name.length || !image.length){
        this.$message({type: 'error', message:'请完善信息再提交'});
        return;
      }
      this.dialogFormVisible = false;
      LearningXdKeyword(params,'post').then((res) => {
        if(parseInt(res.res) === 0){
            this.$message({type: 'success', message: "提交成功",});
            this.initData();
            this.dialogFormVisible = false;
            this.imageUrl = '';
          }else {
            this.$message({type: 'error', message: res.errmsg});
          }
      }).catch(() => {
        this.$message({type: 'error', message: '操作失败',});
      })
    },
    toExamineClick(index,row){
      this.dialogExamineVisible = true;
      this.examineData = this.$_.cloneDeep(row);
      this.imageUrl1 = this.examineData.image2
      this.title = this.examineData.keyword
      this.id = '' + this.examineData.id
    },
    toErroClick(){
      this.dialogExamineVisible = false;
      this.dialogErroVisible = true;
    },
    confirmErro(item){
      this.errData.err_reason = item;
    },
    confirmClick(){
      if(!this.errData.err_reason){
        this.$message({type: 'error', message:'请完善信息再提交'});
        return;
      }
      let params = {
        res: '1',
        err_reason: this.errData.err_reason
      }
      LearningXdImages(params,'put',this.id).then((res) => {
        if(parseInt(res.res) === 0){
            this.$message({type: 'success', message: "提交成功",});
            this.dialogErroVisible = false; 
            this.initData();
          }else {
            this.$message({type: 'error', message: res.errmsg});
          }
      }).catch(() => {
        this.$message({type: 'error', message: '操作失败',});
      })

    },
    toRightClick(){
      let params = {
        res: '0',
      }
      LearningXdImages(params,'put',this.id).then((res) => {
        if(parseInt(res.res) === 0){
            this.$message({type: 'success', message: "提交成功",});
            this.dialogExamineVisible = false; 
            this.initData();
          }else {
            this.$message({type: 'error', message: res.errmsg});
          }
      }).catch(() => {
        this.$message({type: 'error', message: '操作失败',});
      })
    },
    cancelClick(index,row){
      this.$confirm('是否删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id;
        LearningXdImages({},'delete',id).then((res) => {
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
    handleCurrentChange(){
      this.getLearningXdList()
    }
  }
}
</script>

<style lang="less">
  .application_database{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .application_database_search{
      display: flex;
      flex-direction: row;
      margin: 20px;
      form{
        width: 100%;
        .el-form-item{
          display: inline-block;
          margin-right: 10px;
          vertical-align: top;
        }
      
      }
    }
    .application_database_table{
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .avatar{
      width: 100%;
      height: 100%;
    }
  }
  .application_list_pagination{
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
  .el-dialog__body{
    padding-top: 15px;
  }
  .examine_box{
    display: flex;
    flex-direction: column;
    .title_box{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      span{
        padding: 5px 20px;
        color: green;
        border: 1px solid green;
        border-radius: 10px;
      }
    }
    .image_box{
    display: flex;
    justify-content: center;
    align-items: center;
      .examine_image{
        width: 300px;
        height: 400px;
      }
    }
    .btn_box{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      button{
        width: 140px;
      }
    }
  }
  .erro_box{
    display: flex;
    flex-direction: column;
    .err_reason{
      display: flex;
      flex-direction: row;
      margin: 20px 0;
      span{
        padding: 5px 10px;
        color: green;
        border: 1px solid green;
        border-radius: 20px;
        margin-right: 20px;
      }
    }
  }
  
</style>
