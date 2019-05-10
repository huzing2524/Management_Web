<template>
  <div class="test">
    <div class="test_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="公司名称">
          <el-input v-model="searchData.name" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item label="测试人手机号">
          <el-input v-model="searchData.phone" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="test_table">
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
          prop="phone"
          label="测试人手机号"
          width="120">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="factory"
          label="公司名称">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="intelligent_degree"
          label="智能化程度"
        >
          <template slot-scope="scope">
            <el-col :span="24" v-for="(descItem,index) in scope.row.intelligent_degree" :key="index">
              <el-button type="text" size="small">{{descItem}}</el-button>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column
          class="images"
          header-align="center"
          align="center"
          prop="score"
          label="综合评分">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="测试时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="test_pagination">
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
  </div>
</template>

<script>
  import {getFullDate} from '_utils/common'
  import {IndustryTest} from '@/utils/api'

  export default {
    data() {
      return {
        getFullDate,
        row: 10,
        page: 1,
        total: 1,
        loading:'',
        searchData:{
          name:'',
          phone:''
        },
        tableData:[]
      }
    },
    mounted() {
      this.getIndustryTestList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getIndustryTestList()
      },
      getIndustryTestList() {
        this.loading = true;
        let searchDataList = this.searchData
        let params = {
          name: searchDataList.name,
          phone: searchDataList.phone,
          row: this.row,
          page: this.page
        }
        IndustryTest(params, 'get').then((res) => {
          this.loading = false;
          this.tableData = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      handleCurrentChange() {
        this.getIndustryTestList()
      },
    },
  }
</script>

<style lang="less">
  .test {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .test_search {
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

    .test_table {
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

    .test_pagination {
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
