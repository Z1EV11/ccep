<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Menu from '@/components/Menu.vue'
import UserInfo from '@/components/UserInfo.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <nav>
            <div class="logo-wrapper">logo</div>
            <Menu />
            <UserInfo />
        </nav>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout>.el-container{
  height: 100vh;
}
nav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.logo-wrapper {
    width: 20%;
}
</style>
