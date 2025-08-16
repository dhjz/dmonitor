<template>
  <div class="float-menu">
    <el-button type="primary" plain round @click="goPage('/')">CPU内存</el-button>
    <el-button type="primary" class="hide" plain round @click="goPage('/redis')">Redis</el-button>
    <el-button type="primary" class="hide" plain round @click="setFresh">刷新频率</el-button>
  </div>
</template>

<script setup>
import router from '@/router'
const { proxy } = getCurrentInstance();

function goPage(path) {
  router.push(path)
}

function setFresh() {
  let btime = localStorage.getItem('refreshTime') || '10';
  let time = window.prompt('请输入刷新频率（秒）', btime)
  if (!isNaN(time) && time && parseInt(time)> 0) {
    localStorage.setItem('refreshTime', parseInt(time))
    location.reload()
  }
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
}
.float-menu:hover .hide {
  display: block !important;
}
.float-menu .el-button {
  display: block;
  margin-bottom: 10px;
}
</style>