<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { genFileId, ElMessage, type FormRules } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, FormInstance } from 'element-plus'
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
const upload = ref<UploadInstance>()
const prjExpertOptions = ref([])
const ruleForm = reactive({
  prjID: '',
  prjName: '',
  evalMehod: 'NESMA_EVAL',
  prjClient: '',
  prjExpert: '',
  inputFile: true
})
const uploadPath = getAPI('/ccep/eval_upload')
const evalMethodOptions = [
  {
    value: 'NESMA_IND',
    label: '功能点指示法',
  },
  {
    value: 'NESMA_EVAL',
    label: '功能点估算法',
  }
]
const downloadEvalTemplate = (evalMehod: string) => {
  if(evalMehod === 'NESMA_IND') return getAPI('/ccep/get_eval_template?t=1')
  else if(evalMehod === 'NESMA_EVAL') return getAPI('/ccep/get_eval_template?t=2')
  else return ''
}
const getTemplateName = (evalMehod: string) => {
  if(evalMehod === 'NESMA_IND') return '功能点指示法'
  else if(evalMehod === 'NESMA_EVAL') return '功能点估算法'
  else return ''
}
const rules = reactive<FormRules>({
  prjID: [
    {
      required: true,
      message: '请输入项目编号',
      trigger: 'blur'
    }
  ],
  prjName: [
    {
      required: true,
      message: '请输入项目名称',
      trigger: 'blur',
    }
  ],
  evalMehod: [
    {
      required: true,
      message: '请选择评估方法',
      trigger: 'blur',
    }
  ],
  prjClient: [
    {
      required: true,
      message: '请输入委托方',
      trigger: 'blur',
    }
  ],
  prjExpert: [
    {
      required: true,
      message: '请选择评估人',
      trigger: 'blur',
    }
  ],
  inputFile: [
    {
      required: true,
      message: '请上传评估文件',
      trigger: 'blur',
    }
  ]
})

/*
  overwrite previous file
*/
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

function queryExpert() {
  axios({
    method: 'post',
    url: getAPI('/user/query_exp'),
    data: {
      tk: user.$state.userID
    }
  }).then((res)=>{
    if(res.status == 200) {
      let dataList: Object[] = []
      res.data.usrList && res.data.usrList.forEach((item: any) => {
        dataList.push({
          value: item.usr_account,
          label: item.usr_name
        })
      })
      prjExpertOptions.value = dataList
    }
  }).catch((err) => {
    ElMessage.error('查询评估专家失败')
  })
}

/**
 * Upload EVAL excel
 */
// const submitUpload = () => {
//   upload.value!.submit()
// }

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      // console.log('submit!')
      upload.value!.submit()
    } else {
      // console.log('error submit!')
      ElMessage.error('请按提示输入信息')
      return false
    }
  })
}

function openModal(formEl: FormInstance | undefined) {
  queryExpert()
}

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
  upload.value!.clearFiles()
  formEl!.resetFields()
  emits("close-add-modal")
}

/**
 * ADD PRJ
 */
function addPRJ(res: any) {
  if(res.status == 200) {
    axios({
      method: 'post',
      url: getAPI('/ccep/add_prj'),
      data: {
        prjID: ruleForm.prjID,
        prjName: ruleForm.prjName,
        evalMehod: ruleForm.evalMehod,
        evalExpert: ruleForm.prjExpert,
        prjClient: ruleForm.prjClient,
        inputFile: res.data.inputFile,
        outputFile: res.data.outputFile
      }
    }).then((res)=>{
      emits("close-add-modal")
      if(res.status == 200) {
        ElMessage({
          message: '已完成评估，项目新增成功',
          type: 'success'
        })
      }
    }).catch((err) => {
      ElMessage.error('项目新增失败')
    })
  } else {
    ElMessage.error('项目新增失败')
  }
}
</script>

<template>
    <el-dialog
      :model-value="addModalVisible"
      title="新增项目"
      @open="openModal(ruleFormRef)"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item label="项目编号" prop="prjID" :label-width="100">
          <el-input v-model="ruleForm.prjID" autocomplete="off" clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="项目名称" prop="prjName" :label-width="100">
          <el-input v-model="ruleForm.prjName" autocomplete="off" clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="委托方" prop="prjClient" :label-width="100">
          <el-input v-model="ruleForm.prjClient" autocomplete="off" clearable style="width: 480px" />
        </el-form-item>
        <el-form-item label="评估方法" prop="evalMehod" :label-width="100" >
          <el-select
            v-model="ruleForm.evalMehod"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in evalMethodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评估人" prop="prjExpert" :label-width="100" >
          <el-select
            v-model="ruleForm.prjExpert"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in prjExpertOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件上传" :label-width="100" prop="inputFile">
          <el-upload
            ref="upload"
            :action=uploadPath
            accept=".xls,.xlsx"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :on-success="addPRJ"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <!-- <el-button class="ml-3" type="success" @click="submitUpload">
              上传评估
            </el-button> -->
            <template #tip>
              <div class="el-upload__tip text-red">
                <el-link :href="downloadEvalTemplate(ruleForm.evalMehod)" :underline="false" type="primary">软件造价评估结果记录表({{getTemplateName(ruleForm.evalMehod)}})模板下载</el-link>
              </div>
            </template>
          </el-upload>
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