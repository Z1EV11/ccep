<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, FormInstance } from 'element-plus'
import axios from 'axios';
import { getAPI } from '@/common/utils/api';

const props = defineProps({
  addModalVisible: Boolean
})
const { addModalVisible } =toRefs(props)
const emits = defineEmits(['close-add-modal'])

const ruleFormRef = ref<FormInstance>()
const upload = ref<UploadInstance>()
const ruleForm = reactive({
  prjID: '',
  prjName: '',
  evalMehod: '',
  prjClient: '',
  prjExperts: ''
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
const downloadEvalTemplate = getAPI('/ccep/get_eval_template')

/*
  overwrite previous file
*/
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**
 * Upload EVAL excel
 */
const submitUpload = () => {
  upload.value!.submit()
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
        prjClient: ruleForm.prjClient,
        inputFile: res.data.inputFile,
        outputFile: res.data.outputFile
      }
    }).then((res)=>{
      emits("close-add-modal")
      if(res.status == 200) {
        ElMessage({
          message: '评估已完成，项目新增成功',
          type: 'success'
        })
      } else {
        ElMessage.error('项目新增失败')
      }
    })
  } else {
    ElMessage.error('项目新增失败')
  }
}

// mock
const prjExpertsOptions = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  }
]
</script>

<template>
    <el-dialog
      :model-value="addModalVisible"
      title="新增项目"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" ref="ruleFormRef">
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
        <el-form-item label="评估人" prop="prjExperts" :label-width="100" >
          <el-select
            v-model="ruleForm.prjExperts"
            placeholder=""
            style="width: 240px"
          >
            <el-option
              v-for="item in prjExpertsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文件上传" :label-width="100">
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
                <el-link :href="downloadEvalTemplate" :underline="false" type="primary">软件造价评估结果记录表模板</el-link>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeModal(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitUpload">确定</el-button>
        </span>
      </template>
  </el-dialog>
  </template>