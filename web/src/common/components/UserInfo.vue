<script lang="ts" setup>
import { User, ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command: string | number | object) => {
//   ElMessage(`click on item ${command}`)
}
const username = 'wzy';
const squareUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
</script>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

<template>
    <div class="user-wrapper">
        <div><el-icon><User /></el-icon></div>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{username}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                <el-dropdown-item command="a">修改密码</el-dropdown-item>
                <el-dropdown-item command="b">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
  </template>

<style scoped>
.user-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 5%;
}
</style>
  