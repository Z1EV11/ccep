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
  usrPwd: '',
  usrPwd1: '',
  usrName: '',
  usrRole: 2,
  usrTel: '',
  usrCorp: ''
})
const rules = reactive<FormRules>({
  usrAccount: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    },
    {
      min: 3,
      message: '账号至少满足3位',
      trigger: 'blur'
    }
  ],
  usrPwd: [
    {
      required: true,
      message: '请输入8-12位密码',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 12,
      message: '请输入8-12位密码',
      trigger: 'blur',
    },
  ],
  usrPwd1: [
    {
      required: true,
      message: '请输入8-12位密码确认',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 12,
      message: '请输入8-12位密码确认',
      trigger: 'blur',
    },
  ],
  usrName: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur',
    },
    {
      min: 2,
      message: '姓名至少2位',
      trigger: 'change',
    }
  ],
  usrTel: [
    {
      required: true,
      message: '请输入联系方式',
      trigger: 'blur',
    },
    {
      min: 11,
      max: 11,
      message: '请输入11位手机号',
      trigger: 'chagne',
    }
  ],
  usrCorp: [
    {
      required: true,
      message: '请输入所属单位',
      trigger: 'blur',
    },
  ],
  usrRole: [
    {
      required: true
    },
  ]
})
const roleOptions = [
  {
    value: 1,
    label: '管理员',
  },
  {
    value: 2,
    label: '普通用户',
  }
]

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
  formEl!.resetFields()
  emits("close-add-modal", false)
}

/**
 * ADD User
 */
 const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      // console.log('submit!')
      addUser()
    } else {
      // console.log('error submit!')
      ElMessage.error('请按提示输入信息')
      return false
    }
  })
}

function addUser() {
  axios({
    method: 'post',
    url: getAPI('/user/add_usr'),
    data: {
      tk: user.$state.userID,
      usrAccount: ruleForm.usrAccount,
      usrPwd: ruleForm.usrPwd,
      usrName: ruleForm.usrName,
      usrRole: ruleForm.usrRole,
      usrTel: ruleForm.usrTel
      // usrCorp: ruleForm.usrCorp
    }
  }).then((res)=>{
    emits("close-add-modal", true)
    if(res.status == 200) {
      ElMessage.success(res.data.msg)
    }
  }).catch((err) => {
    emits("close-add-modal", false)
    ElMessage.error('用户添加失败')
  })
}
</script>

<template>
    <el-dialog
      :model-value="addModalVisible"
      title="添加用户"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="账号" prop="usrAccount" :label-width="100">
          <el-input v-model="ruleForm.usrAccount" autocomplete="off" clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="密码" prop="usrPwd" :label-width="100">
          <el-input v-model="ruleForm.usrPwd" autocomplete="off" show-password clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="密码确认" prop="usrPwd1" :label-width="100">
          <el-input v-model="ruleForm.usrPwd1" autocomplete="off" show-password clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="姓名" prop="usrName" :label-width="100">
          <el-input v-model="ruleForm.usrName" autocomplete="off" clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="联系方式" prop="usrTel" :label-width="100">
          <el-input v-model="ruleForm.usrTel" autocomplete="off" clearable maxlength="11" show-word-limit style="width: 480px" />
        </el-form-item>
        <el-form-item label="权限" prop="usrRole" :label-width="100" >
          <el-select
            v-model="ruleForm.usrRole"
            style="width: 240px"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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