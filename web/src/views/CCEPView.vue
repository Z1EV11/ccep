<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Menu from '@/common/components/Menu.vue'
import UserInfo from '@/common/components/UserInfo.vue'

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <nav>
            <div class="logo-wrapper">CQCDI</div>
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
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
}
.logo-wrapper {
    width: 20%;
}
.el-main {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
}
</style>
