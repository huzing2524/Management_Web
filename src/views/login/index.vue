<template>
  <div id="manage-login" @keyup.enter="submitLogin()">
    <div class="manage-login-form">
      <el-form :model="formData" ref="loginForm" :rules="loginRules" label-width="140px">
        <el-form-item label="用户名/手机号：" prop="username">
          <el-input v-model="formData.username" placeholder="用户名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码：" prop="captcha">
          <el-row>
            <el-col :span="20">
              <el-input v-model="formData.captcha" placeholder="验证码"></el-input>
            </el-col>
            <el-col :offset="1" :span="3">
              <v-captcha @captcha="setCaptchaText"></v-captcha>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checkedRemember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item prop="login">
          <el-button type="primary" @click="submitLogin()" :loading="logining" :disabled="logining">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>


<script>
  import { getBglogin, setDefaultHeader } from '_utils/api'
  import captcha from '_components/captcha';

  export default {
    name: 'manage-login',
    components: {
      'v-captcha': captcha,
    },
    data() {
      return {
        logining: false, // 登录loading
        picTxt: '',
        formData: {
          username: '',
          password: '',
          captcha: '',
        },
        checkedRemember: false,
        loginRules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
          ],
          captcha: [
            {required: true, validator: this.validateCaptcha, trigger: ['blur', 'change']},
          ]
        },
      };
    },

    methods: {
      validateCaptcha(rule, value, callback) {
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else if (value.toLowerCase() !== this.picTxt) {
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      },
      setCaptchaText(picTxt) {
        this.picTxt = picTxt.toLowerCase();
      },
      submitLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            getBglogin({
              username: this.formData.username,
              password: this.formData.password
            }).then((res) => {
              this.logining = false;
              if (parseInt(res.res) === 0) {
                localStorage.setItem('USERNAME', this.formData.username);
                localStorage.setItem('RIGHT', res.right);
                if (this.checkedRemember) {
                  // localStorage.setItem('USERNAME', this.formData.username);
                  localStorage.setItem('PASSWORD', this.formData.password);
                } else {
                  // localStorage.removeItem('USERNAME');
                  localStorage.removeItem('PASSWORD');
                }
                let authorization = 'Basic ' + res.jwt;
                localStorage.setItem('Authorization', authorization);
                setDefaultHeader('Authorization', authorization);
                if (this.$route.query.url) {
                  this.$router.push(this.$route.query.url)
                } else {
                  this.$router.push('/user')
                }
              } else {
                this.$message({type: 'error', message: res.errmsg});
              }
            }).catch(() => {
              this.logining = false;
              this.$message({type: 'error', message: '登录失败'});
            })
          }
        });
      },
    },
    mounted() {
      if (localStorage.getItem('USERNAME')) {
        this.formData.username = localStorage.getItem('USERNAME');
        this.formData.password = localStorage.getItem('PASSWORD');
      }
    },
  };

</script>

<style lang="less">
  @rem: 46.875rem;

  #manage-login {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .manage-login-form {
    margin-top: 10%;
    width: 50%;
  }


</style>




