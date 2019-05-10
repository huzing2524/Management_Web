<template>
  <div class="user_list">
    <div class="user_list_search">
      <el-form :inline="true" :model="formData">
        <el-form-item label="手机号">
          <el-input v-model="formData.id" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="formData.regDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="DSD数量">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-input v-model="formData.sdsd" placeholder="数量"></el-input>
            </el-col>
            <el-col :span="1">
              -
            </el-col>
            <el-col :span="11">
              <el-input v-model="formData.edsd" placeholder="数量"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="所属企业" style="margin-right: 50px;">
          <el-select v-model="facsVal" placeholder="选择所属企业" clearable>
            <el-option
              v-for="item in facsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user_list_table">
      <el-table
        :data="userListData"
        v-loading="tableLoading"
        border
        style="width: 100%"
        height="600"
      >
        <el-table-column
          prop="rn"
          label="用户ID"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="image"
          label="头像"
          align="center"
          width="180">
          <template slot-scope="scope">
            <a :href="scope.row.image" target="_blank">
              <img class="avatar" :src="scope.row.image" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dsd_val"
          label="DSD数量"
          align="center"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="withdraw_count"
          label="成功提币次数"
          align="center"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="factory"
          label="所属企业"
          align="center"
          width="150px">
        </el-table-column>
        <el-table-column
          prop="state"
          label="身份认证"
          align="center"
          width="150px">
          <template slot-scope="scope">
            <p>{{identifyState(scope.row.state)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          align="center"
          label="注册时间">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user_list_pagination">
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
  import { Countries, getFullDate, ArrangeParams, parseDate,exitSpace } from '@/utils/common'
  import { GetUserList, GetFacNamesList } from '@/utils/api'

  export default {
    data() {
      return {
        countries: Countries,
        getFullDate,
        formData: {
          id: '',
          phone: '',
          username: '',
          dsd_val: '',
          name: '',
          country: '中国',
          regDate: ['', '']
        },
        tableLoading: false,
        row: 10,
        page: 1,
        userListData: [],
        total: 0,
        facsList: [],
        facsVal: ''
      }
    },
    filters: {
    },
    mounted() {
      this.GetFacNamesList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getUserList()
      },
      async getUserList() {
        let formData = this.formData
        let params = {
          id: exitSpace(formData.id),
          name: exitSpace(formData.username),
          stime: parseDate(formData.regDate[0]),
          etime: parseDate(formData.regDate[1]),
          sdsd: formData.sdsd,
          edsd: formData.edsd,
          factory_id: this.facsVal,
          row: this.row,
          page: this.page
        }
        this.tableLoading = true
        try {
          this.tableLoading = false
          let res = await GetUserList(ArrangeParams(params))
          this.userListData = res.data
          this.total = Math.abs(res.total)
        } catch (e) {
          this.tableLoading = false
          this.$message.error('获取数据失败')
        }
      },
      async GetFacNamesList() {
        try {
          let res = await GetFacNamesList()
          this.facsList = res.data
          this.getUserList()
        } catch (e) {
          this.$message.error('获取数据失败')
        }
      },
      handleCurrentChange() {
        this.getUserList()
      },
      identifyState(val) {
        val = Math.floor(val)
        switch (val) {
          case 0:
            return '未认证'
          case 2:
            return '认证未通过'
          case 3:
            return '认证通过'
        }
      }
    }
  }
</script>

<style lang="less">
  .user_list {
    width: 100%;
    /*width: 1000px;*/
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;
    .user_list_search {
      width: 100%;
      margin: 10px 10px 0;
    }
    .avatar{
      width: 30px;
      height: 30px;
    }
    .user_list_table{
      /*width: 100%;*/
      overflow-x: auto;
    }
    .user_list_pagination{
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
