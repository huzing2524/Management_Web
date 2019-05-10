<template>
  <div class="user_dsd">
    <div class="user_dsd_search">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="手机号">
          <el-input v-model="searchForm.id" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.name" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="searchForm.dsdTypeVal" placeholder="类型">
            <el-option
              v-for="(item, index) in dsdType"
              :label="item.title"
              :value="item.val"
              :key="index">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="DSD数量">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-input v-model="searchForm.sdsd" placeholder="DSD数量"></el-input>
            </el-col>
            <el-col :span="1">
              -
            </el-col>
            <el-col :span="11">
              <el-input v-model="searchForm.edsd" placeholder="DSD数量"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="所属企业" style="margin-right: 50px;">
          <el-select v-model="searchForm.facsVal" placeholder="选择所属企业" clearable>
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
        <el-button style="margin-left: 50px;" type="primary" @click="showGiftDsdDialog">系统赠送</el-button>
      </el-form>
    </div>
    <div class="user_dsd_table">
      <el-table
        :data="userDsdList">
        <el-table-column
          prop="rn"
          label="用户ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="image"
          label="头像"
          width="180">
          <template slot-scope="scope">
            <a :href="scope.row.image" target="_blank">
              <img class="avatar" :src="scope.row.image" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="dsd_val"
          label="数量"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="type"
          label="类型"
        >
          <template slot-scope="scope">
            <p>{{scope.row.type | getDesByType}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="获得时间"
        >
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="phone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="factory"
          label="所属企业"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="user_dsd_pagination">
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
    <el-dialog
      title="赠送DSD"
      :visible.sync="showDialog"
      width="30%"
      center>
      <el-input v-model="giftVal.phone" placeholder="手机号" clearable style="margin-bottom: 20px;"></el-input>
      <el-input v-model="giftVal.num" placeholder="数量" clearable></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showDialog = false">取 消</el-button>
    <el-button type="primary" @click="giftDsd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getFullDate, ArrangeParams } from '_utils/common'
  import { GetFacNamesList, GetDsdList, GrantDsd } from '_utils/api'
  export default {
    data() {
      return {
        getFullDate,
        dsdType: [
          {
            val: 'registe',
            title: '注册赠送'
          },
          {
            val: 'invite',
            title: '邀请好友'
          },
          {
            val: 'withdraw',
            title: '提现'
          },
          {
            val: 'withdraw_gas',
            title: '提现手续费'
          },
          {
            val: 'activity',
            title: '挖矿'
          },
          {
            val: 'system',
            title: '系统赠送'
          },
        ],
        searchForm: {
          id: '',
          name: '',
          sdsd: '',
          edsd: '',
          facsVal: '',
          dsdTypeVal: ''
        },
        facsList: [],
        userDsdList: [],
        total: 0,
        row: 10,
        page: 1,
        giftVal: {
          phone: '',
          num: ''
        },
        showDialog: false
      }
    },
    filters:{
      getDesByType(val){
        switch (val) {
          case 'registe':
            return '注册赠送'
          case 'invite':
            return '邀请好友'
          case 'withdraw':
            return '提现'
          case 'withdraw_gas':
            return '提现手续费';
          case 'system':
            return '系统赠送';
          default:
            return '挖矿'
        }
      }
    },
    mounted() {
      this.GetFacNamesList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getUserDsd()
      },
      async GetFacNamesList() {
        try {
          let res = await GetFacNamesList()
          this.facsList = res.data
          this.getUserDsd()
        } catch (e) {
          this.$message.error('获取数据失败')
        }
      },
      async getUserDsd() {
        let searchForm = this.searchForm
        try {
          let res = await GetDsdList(ArrangeParams({
            id: searchForm.id,
            name: searchForm.name,
            type: searchForm.dsdTypeVal,
            sdsd: searchForm.sdsd,
            edsd: searchForm.edsd,
            factory_id: searchForm.facsVal,
            row: this.row,
            page: this.page
          }))
          this.userDsdList = res.data
          this.total = res.total
        } catch (e) {
          this.$message.error('获取数据失败')
        }
      },
      handleCurrentChange() {
        this.getUserDsd()
      },
      showGiftDsdDialog() {
        this.showDialog = true
      },
      giftDsd() {
        this.showDialog = false
        if (!this.giftVal.phone || !this.giftVal.num) {
          this.$message.warning('请输入正确的信息')
          return
        }
        GrantDsd({
          id: this.giftVal.phone,
          dsd_val: this.giftVal.num
        }).then(res => {
          if (res.res === 0) {
            this.$message.success('赠送成功')
          } else {
            this.$message.error(res.errmsg)
          }
        }).catch(() => {
          this.$message.error('系统错误')
        })
      }
    }
  }
</script>

<style lang="less">
  .user_dsd {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;
    .user_dsd_search {
      width: 100%;
      margin: 10px 10px 0;
    }
    .avatar{
      width: 30px;
      height: 30px;
    }
    .user_dsd_table{
      overflow-x: auto;
    }
    .user_dsd_pagination{
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
