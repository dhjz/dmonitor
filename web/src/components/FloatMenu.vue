<template>
  <div class="float-menu">
    <el-button type="primary" plain round @click="goPage('/')">CPU内存</el-button>
    <el-button type="primary" class="hide" plain round @click="goPage('/redis')">Redis</el-button>
  </div>
</template>

<script setup>
import router from '@/router'
const { proxy } = getCurrentInstance();

function goPage(path) {
  router.push(path)
}

</script>

<style scoped>
.hide {
  display: none !important;
}
.float-menu {
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 999;
  display: none;
}
.float-menu:hover .hide {
  display: block !important;
}
.float-menu .el-button {
  display: block;
  margin-bottom: 10px;
}
</style>