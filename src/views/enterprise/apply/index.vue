<template>
  <div class="apply_list">
    <div class="apply_list_search">
      <el-form :inline="true" :model="applySearch">
        <el-form-item label="手机号">
          <el-input v-model="applySearch.id" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="applySearch.name" placeholder="企业名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="applySearch.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="applySearch.registerDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="apply_list_table">
      <el-table
        :data="applyList"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          prop="id"
          label="申请人手机号"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="user_image"
          label="头像"
          width="50">
          <template slot-scope="scope">
            <a :href="scope.row.user_image" target="_blank">
              <img class="avatar" :src="scope.row.user_image" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="username"
          label="用户名"
          width="100">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="name"
          label="企业名称"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="industry"
          label="所属行业"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="region"
          label="公司地区"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="contact"
          label="联系电话"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="image1"
          label="授权文件照片"
          width="80">
          <template slot-scope="scope">
            <a :href="scope.row.image1" target="_blank">
              <img class="avatar" :src="scope.row.image1" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="image2"
          label="公司营业执照"
          width="80">
          <template slot-scope="scope">
            <a :href="scope.row.image2" target="_blank">
              <img class="avatar" :src="scope.row.image2" alt="">
            </a>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="申请时间"
          width="180">
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="state"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="btn_box" v-if="scope.row.state == 1">
              <el-button type="primary" @click="applyClick(scope.row, 0)">拒绝</el-button>
              <el-button type="primary" @click="applyClick(scope.row, 1)">通过</el-button>
            </div>
            <p v-else-if="scope.row.state == 2">认证失败:{{scope.row.state_msg}}</p>
            <p v-else-if="scope.row.state == 3">认证通过</p>
            <p v-else-if="scope.row.state == 0">未认证</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="apply_pagination">
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
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>是否{{isAgree? '同意' :'拒绝'}}该企业使用智能制造</span>
      <el-input v-model="refuseMsg" placeholder="填写拒绝理由" v-if="!isAgree"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toExamine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { parseDate, ArrangeParams, getFullDate } from '_utils/common'
  import { GetExamineList, ToExamine } from '_utils/api'
  export default {
    data() {
      return {
        getFullDate,
        applySearch: {
          id: '',
          name: '',
          username: '',
          registerDate: ['', ''],
        },
        applyList: [],
        total: 1,
        centerDialogVisible: false,
        isAgree: true,
        refuseMsg: '',
        listItem: {},
        page: 1,
        row: 10,
      }
    },
    mounted() {
      this.getExamineList()
    },
    methods: {
      async getExamineList() {
        try {
          let res = await GetExamineList(ArrangeParams({
            id: this.applySearch.id,
            username: this.applySearch.username,
            name: this.applySearch.name,
            stime: parseDate(this.applySearch.registerDate[0]),
            etime: parseDate(this.applySearch.registerDate[1]),
            page: this.page,
            row: this.row
          }))
          this.applyList = res.data
          this.total = res.total
        } catch (e) {
          this.$message.error('数据获取失败')
        }
      },
      searchBtnClick() {
        this.page = 1
        this.getExamineList()
      },
      handleCurrentChange() {
        this.getExamineList()
      },
      applyClick(item, idx) {
        if (idx === 0) {
          this.isAgree = false
        } else if (idx === 1) {
          this.isAgree = true
        }
        this.listItem = item
        this.centerDialogVisible = true
      },
      toExamine() {
        this.centerDialogVisible = false
        let params = {}
        if (this.isAgree) {
          params = {
            state: 3,
            state_msg: '通过'
          }
        } else {
          params = {
            state: 2,
            state_msg: this.refuseMsg
          }
        }
        ToExamine(params, this.listItem.id).then(res => {
          this.getExamineList()
          if (res.res === 0) {
            this.$message.success('操作成功')
          } else{
            this.$message.error(res.errmsg)
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .apply_list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .apply_list_search{
      margin: 0 10px;
      margin-top: 10px;
    }
    .avatar{
      width: 30px;
      height: 30px;
    }
    .apply_pagination{
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
