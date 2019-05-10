<template>
  <div class="application_list">
    <div class="application_list_search">
      <el-form :inline="true" :model="applicationSearch">
        <el-form-item label="应用名称">
          <el-input v-model="applicationSearch.name" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-form style="justify-content: flex-end;">
        <el-form-item class="addApplication">
          <el-button type="primary" @click="createBtnClick()">添加应用</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="application_list_table">
      <el-table :data="tableData" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
        <el-table-column
          header-align="center"
          align="center"
          prop="id"
          label="应用ID">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="icon"
          label="icon"
          width="100">
          <template slot-scope="scope">
            <a :href="scope.row.icon" target="_blank">
              <img ref="editIcon" class="avatar" :src="scope.row.icon" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="应用名称"
          width="120">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="slogan"
          label="一句话介绍"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="descs"
          label="详细介绍"
        >
          <template slot-scope="scope">
            <el-col :span="24" v-for="(descItem,index) in scope.row.descs" :key="index">
              <el-button type="text" size="small">{{descItem}}</el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          class="images"
          header-align="center"
          align="center"
          prop="images"
          label="APP截图">
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
          prop="dsd_val"
          label="每月所需DSD"
          width="120">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="url"
          label="链接">
        </el-table-column>
        <el-table-column label="操作" prop="state" width="180">
          <template slot-scope="scope">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-button @click="changeStateClick(scope.$index,scope.row)" type="text" size="small">
                  {{scope.row.state==='1'?'隐藏':'显示'}}
                </el-button>
              </el-col>
              <el-col :span="12">
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
    <el-dialog :title="editType ==='create'?'添加轻应用':'修改轻应用'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="icon">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="beforeOneUpload"
            :show-file-list="false">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="一句话介绍">
          <el-input v-model="formData.slogan"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-input v-for="(descItem,index) in formData.descs" :key="index" v-model="formData.descs[index]">
            <template v-if="index === formData.descs.length-1" slot="append">
              <span @click="formData.descs.push('')">添加</span>
            </template>
            <template v-else slot="append">
              <span @click="formData.descs.splice(index,1)">删除</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="APP截图" class="pic-uploader-box">
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeTwoUpload">
            <img v-if="imageUrl1" :src="imageUrl1" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforeThreeUpload">
            <img v-if="imageUrl2" :src="imageUrl2" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="pic-uploader"
            action=""
            :show-file-list="false"
            :http-request="beforefourUpload">
            <img v-if="imageUrl3" :src="imageUrl3" class="pic">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <el-upload
            ref="uploads"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-success="handlePictureCardSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" class="dialogImageUrl">
          </el-dialog> -->
        </el-form-item>
        <el-form-item label="每月所需DSD">
          <el-input v-model="formData.dsd_val"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="formData.url">
            <template slot="prepend"></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelBtnClick()">取消</el-button>
          <el-button type="primary" @click="saveBtnClick()">{{editType ==='create'?'立即添加':'修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {setImageUrl} from '_utils/common'
  import {ApplicationApps, ApplicationAppsState} from '@/utils/api'

  export default {
    data() {
      return {
        setImageUrl,
        dialogFormVisible: false,
        imageUrl: '',
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        imageListUrl: [],
        dialogImageUrl: '',
        dialogVisible: false,
        applicationSearch: {
          id:'',
          name: '',
        },
        formData: {
          name: '',
          icon: '',
          slogan: '',
          descs: [],
          images: [],
          dsd_val: 0,
          url: ''
        },
        row: 10,
        page: 1,
        total: 0,
        editType: '',
        tableData: [],
        loading: false,
        pics:[],
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getApplicationList()
      },
      createBtnClick() {
        this.dialogFormVisible = true;
        this.editType = 'create';
        this.formData = {name: '', icon: '', slogan: '', descs: [''], images: [], dsd_val: null, url: ''};
        this.imageUrl = ''
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
          ApplicationAppsState({'state': state}, 'put', id).then((res) => {
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
    getBase64FromImageUrl(url) {
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = url;
        img.onload = function () {
          let canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          let ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);
          // dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        };

      },
      editClick(index, row) {
        this.formData.icon = ''
        this.formData.images = []
        this.dialogFormVisible = true;
        this.editType = 'modify';
        this.formData = this.$_.cloneDeep(row);
        this.imageUrl = this.formData.icon;
        this.getBase64FromImageUrl(this.formData.icon, this.formData.images[0])
        this.imageUrl1 = this.formData.images[0]?''+this.formData.images[0]:'';
        this.imageUrl2 = this.formData.images[1]?''+this.formData.images[1]:'';
        this.imageUrl3 = this.formData.images[2]?''+this.formData.images[2]:'';
      },
      beforeOneUpload(opt) {
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function () {
          that.imageUrl = this.result
        }
      },
      beforeTwoUpload(opt) {
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function () {
          that.imageUrl1 = this.result
        }
      },
      beforeThreeUpload(opt) {
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function () {
          that.imageUrl2 = this.result
        }
      },
      beforefourUpload(opt) {
        let that = this
        let reader = new FileReader()
        reader.readAsDataURL(opt.file)
        reader.onload = function () {
          that.imageUrl3 = this.result
        }
      },
      cancelBtnClick() {
        this.dialogFormVisible = false;
      },
      saveBtnClick() {
        if (this.imageUrl && (this.imageUrl.indexOf("https")===-1)){
          this.formData.icon = this.imageUrl
        }else{
          this.formData.icon = ''
        }

        if (this.imageUrl1 && (this.imageUrl1.indexOf("https")===-1)) {
          this.pics.push(this.imageUrl1)
        }else{
          let str = this.imageUrl1.substring(this.imageUrl1.length-22)
          this.pics.push(str.split('.')[0])
        }

        if (this.imageUrl2 && (this.imageUrl2.indexOf("https")===-1)) {
          this.pics.push(this.imageUrl2)
        }else{
          let str = this.imageUrl2.substring(this.imageUrl2.length-22)
          this.pics.push(str.split('.')[0])
        }

        if (this.imageUrl3 && (this.imageUrl3.indexOf("https")===-1)) {
         this.pics.push(this.imageUrl3)
        }else{
          let str = this.imageUrl3.substring(this.imageUrl3.length-22)
          this.pics.push(str.split('.')[0])
        }
        this.formData.images = this.pics;
        let params = {
          'name': this.formData.name,
          'icon': this.formData.icon,
          'slogan': this.formData.slogan,
          'descs': this.formData.descs,
          'images': this.pics,
          'dsd_val': parseInt(this.formData.dsd_val),
          'url': this.formData.url
        };
        let {name, icon, slogan, descs, images, dsd_val, url} = this.formData;
        if (!name.length || (this.editType==='create'?(!icon.length):false) || !slogan.length || !descs.length || !images.length || !dsd_val || !url.length) {
          this.$message({type: 'error', message: '请完善信息再提交'});
          return;
        }
        this.dialogFormVisible = false;
        ApplicationApps(params,this.editType==='create'?'post':'put',this.editType==='create'?'':this.formData.id).then((res) => {
          if (parseInt(res.res) === 0) {
            this.$message({type: 'success', message: "提交成功",});
            this.initData();
            this.pics = [];
            this.dialogFormVisible = false;
          } else {
            this.$message({type: 'error', message: res.errmsg});
          }
        }).catch(() => {
          this.$message({type: 'error', message: '操作失败',});
        })
      },
      initData() {
        this.getApplicationList()
      },
      getApplicationList() {
        this.loading = true;
        let applicationList = this.applicationSearch
        let params = {
          // id: applicationList.id,
          name: applicationList.name,
          row: this.row,
          page: this.page
        }
        ApplicationApps(params, 'get').then((res) => {
          this.loading = false;
          this.tableData = res.list
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      handleCurrentChange() {
        this.getApplicationList()
      },
    },
  }
</script>

<style lang="less">
  .application_list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .application_list_search {
      display: flex;
      flex-direction: row;
      margin: 20px;
      form {
        width: 100%;
        display: flex;
        flex-direction: row;

        .el-form-item {
          display: flex;
        }

        .addApplication {
          margin-right: 45px;
        }

      }

    }

    .application_list_table {
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
