<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1"><RouterLink to="/">Home</RouterLink></el-menu-item>
      <el-menu-item index="2"><RouterLink to="/evaluation">成本评估</RouterLink></el-menu-item>
      <el-menu-item index="3"><RouterLink to="/system">系统管理</RouterLink></el-menu-item>
    </el-menu>
  </template>

<style scoped>
.menu {
  width: 70%;
}
</style>
