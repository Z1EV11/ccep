<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/assessment">评估</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView /> -->
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="Approved by">
            <el-input placeholder="Approved by" />
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-select  placeholder="Activity zone">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">Query</el-button>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
#app {
  height: 100%;
  width: 100%;
}
</style>
