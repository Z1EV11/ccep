<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import type { FormInstance } from 'element-plus'
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';

const user = useUserStore()
interface User {
  usrAccount: string,
  usrPwd: string,
  usrName: string,
  usrRole: number,
  usrTel: string,
  usrCorp: string
}
const md5Key = 'CQCDI'
const { pwdModalVisible, changePwdParams } = defineProps<{
  pwdModalVisible: Boolean,
  changePwdParams: User
}>()
// const { pwdModalVisible } =toRefs(props)
const emits = defineEmits(['close-pwd-modal'])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  usrAccount: '',
  usrPwd0: '',
  usrPwd: '',
  usrPwd1: '',
})
const checkPwd = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请在此输入新密码确认'))
  } else if(value === ruleForm.usrPwd0) {
    return callback(new Error('请确保新密码与旧密码不同'))
  } else {
    callback()
  }
 }
const checkPwd1 = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请在此输入新密码确认'))
  } else if(value === ruleForm.usrPwd) {
    return callback()
  } else {
    callback(new Error('请确认两次密码是否输入一致'))
  }
 }
const rules = reactive<FormRules>({
    usrPwd0: [
      {
        required: true,
        message: '请输入旧密码',
        trigger: 'blur',
      },
      {
        min: 8,
        max: 12,
        message: '请输入8-12位旧密码',
        trigger: 'blur',
      },
    ],
  usrPwd: [
    {
      required: true,
      message: '请输入8-12位新密码',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 12,
      message: '请输入8-12位新密码',
      trigger: 'blur',
    },
    {
      validator: checkPwd,
      trigger: 'blur',
    }
  ],
  usrPwd1: [
    {
      required: true,
      message: '请再次输入新密码确认',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 12,
      message: '请再次输入新密码确认',
      trigger: 'blur',
    },
    {
      validator: checkPwd1,
      trigger: 'blur',
    }
  ]
})

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
  formEl!.resetFields()
  emits("close-pwd-modal")
}

/**
 * Change PWD
 */
 const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      // console.log('submit!')
      changePwd()
    } else {
      // console.log('error submit!')
      ElMessage.error('请按提示输入信息')
      return false
    }
  })
}

function changePwd() {
  axios({
    method: 'post',
    url: getAPI('/user/change_pwd'),
    data: {
      tk: user.$state.userID,
      usrAccount: getAccount(),
      usrPwd0: CryptoJS.MD5(`${ruleForm.usrPwd0}${md5Key}`).toString(),
      usrPwd: CryptoJS.MD5(`${ruleForm.usrPwd}${md5Key}`).toString(),
    }
  }).then((res)=>{
    emits("close-pwd-modal")
    if(res.status == 200) {
      ElMessage.success(res.data.msg)
    }
  }).catch((err) => {
    emits("close-pwd-modal")
    ElMessage.error('修改密码失败')
  })
}

const getAccount = () => {
  let account = changePwdParams.usrAccount || user.$state.userID;
  return account
}
</script>

<template>
    <el-dialog
      :model-value="pwdModalVisible"
      title="修改密码"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="账号" prop="usrAccount" :label-width="100">
          <el-input v-model="ruleForm.usrAccount" :value="getAccount()" autocomplete="off" clearable readonly style="width: 480px" />
        </el-form-item>
        <el-form-item label="旧密码" prop="usrPwd0" :label-width="100">
          <el-input v-model="ruleForm.usrPwd0" autocomplete="off" show-password clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="新密码" prop="usrPwd" :label-width="100">
          <el-input v-model="ruleForm.usrPwd" autocomplete="off" show-password clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="新密码确认" prop="usrPwd1" :label-width="100">
          <el-input v-model="ruleForm.usrPwd1" autocomplete="off" show-password clearable style="width: 480px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeModal(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
        </span>
      </template>
  </el-dialog>
  </template>