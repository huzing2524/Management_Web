<template>
  <div class="friends">
    <div class="friends_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="邀请人手机号">
          <el-input v-model="searchData.invite_phone" placeholder="邀请人手机号"></el-input>
        </el-form-item>
        <el-form-item label="被邀请人手机号">
          <el-input v-model="searchData.invited_phone" placeholder="被邀请人手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="friends_table">
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
          prop="invited_name"
          label="被邀请人姓名">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="invited_phone"
          label="被邀请人手机号">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="invite_time"
          label="邀请时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.invite_time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="verify_time"
          label="认证时间">
          <template slot-scope="scope">
            <p v-if="scope.row.verify_time">{{getFullDate(scope.row.verify_time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="reward"
          label="20DSD否获得奖励">
          <template slot-scope="scope">
            <p>{{scope.row.reward==='0'?'20DSD':'否'}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="friends_pagination">
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
  import {InviteFriend} from '@/utils/api'

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
      this.getInviteFriendList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getInviteFriendList()
      },
      getInviteFriendList() {
        this.loading = true;
        let searchDataList = this.searchData
        let params = {
          invite_phone: searchDataList.invite_phone,
          invited_phone: searchDataList.invited_phone,
          row: this.row,
          page: this.page
        }
        InviteFriend(params, 'get').then((res) => {
          this.loading = false;
          this.tableData = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      handleCurrentChange() {
        this.getInviteFriendList()
      },
    },
  }
</script>

<style lang="less">
  .friends {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .friends_search {
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

    .friends_table {
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

    .friends_pagination {
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
