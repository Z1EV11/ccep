<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import type { FormInstance } from 'element-plus'
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';

const user = useUserStore()
const props = defineProps({
  addModalVisible: Boolean
})
const { addModalVisible } =toRefs(props)
const emits = defineEmits(['close-add-modal'])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  usrAccount: '',
  usrPwd0: '',
  usrPwd: '',
  usrPwd1: '',
})
const rules = reactive<FormRules>({
    usrPwd0: [
        {
        required: true,
        message: '请输入旧密码',
        trigger: 'change',
        },
    ],
  usrPwd: [
    {
      required: true,
      message: '请输入8-12位密码',
      trigger: 'change',
    },
  ],
  usrPwd1: [
    {
      required: true,
      message: '请再次输入密码确认',
      trigger: 'change',
    },
  ]
})

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
  formEl!.resetFields()
  emits("close-add-modal")
}

/**
 * ADD User
 */
function addUser() {
  axios({
    method: 'post',
    url: getAPI('/user/change_pwd'),
    data: {
      tk: user.$state.userID,
      usrAccount: ruleForm.usrAccount,
      usrPwd: ruleForm.usrPwd,
    }
  }).then((res)=>{
    emits("close-add-modal")
    if(res.status == 200) {
      ElMessage.success(res.data.msg)
    }
  }).catch((err) => {
    emits("close-add-modal")
    ElMessage.error('修改密码失败')
  })
}
</script>

<template>
    <el-dialog
      :model-value="addModalVisible"
      title="修改密码"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="账号" prop="usrAccount" :label-width="100">
          <el-input v-model="ruleForm.usrAccount" value="wzy" autocomplete="off" clearable style="width: 480px" />
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
          <el-button type="primary" @click="addUser">确定</el-button>
        </span>
      </template>
  </el-dialog>
  </template>