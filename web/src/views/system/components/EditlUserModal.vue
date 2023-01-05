<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import axios from 'axios';
import { getAPI } from '@/common/utils/api';
import { useUserStore } from '@/stores/user';

const user = useUserStore()
interface User {
  usrAccount: string,
  usrPwd: string,
  usrName: string,
  usrRole: number,
  usrTel: string,
  usrCorp: string
}
const {editModalVisible, editFormParams } = defineProps<{
  editModalVisible: Boolean,
  editFormParams: User
}>()
// const detailModalVisible = toRefs(props.detailModalVisible)
const emits = defineEmits(['close-edit-modal'])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  usrAccount: '',
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
  usrRole: [
    {
      required: true,
      message: '请选择用户权限',
      trigger: 'blur',
    },
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

function openModal(formEl: FormInstance | undefined) {
  ruleForm.usrAccount = editFormParams.usrAccount
  ruleForm.usrName = editFormParams.usrName
  ruleForm.usrRole = editFormParams.usrRole
  ruleForm.usrTel = editFormParams.usrTel
  ruleForm.usrCorp = editFormParams.usrCorp
}

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
    formEl!.resetFields()
    emits("close-edit-modal")
}

/**
 * Update USR
 */
 const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      // console.log('submit!')
      updateUser()
    } else {
      // console.log('error submit!')
      ElMessage.error('请按提示输入信息')
      return false
    }
  })
}

function updateUser() {
  axios({
    method: 'post',
    url: getAPI('/user/edit_usr'),
    data: {
      tk: user.$state.userID,
      usrAccount: ruleForm.usrAccount,
      usrName: ruleForm.usrName,
      usrRole: ruleForm.usrRole,
      usrTel: ruleForm.usrTel
      // usrCorp: ruleForm.usrCorp
    }
  }).then((res)=>{
    emits("close-edit-modal", true)
    if(res.status == 200) {
      ElMessage.success(res.data.msg)
    }
  }).catch((err) => {
    emits("close-edit-modal", false)
    ElMessage.error('编辑用户失败')
  })
}

</script>

<template>
    <el-dialog
      :model-value="editModalVisible"
      title="项目详情"
      @open="openModal(ruleFormRef)"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="账号" prop="usrAccount" :label-width="100">
          <el-input v-model="ruleForm.usrAccount" autocomplete="off" clearable style="width: 480px" readonly />
        </el-form-item>
        <el-form-item label="姓名" prop="usrName" :label-width="100">
          <el-input v-model="ruleForm.usrName" autocomplete="off" clearable style="width: 480px"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="usrTel" :label-width="100">
          <el-input v-model="ruleForm.usrTel" autocomplete="off" maxlength="11" show-word-limit clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="所属单位" prop="usrCorp" :label-width="100" >
            <el-input v-model="ruleForm.usrCorp" autocomplete="off" clearable style="width: 480px" readonly />
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