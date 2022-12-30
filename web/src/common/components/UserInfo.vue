<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
import { User, ArrowDown } from '@element-plus/icons-vue'

const user = useUserStore()
const { name } = user.getUser()
const squareUrl = '@/assets/avatar.png'

const handleCommand = (command: string | number | object) => {
//   ElMessage(`click on item ${command}`)
}
</script>

<template>
    <div class="user-wrapper">
        <div><el-icon><User /></el-icon></div>
        <div><el-avatar shape="square" :size="29" :src="squareUrl" /></div>
        <el-dropdown class="user-dropdown" @command="handleCommand">
            <span class="el-dropdown-link">
                {{name}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
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
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.user-wrapper {
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}
.user-dropdown {
    margin-left: 5px;
    font-size: 18px;
    width: 88px;
}
</style>
  