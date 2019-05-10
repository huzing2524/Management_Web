<template>
  <div class="application_learning">
    <div class="application_learning_search">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">新增学习任务</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="application_learning_table">
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
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="descr"
          label="描述">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="tags"
          label="关键词">
           <template slot-scope="scope">
            <el-col :span="24" v-for="(tagItem,index) in scope.row.tags" :key="index">
              <el-button type="text" size="small">{{tagItem}}</el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="images"
          label="示例图">
          <template slot-scope="scope">
            <div v-for="(imageItem,index) in scope.row.images" :key="index" style="display:inline-block;margin: 0 5px;">
              <a :href="imageItem" target="_blank">
                <img class="avatars" :src="imageItem" alt="" style="width:80px;height:80px;">
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="上架时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="state"
          label="操作">
          <template slot-scope="scope">
            <el-row :gutter="20">
              <el-col>
                <el-button @click="changeStateClick(scope.$index,scope.row)" type="text" size="small">
                  {{scope.row.state==='1'?'隐藏':'显示'}}
                </el-button>
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
    <el-dialog :title="editType ==='create'?'新增学习任务':'修改学习任务'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" 
            :rows="5"
            placeholder="请输入描述"
            v-model="formData.descr">
          </el-input>
        </el-form-item>
        <el-form-item label="选择关键词">
          <el-checkbox-group v-model="formData.keywords">
            <el-checkbox 
              v-for="item in keywordList"
              :key="item.key"
              :label="item.value"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="示例图" class="pic-uploader-box">
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeOneUpload">
            <img v-if="imageUrl1" :src="imageUrl1" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
           <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeTwoUpload">
            <img v-if="imageUrl2" :src="imageUrl2" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
           <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeThreeUpload">
            <img v-if="imageUrl3" :src="imageUrl3" class="pic">
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
import { getFullDate,setImageUrl } from '_utils/common'
import { LearningXdTasks,LearningXdKeyword } from '@/utils/api'
export default {
  data () {
    return {
      setImageUrl,
      getFullDate,
      dialogFormVisible:false,
      row: 10,
      page: 1,
      total: 0,
      editType: '',
      textarea: '',
      imageUrl1:'',
      imageUrl2:'',
      imageUrl3:'',
      tableData:[],
      loading:false,
      formData:{
        title:'',
        descr:'',
        keywords:[],
        images:[]
      },
      keywordList:[],
      keys:[],
    }
  },
  mounted() {
    this.initData()
  },
  methods:{
    initData(){
      this.loading = true;
      LearningXdTasks({},'get').then((res) => {
        this.loading = false
        this.tableData = res.data
        this.total = res.total
      })
      let type = 2;
      LearningXdKeyword({type},'get').then((res) => {
        this.keywordList = res.list
      }).catch(() => {
        this.$message.error('获取数据失败')
      })
    },
    createBtnClick(){
      this.dialogFormVisible = true;
      this.editType = 'create';
      this.formData = {title:'',descr:'',keywords:[], images:[]}
      this.imageUrl1 = ''
      this.imageUrl2 = ''
      this.imageUrl3 = ''
    },
    changeStateClick(index, row) {
        this.$confirm('确定此次操作?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let state = row.state === '1' ? '0' : '1';
          let id = row.id;
          LearningXdTasks({'state': state}, 'put', id).then((res) => {
            if (parseInt(res.res) === 0) {
              this.$message({type: 'success', message: "操作成功",});
              this.initData();
            } else {
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
    beforeOneUpload(opt){
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(opt.file)
      reader.onload = function () {
        that.imageUrl1 = this.result
      }
    },
    beforeTwoUpload(opt) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(opt.file)
      reader.onload = function () {
        that.imageUrl2 = this.result
      }
    },
    beforeThreeUpload(opt) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(opt.file)
      reader.onload = function () {
        that.imageUrl3 = this.result
      }
    },
    saveBtnClick(){
      this.keywordList.forEach((item) => {
        this.formData.keywords.forEach((items) =>{
          if(items===item.value){
            this.keys.push(item.key)
          }
        })
        if(this.formData.keywords === item.value){
          this.formData.keywords.push(item.key)
        }
      })
       if (this.imageUrl1) {
          this.formData.images.push(this.imageUrl1)
        }
        if (this.imageUrl2) {
          this.formData.images.push(this.imageUrl2)
        }
        if (this.imageUrl3) {
          this.formData.images.push(this.imageUrl3)
        }
        let params = {
          'title': this.formData.title,
          'descr': this.formData.descr,
          'keywords': this.keys,
          'images': this.formData.images,
        };
        let {title, descr, keywords, images} = this.formData;
        if (!title.length || !descr.length || !keywords.length || !images.length) {
          this.$message({type: 'error', message: '请完善信息再提交'});
          return;
        }
        this.dialogFormVisible = false;
        LearningXdTasks(params,'post').then((res) => {
          if (parseInt(res.res) === 0) {
              this.$message({type: 'success', message: "提交成功",});
              this.keys = [];
              this.initData();
              this.dialogFormVisible = false;
            } else {
              this.$message({type: 'error', message: res.errmsg});
            }
        }).catch(() => {
          this.$message({type: 'error', message: '操作失败',});
        })

    },
    handleCurrentChange(){

    }
  }
}
</script>

<style lang="less">
.application_learning{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .application_learning_search{
      display: flex;
      flex-direction: row;
      margin: 20px;
      form{
        width: 100%;
        display: flex;
        flex-direction: row;
        .el-form-item{
          display: flex;
          margin-right: 20px;
        }
      
      }
    }
    .application_learning_table{
      flex: 1;
      display: flex;
      flex-direction: column;
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
</style>
