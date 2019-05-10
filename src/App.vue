<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  import { Bus, UNAUTHORIZATION } from './utils/common'

  export default {
    name: "admin",
    mounted() {
      Bus.$on(UNAUTHORIZATION, () => {
        this.$router.replace({path: '/login'});
      });
    }
  }
</script>

<style lang="less">
  /**
   * iconfont cdn
   */
  @import "//at.alicdn.com/t/font_907913_j35d1j73oz.css";
  #app {
    width: 100%;
    height: 100%;
  }
</style>
