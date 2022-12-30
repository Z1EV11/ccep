<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Unlock, Position } from '@element-plus/icons-vue'
import { getAPI } from '@/common/utils/api';
import axios from 'axios';
import { useUserStore } from '@/stores/user';


const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  account: '',
  password: '',
  captcha: ''
})
const captchaURL = ref(getAPI('/captcha'))
const router = useRouter()

const rules = reactive<FormRules>({
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    },
  ],
  password: [
    {
      required: true,
      message: '请输入8-12位密码',
      trigger: 'change',
    },
  ],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'change',
    },
  ]
})

function refreshCaptcha() {
  captchaURL.value = getAPI('/captcha?k='+new Date().getMilliseconds()+Math.floor(Math.random()*1E4))
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const url = getAPI('/user/login')
  axios({
    method: 'post',
    url,
    data: {
      account: ruleForm.account,
      password: ruleForm.password,
      captcha: ruleForm.captcha
    }
  }).then((res) => {
    if(res.status == 200) {
      const user = useUserStore()
      const userData = res.data.usrList[0]
      user.setUser({
        userID: userData.user_account, 
        userName: userData.user_name
      })
      ElMessage.success('登录成功')
      router.push('/evaluation')
    } else {
      ElMessage.error('登录失败')
    }
  })
  // await formEl.validate((valid, fields) => {
  //   if (valid) {
  //     console.log('submit!')
  //   } else {
  //     console.log('error submit!', fields)
  //   }
  // })
}
</script>


<template>
  <div class="login-container">
    <div class="login-left"></div>
    <div class="login-right">
      <div class="login-wrapper draw">
        <div><span>软件造价评估平台 欢迎您！</span></div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="login-form"
          status-icon
        >
          <el-form-item prop="account">
            <el-input v-model="ruleForm.account" :prefix-icon="User" type="text" placeholder="账号" />
          </el-form-item>
          <el-form-item prop="password">
              <el-input v-model="ruleForm.password" :prefix-icon="Unlock" type="password" placeholder="密码" maxlength="12"  :show-password="true" />
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input class="captcha-input" v-model="ruleForm.captcha" :prefix-icon="Position" type="text" minlength="4" maxlength="4"  placeholder="验证码" />
            <el-image :src="captchaURL" fit="contain" @click="refreshCaptcha"/>
          </el-form-item>
          <div class="form-item-wrapper">
              <el-button class="submit-btn" type="primary" @click="onSubmit">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
</div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  margin: 0;
}
.login-left {
  display: flex;;
  width: 500px;
  height: 100%;
}
.login-right {
  display: flex;
  justify-content: center;
  width: 1000px;
  height: 100%;
  border: 1px solid black;
  align-items: center;
}
.login-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 400px;
  border: 1px solid var(--el-color-primary-light-3);
  border-radius: 3px;
}
.login-wrapper>div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30%;
  font-size: 27px;
  color: var(--el-text-color-primary);
  line-height: 130px;
}
.login-form {
  width: 100%;
  height: 70%;
}
.el-form-item {
  margin-bottom: 24px !important;
}
.el-input {
  height: 40px;
  right: 60px !important;
}
.captcha-input {
  width: 60%;
}
.el-image {
  right: 25px;
  height: 40px;
}
.form-item-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 0 auto;
  margin-bottom: 22px;
}
.submit-btn {
  width: 70%;
  height: 38px;
  border-radius: 16px;
}
</style>
