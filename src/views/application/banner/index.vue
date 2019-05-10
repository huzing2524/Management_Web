<template>
  <div class="banner">
    <div class="banner_search">
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="createBtnClick()">新增Banner</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="banner_table">
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
          prop="image"
          label="Banner图">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="width: 100%;height: 100%"
                 @click="clickImg = scope.row.image;dialogFormVisible = true">
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
          label="操作">
          <template slot-scope="scope">
            <el-row :gutter="20">
              <el-col>
                <el-button @click="undercarriageClick(scope.$index,scope.row)" type="text" size="small">
                  {{scope.row.state==='1'?'上架':'下架'}}
                </el-button>
                <el-button @click="editClick(scope.$index,scope.row)" type="text" size="small">更换图片</el-button>
                <el-button @click="cancelClick(scope.$index,scope.row)" type="text" size="small">删除</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="banner_pagination">
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
    <el-dialog :visible.sync="dialogFormVisible">
      <img :src="clickImg" alt="" style="width:100%">
    </el-dialog>
    <el-dialog :title="editType ==='create'?'新增Banner图':'修改Banner图'" :visible.sync="dialogNewFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="Banner图" class="pic-uploader-box">
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
  </div>
</template>

<script>
  import {getProblemState,getFullDate} from '_utils/common'
  import {BannerOptions} from '@/utils/api'

  export default {
    data() {
      return {
        getFullDate,
        getProblemState,
        row: 10,
        page: 1,
        total: 0,
        editType:'',
        imageUrl:'',
        formData:{
          image: '',
        },
        dialogFormVisible: false,
        dialogNewFormVisible: false,
        clickImg: '',
        loading:'',
        searchData:{
          name:'',
          phone:''
        },
        tableData:[]
      }
    },
    mounted() {
      this.getBannerOptionsList()
    },
    methods: {
      beforeUpload(opt){
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function() {
          that.imageUrl = this.result
        }
      },
      createBtnClick() {
        this.dialogNewFormVisible = true;
        this.editType = 'create';
        this.formData = {image:''};
        this.imageUrl = '';
      },
      cancelBtnClick(){
        this.dialogNewFormVisible = false;
      },
      saveBtnClick(){
        if (this.imageUrl && (this.imageUrl.indexOf("https")===-1)){
          this.formData.image = this.imageUrl
        }else{
          let str = this.imageUrl.substring(this.imageUrl.length-22)
          this.imageUrl = str.split('.')[0]
        }
        let params = {
          'id': this.id,
          'image': this.formData.image,
        }
        let {image} = this.formData;
        if(!image.length){
          this.$message({type: 'error', message:'请选择一张要上传的图片'});
          return;
        }
        this.dialogNewFormVisible = false;
        if(this.editType==='create'){
          BannerOptions(params,'post').then((res) => {
            if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "提交成功",});
              this.getBannerOptionsList();
              this.dialogNewFormVisible = false;
              this.imageUrl = '';
            }else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }
        if(this.editType==='edit'){
          BannerOptions(params,'put').then((res) => {
            if(parseInt(res.res) === 0){
              this.$message({type: 'success', message: "修改成功",});
              this.getBannerOptionsList();
              this.dialogNewFormVisible = false;
              this.imageUrl = '';
            }else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }
      },
      undercarriageClick(index, row){
        this.$confirm('确定此次操作?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let state = row.state === '1' ? '0' : '1';
          let id = row.id;
          BannerOptions({'id': id,'state': state}, 'put').then((res) => {
            if (parseInt(res.res) === 0) {
              this.$message({type: 'success', message: "操作成功",});
              this.getBannerOptionsList();
            } else {
              this.$message({type: 'error', message: res.errmsg});
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }).catch(() => {

        });
      },
      editClick(index, row){
        this.dialogNewFormVisible = true;
        this.editType = 'edit';
        this.id = row.id;
        this.formData = this.$_.cloneDeep(row);
        this.imageUrl = this.formData.image;
      },
      cancelClick(index,row){
        this.$confirm('是否删除该条数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          let id = row.id;
          BannerOptions({id:id},'delete').then((res) => {
            if(parseInt(res.res) === 0){
                this.$message({type: 'success', message: "删除成功",});
                this.getBannerOptionsList();
              }else {
                this.$message({type: 'error', message: res.errmsg});
              }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',});
          })
        }).catch(() => {
          
        });
      },
      getBannerOptionsList() {
        this.loading = true;
        let params = {
          row: this.row,
          page: this.page
        }
        BannerOptions(params, 'get').then((res) => {
          this.loading = false;
          this.tableData = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      
      handleCurrentChange() {
        this.getBannerOptionsList()
      },
    },
  }
</script>

<style lang="less">
  .banner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .banner_search {
      display: flex;
      flex-direction: row;
      margin: 20px;
      form {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .el-form-item {
          display: flex;
        }

        .addApplication {
          margin-right: 45px;
        }

      }

    }

    .banner_table {
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

    .banner_pagination {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }

    .images {
      .cell {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }

    .pic-uploader {
      width: 178px;
      height: 178px;
      display: inline-block;
      margin-right: 20px;
      .pic{
        width: 178px;
        height: 178px;
      }
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

      .avatar {
        width: 80px;
        height: 80px;
        display: block;
      }

      .images {
        .cell {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      }

      .pic-uploader {
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

      .el-dialog__headerbtn {
        display: none;
      }

    }
  }
</style>
