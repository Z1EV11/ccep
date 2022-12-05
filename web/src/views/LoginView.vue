<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  account: '',
  password: '',
  captcha: ''
})

const rules = reactive<FormRules>({
  account: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  captcha: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onSubmit = () => {
  
}
</script>


<template>
  <div class="login-container">
    <div class="login-left"></div>
    <div class="login-right">
      <div class="login-wrapper">
        <div><span>软件造价评估平台 欢迎您！</span></div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :inline="true"
          label-width="120px"
          class="login-form"
          status-icon
        >
          <div class="form-item-wrapper">
            <div class="input-wrapper">
              <el-input v-model="ruleForm.account" :prefix-icon="Search" id="account" placeholder="账号" />
            </div>
          </div>
          <div class="form-item-wrapper">
            <div class="input-wrapper">
              <el-input v-model="ruleForm.password" :prefix-icon="Search" id="password"  type="password" placeholder="密码"  :show-password="true" />
            </div>
          </div>
          <div class="form-item-wrapper">
            <div class="input-wrapper">
              <el-input v-model="ruleForm.captcha" :prefix-icon="Search" id="captcha" placeholder="验证码" />

            </div>
          </div>
          <div class="form-item-wrapper">
            <div class="input-wrapper">
              <el-button class="submit-btn" type="primary" @click="onSubmit">登录</el-button>
            </div>
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
  flex-wrap: wrap;
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
  width: 700px;
  height: 100%;
  border: 1px solid black;
  align-items: center;
}
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 400px;
  border: 1px solid var(--el-color-primary-light-3);
  border-radius: 3px;
  /* border: 1px solid black; */
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
.form-item-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin: 0 auto;
  margin-bottom: 22px;
}
.input-wrapper {
  display: flex;
  justify-content: center;
  width: 400px;
  height: 100%;
}
.el-input {
  height: 38px;
  font-size: 16px;
}
.submit-btn {
  width: 100%;
  height: 38px;
  border-radius: 16px;
}
</style>
