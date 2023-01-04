<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { User, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';


const user = useUserStore()
const router = useRouter()
const squareUrl = '@/assets/avatar.png'

const handleCommand = (command: string | number | object) => {
    switch(command) {
        case 'changePwd':
            handleChangePwd()
            break;
        case 'logout':
            handleLogout()
            break;
    }
}

function handleChangePwd() {

} 

function handleLogout() {
    const url = getAPI('/user/logout')
    axios({
        method: 'post',
        url,
        data: {
            account: user.$state.userID
        }
    }).then((res) => {
        if(res.status == 200) {
            user.$state.userID = ''
            user.$state.userAuth = ''
            user.$state.userName = ''
            ElMessage.success(res.data.msg)
            router.push('/login')
        }
    }).catch((error) => {
        ElMessage.error(error.response.data.msg)
    });
}
</script>

<template>
    <div class="user-wrapper">
        <div><el-icon><User /></el-icon></div>
        <div><el-avatar shape="square" :size="29" :src="squareUrl" /></div>
        <el-dropdown class="user-dropdown" @command="handleCommand">
            <span class="el-dropdown-link">
                {{user.$state.userName}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
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
  