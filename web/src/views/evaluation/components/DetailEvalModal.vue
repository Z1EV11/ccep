<script setup lang="ts">
import { reactive, ref, toRefs } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { toFinite } from 'lodash-es';
import axios from 'axios';
import { getAPI } from '@/common/utils/api';

interface Project {
[x: string]: any;
  prjID: string,
  prjName: string,
  evalMehod: string,
  prjClient: string,
  evalTime: string,
  prjExperts: string,
  evalPath: string,
  rptPath: string
}
const {detailModalVisible, detailFormParams } = defineProps<{
  detailModalVisible: Boolean,
  detailFormParams: Project
}>()
// const detailModalVisible = toRefs(props.detailModalVisible)
const emits = defineEmits(['close-detail-modal'])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  prjID: '',
  prjName: '',
  evalMehod: '',
  prjClient: '',
  evalTime: '',
  expName: '',
  evalPath: '',
  rptPath: ''
})

/**
 * Close Modal
 */
 function closeModal(formEl: FormInstance | undefined) {
    formEl!.resetFields()
    emits("close-detail-modal")
}

/*
  Download eval file
*/
function getDownloadPath(type: string, filePath: string) {
  var api = ''
  if (type === 'eval_upload') {
    api = `/ccep/get_eval_upload?fileName=${filePath}`
    // return getAPI(api)
  } else if (type === 'eval_rpt') {
    api = `/ccep/get_eval_rpt?fileName=${filePath}`
    // return getAPI(api)
  }
  console.log(getAPI(api))
  return getAPI(api)

}

const getExpInfo = () => {
  const expInfo = `${detailFormParams.expName}  ${detailFormParams.expTel}`
  return expInfo
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
      :model-value="detailModalVisible"
      title="项目详情"
      @close="closeModal(ruleFormRef)"
      :width="650"
      >
      <el-form :model="ruleForm" ref="ruleFormRef">
        <el-form-item label="项目编号" prop="detailModalParams.prjID" :label-width="100">
          <el-input v-model="ruleForm.prjID" autocomplete="off" clearable style="width: 480px" readonly disabled :value="detailFormParams.prjID"/>
        </el-form-item>
        <el-form-item label="项目名称" prop="detailModalParams.prjName" :label-width="100">
          <el-input v-model="ruleForm.prjName" autocomplete="off" clearable style="width: 480px" readonly disabled :value="detailFormParams.prjName"/>
        </el-form-item>
        <el-form-item label="委托方" prop="detailModalParams.prjClient" :label-width="100">
          <el-input v-model="ruleForm.prjClient" autocomplete="off" clearable style="width: 480px" readonly disabled :value="detailFormParams.prjClient"/>
        </el-form-item>
        <el-form-item label="评估方法" prop="detailModalParams.evalMehod" :label-width="100" >
            <el-input v-model="ruleForm.evalMehod" autocomplete="off" clearable style="width: 480px" readonly disabled :value="detailFormParams.evalMehod"/>
        </el-form-item>
        <el-form-item label="评估人" prop="expName" :label-width="100" >
            <el-input v-model="ruleForm.expName" autocomplete="off" clearable style="width: 480px" readonly disabled :value="getExpInfo()"/>
        </el-form-item>
        <el-form-item label="评估文件" prop="evalPath" :label-width="100" >
          <div class="flex justify-space-between mb-4 flex-wrap gap-4">
            <el-link :href="getDownloadPath('eval_upload', detailFormParams.evalPath)" :underline="false" type="primary">{{ detailFormParams.evalPath }}</el-link>
          </div>
        </el-form-item>
        <el-form-item label="评估报告" prop="rptPath" :label-width="100" >
          <div class="flex justify-space-between mb-4 flex-wrap gap-4">
            <el-link :href="getDownloadPath('eval_rpt', detailFormParams.rptPath)" :underline="false" type="primary">{{ detailFormParams.rptPath }}</el-link>
          </div>
        </el-form-item>
      </el-form>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeModal(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="closeModal(ruleFormRef)">确定</el-button>
        </span>
      </template> -->
  </el-dialog>
  </template>