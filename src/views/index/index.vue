<template>
  <div class="index">
    <header>
      <div class="logo">
        <img :src="Logo">
      </div>
      <p class="title">DSD智能制造</p>
      <div class="user_info">
        <span>{{userName}}</span>
        <span @click="loginOut">退出</span>
        <span v-if="right==='0'" @click="toManager" class="to_manager">管理员列表</span> 
        <span v-else @click="toChangePwd" class="changePwd">修改密码</span> 
      </div>
    </header>
    <div class="main">
      <div class="left_menu">
        <el-menu
          :default-active="$route.path"
          router
          class="el-menu-vertical">
          <el-submenu index="user">
            <template slot="title">
              <i class="icon-user iconfont"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/identify">身份认证</el-menu-item>
            <el-menu-item index="/user/analysis">用户统计分析</el-menu-item>
            <el-menu-item index="/user/dsd">DSD记录</el-menu-item>
            <el-menu-item index="/user/feedback">用户反馈</el-menu-item>
          </el-submenu>
          <el-submenu index="enterprise">
            <template slot="title">
              <i class="icon-qiyeguanli iconfont"></i>
              <span>企业管理</span>
            </template>
            <el-menu-item index="/enterprise/list">企业列表</el-menu-item>
            <!-- <el-menu-item index="/enterprise/make">企业制造管理</el-menu-item> -->
            <el-menu-item index="/enterprise/analysis">企业统计分析</el-menu-item>
            <el-menu-item index="/enterprise/apply">企业申请列表</el-menu-item>
          </el-submenu>
          <el-submenu index="application">
            <template slot="title">
              <i class="icon-qiyeguanli iconfont"></i>
              <span>功能管理</span>
            </template>
            <!-- <el-menu-item index="/application/list">轻应用列表</el-menu-item> -->
            <el-menu-item index="/application/industry">行业＋审核</el-menu-item>
            <el-menu-item index="/application/test">企业智能化测试</el-menu-item>
            <el-menu-item index="/application/database">小D数据库</el-menu-item>
            <el-menu-item index="/application/learning">小D学习任务</el-menu-item>
            <el-menu-item index="/application/use">智能制造使用情况</el-menu-item>
            <el-menu-item index="/application/friends">邀请好友列表</el-menu-item>
            <el-menu-item index="/application/qiye">邀请企业列表</el-menu-item>
            <el-menu-item index="/application/banner">首页Banner</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="container">
        <router-view/>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogPwdFormVisible">
      <el-form ref="form" :model="formData" label-width="120px">
        <el-form-item label="输入原密码">
          <el-input v-model="formData.old_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码">
          <el-input v-model="formData.new_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码">
          <el-input v-model="formData.new_password1" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelPwdBtnClick()">取消</el-button>
          <el-button type="primary" @click="savePwdBtnClick()">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Logo from '../../assets/images/dsd_icon.png'
  import { RightsPassword } from '_utils/api'
  export default {
    data() {
      return {
        Logo,
        dialogPwdFormVisible: false,
        formData:{
          old_password:'',
          new_password:'',
          new_password1:''
        }
      }
    },
    computed: {
      userName() {
        return localStorage.getItem('USERNAME')
      },
      right(){
        return localStorage.getItem('RIGHT')
      }
    },
    mounted() {
      // console.log(this.$route.path)
    },
    methods: {
      // handleOpen(key, keyPath) {
      //   console.log(key, keyPath);
      // },
      // handleClose(key, keyPath) {
      //   console.log(key, keyPath);
      // },
      loginOut() {
        localStorage.clear()
        this.$router.push('/login?url=' + this.$route.fullPath)
      },
      toManager(){
        this.$router.push('/rights')
      },
      toChangePwd(){
        this.dialogPwdFormVisible = true;
      },
      cancelPwdBtnClick(){
        this.dialogPwdFormVisible = false;
      },
      savePwdBtnClick(){
        if(!this.formData.old_password || !this.formData.new_password || !this.formData.new_password1){
          this.$message({type: 'error', message:'请完善信息再提交'});
          return;
        }
        if(this.formData.new_password!==this.formData.new_password1){
          this.$message({type: 'error', message:'两次输入密码不一致'});
          return;
        }
        let params = {
          'old_password': this.formData.old_password,
          'new_password': this.formData.new_password
        }
        RightsPassword(params,'put').then((res) => {
          if(parseInt(res.res) === 0){
            this.$message({type: 'success', message: "修改成功",});
            this.dialogPwdFormVisible = false;
            this.formData = {}
          }else {
            this.$message({type: 'error', message: res.errmsg});
          }
        }).catch(() => {
          this.$message({type: 'error', message: '修改失败',});
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .index{
    width: 100%;
    min-width: 1200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    >header{
      display: flex;
      align-items: center;
      padding: 20px;
      font-size: 20px;
      background: #f7f7f7;
      >.logo{
        width: 30px;
        height: 30px;
        >img{
          width: 100%;
          height: 100%;
        }
      }
      >p.title{
        margin-left: 15px;
        flex: 1;
      }
      >.user_info{
        span:nth-of-type(2){
          margin-left: 10px;
          color: #409EFF;
        }
        .to_manager{
          margin-left: 10px;
          color: #409EFF;
        }
        .changePwd{
          margin-left: 10px;
          color: #409EFF;
        }
      }
    }
    >.main{
      width: 100%;
      height: calc(100% - 70px);
      /*display: flex;*/
      .left_menu{
        width: 200px;
        height: 100%;
        float: left;
        border-right: solid 1px #e6e6e6;
      }
      .container{
        height: 100%;
        margin-left: 200px;
        /*flex: 1;*/
        width: calc(100% - 200px);
        /*padding-left: 200px;*/
      }
    }
  }
  .el-dialog__body{
    .el-form-item{
      margin-bottom: 22px;
      .el-form-item__content{
        line-height: 40px;
        position: relative;
        font-size: 14px;
        .el-button {
          display: inline-block;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          background: #fff;
          border: 1px solid #dcdfe6;
          color: #606266;
          -webkit-appearance: none;
          text-align: center;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          outline: 0;
          margin: 0;
          -webkit-transition: .1s;
          transition: .1s;
          font-weight: 500;
          padding: 12px 20px;
          font-size: 14px;
          border-radius: 4px;
        }
        .el-button--primary{
          color: #fff;
          background-color: #409EFF;
          border-color: #409EFF;
          margin-left: 10px;
        }
      }
    }
  } 
</style>
<style lang="less">
  .el-menu{
    border-right: none;
  }
</style>
