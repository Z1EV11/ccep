<script setup lang="ts">
import { reactive, ref, toRefs, defineEmits } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import axios from 'axios';

// import { getAPI } from '@/helper/api';
const props = defineProps({
  addModalVisible: Boolean
})
const { addModalVisible } =toRefs(props)
const emits = defineEmits(['close-add-modal'])

const upload = ref<UploadInstance>()
const form = reactive({
  client: '',
})

/*
  upload EVAL excel
*/
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

/**
 * upload EVAL excel
 */
const submitUpload = () => {
  upload.value!.submit()
}

/**
 * Close Modal
 */
 function clearFiles() {
  upload.value!.clearFiles()
  emits("close-add-modal")
}

/**
 * ADD PRJ
 */
function addPRJ(res: any) {
  const outputFile = res.data.outputFile
  axios({
    method: 'post',
    url: 'http://localhost:3000/ccep/add_prj',
    data: {
      pageNo: 1,
      pageNum: 20
    }
  }).then((res)=>{
    emits("close-add-modal")
    if(res.data.code == 200) {
      ElMessage({
        message: '项目新增成功',
        type: 'success'
      })
    } else {
      ElMessage.error('项目新增失败')
    }
  })
}

</script>

<template>
    <el-dialog
      :model-value="addModalVisible"
      title="新增项目"
      @close="clearFiles"
      >
      <el-form :model="form">
        <el-form-item label="委托方" :label-width="100">
          <el-input v-model="form.client" type="file" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文件上传" :label-width="100">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://localhost:3000/ccep/upload"
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
                限单文件上传, 新文件将会覆盖旧文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clearFiles">取消</el-button>
          <el-button type="primary" @click="submitUpload">确定</el-button>
        </span>
      </template>
  </el-dialog>
  </template>