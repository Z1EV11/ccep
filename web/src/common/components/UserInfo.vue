<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { User, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';
import ChangePwdModal from '@/common/components/changePwdModal.vue';


interface User {
  usrAccount: string,
  usrPwd: string,
  usrName: string,
  usrRole: number,
  usrTel: string,
  usrCorp: string
}
const user = useUserStore()
const router = useRouter()
const pwdModalVisible = ref(false)
let changePwdParams = reactive(<User>{
  usrAccount: ''
})
const squareUrl = '@/assets/avatar.png'

const handleCommand = (command: string | number | object) => {
    switch(command) {
        case 'changePwd':
            openChangePwdModal()
            break;
        case 'logout':
            handleLogout()
            break;
    }
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

function openChangePwdModal() {
    changePwdParams.usrAccount = user.$state.userID
    pwdModalVisible.value = true
}

function closeChangePwdModal() {
  pwdModalVisible.value =false
}
</script>

<template>
    <div class="user-wrapper">
        <div class="user-avatar"><el-icon color="#FFFFFF"><User /></el-icon></div>
        <el-dropdown class="user-dropdown" @command="handleCommand" :divided="true">
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
    <ChangePwdModal :pwd-modal-visible="pwdModalVisible" :change-pwd-params="changePwdParams" @close-pwd-modal="closeChangePwdModal" />
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
.user-avatar{
    position: relative;
    top: 2px;
}
.user-dropdown {
    display: inline-flex;
    margin-left: 5px;
    font-size: 18px;
    width: 88px;
    color: rgb(255 255 255) !important;
}
.user-dropdown:hover {
    cursor: pointer;
}
</style>
  