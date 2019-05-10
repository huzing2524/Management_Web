<template>
  <div id="mange-all">
    <el-row class="top-menu">
      <el-menu
        :default-active="activeIndex"
        @select="handleSelect"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <span slot="title">身份认证管理</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">企业制造管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">预测注册管理</span>
        </el-menu-item>
      </el-menu>
    </el-row>
    <el-row class="body-content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "manage-all",
    data() {
      return {}
    },
    computed: {
      activeIndex() {
        if (this.$route.path === '/manage/identify') {
          return '1';
        } else if (this.$route.path === '/manage/enterprise') {
          return '2';
        } else if (this.$route.path === '/manage/predication') {
          return '3';
        }
      }
    },
    methods: {
      handleSelect(key) {
        if (key === '1') {
          this.$router.push('/manage/identify');
        } else if (key === '2') {
          this.$router.push('/manage/enterprise');
        } else if (key === '3') {
          this.$router.push('/manage/predication');
        }
      }
    }
  }
</script>

<style lang="less">

  #mange-all {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-menu {
    .el-menu--horizontal {
      display: flex;
      justify-content: center;
    }
  }

  .body-content {
    flex: 1;
  }
</style>
