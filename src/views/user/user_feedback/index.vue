<template>
  <div class="user_feedback">
    <div class="user_feedback_search">
      <el-form :inline="true" :model="feedbackForm">
        <el-form-item label="手机号">
          <el-input v-model="feedbackForm.id" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="feedbackForm.name" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="反馈时间">
          <el-date-picker
            v-model="feedbackForm.feedbackDate"
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
    <div class="user_feedback_table">
      <el-table
        :data="userFeedbackList"
        style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          prop="rn"
          label="用户ID"
        >
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
          header-align="center"
          align="center"
          prop="name"
          label="用户名"
        >
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
          prop="model"
          label="手机型号"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="system"
          label="手机系统"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="operator"
          label="网络"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="content"
          label="反馈内容"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="time"
          label="反馈时间"
        >
          <template slot-scope="scope">
            <p>{{getFullDate(scope.row.time)}}</p>
          </template>
        </el-table-column>
        <el-table-column
          class="images"
          header-align="center"
          align="center"
          prop="images"
          label="反馈图片">
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
          prop="resp"
          label="客服回复"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="state"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.resp">
              <span>已回复</span>
            </div>
            <div class="btn_box" v-else>
              <el-button type="primary" @click="replyClick(scope.row)">回复</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="user_feedback_pagination">
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
      title="回复"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-input v-model="msg" placeholder="请输入回复信息"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toExamine">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getFullDate, parseDate, ArrangeParams, exitSpace } from '_utils/common'
  import { GetFeedbackList,FeedbackResp } from '_utils/api'
  export default {
    data() {
      return {
        getFullDate,
        feedbackForm: {
          id: '',
          name: '',
          feedbackDate: ['', '']
        },
        row: 10,
        page: 1,
        userFeedbackList: [],
        total: 1,
        centerDialogVisible: false,
        msg: '',
        listItem: {},
      }
    },
    mounted() {
      this.getFeedbackList()
    },
    methods: {
      searchBtnClick() {
        this.page = 1
        this.getFeedbackList()
      },
      async getFeedbackList() {
        let feedbackForm = this.feedbackForm
        try {
          let res = await GetFeedbackList(ArrangeParams({
            id: exitSpace(feedbackForm.id),
            name: exitSpace(feedbackForm.name),
            stime: parseDate(feedbackForm.feedbackDate[0]),
            etime: parseDate(feedbackForm.feedbackDate[1]),
            row: this.row,
            page: this.page
          }))
          this.userFeedbackList = res.data
          this.total = res.total
        } catch (e) {
          this.$message.error('获取数据失败')
        }
      },
      handleCurrentChange() {
        this.getFeedbackList()
      },
      replyClick(item){
        this.listItem = item
        this.centerDialogVisible = true
      },
      toExamine() {
        this.centerDialogVisible = false
        let params = {
          id: this.listItem.id,
          msg: this.msg
        }
        if(!this.msg){
          this.$message({
            message: '回复消息不能为空',
            type: 'warning'
          });
          return 
        }
        if(this.msg.length>50){
          this.$message({
            message: '消息长度不能超过50',
            type: 'warning'
          });
          this.msg = ''
          return 
        }
        FeedbackResp(params,'post').then((res) => {
          if (res.res === 0) {
            this.$message.success('操作成功')
            this.getFeedbackList()
            this.msg = ''
          } else{
            this.$message.error(res.errmsg)
          }
        }).catch(() => {
          this.$message.error('操作失败')
        })
        
      }
    }
  }
</script>

<style lang="less">
  .user_feedback {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .user_feedback_search {
      margin: 0 10px;
      margin-top: 10px;
    }
    .user_feedback_table{
      padding-bottom: 50px;
    }
    .avatar{
      width: 30px;
      height: 30px;
    }
    .user_feedback_pagination{
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
