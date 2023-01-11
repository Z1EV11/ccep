<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
    <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      :router="true"
      active-text-color="rgb(255 255 255)"
      background-color="#142d4b"
      @select="handleSelect"
    >
      <!-- <el-menu-item index="1"><RouterLink to="/">Home</RouterLink></el-menu-item> -->
      <el-menu-item index="/evaluation">成本评估</el-menu-item>
      <el-menu-item index="/system">用户管理</el-menu-item>
    </el-menu>
  </template>

<style scoped>
.menu {
  width: 70%;
}
</style>
