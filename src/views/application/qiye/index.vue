<template>
  <div class="enterprise">
    <div class="enterprise_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="邀请人手机号">
          <el-input v-model="searchData.invite_phone" placeholder="邀请人手机号"></el-input>
        </el-form-item>
        <el-form-item label="超级管理员手机号">
          <el-input v-model="searchData.admin_phone" placeholder="超级管理员手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="enterprise_table">
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
          prop="invite_name"
          label="邀请人姓名"
          width="120">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="invite_phone"
          label="邀请人手机号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="factory"
          label="企业名称">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="admin_phone"
          label="超级管理员手机号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="邀请时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="reward"
          label="是否获得奖励">
          <template slot-scope="scope">
            <p>{{scope.row.reward==='0'?'500DSD':'否'}}</p>
          </template>
        </el-table-column> 
      </el-table>
    </div>
    <div class="enterprise_pagination">
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
  import {getProblemState,getFullDate} from '_utils/common'
  import {InviteFactory} from '@/utils/api'

  export default {
    data() {
      return {
        getFullDate,
        getProblemState,
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
      this.getInviteFactoryList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getInviteFactoryList()
      },
      getInviteFactoryList() {
        this.loading = true;
        let searchDataList = this.searchData
        let params = {
          invite_phone: searchDataList.invite_phone,
          admin_phone: searchDataList.admin_phone,
          row: this.row,
          page: this.page
        }
        InviteFactory(params, 'get').then((res) => {
          this.loading = false;
          this.tableData = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      handleCurrentChange() {
        this.getInviteFactoryList()
      },
    },
  }
</script>

<style lang="less">
  .enterprise {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .enterprise_search {
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

    .enterprise_table {
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

    .enterprise_pagination {
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
