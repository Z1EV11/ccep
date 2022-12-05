<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

// import { getAPI } from '@/helper/api';

const upload = ref<UploadInstance>()
// const uploadAPI = computed(() => {
//   return getAPI("dev", "/ccep/upload")
// })

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
}
</script>

<template>
    <el-upload
      ref="upload"
      class="upload-demo"
      action="http://localhost:3000/ccep/upload"
      accept=".xls,.xlsx"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="submitUpload">
        上传评估
      </el-button>
      <template #tip>
        <div class="el-upload__tip text-red">
          限单文件上传, 新文件将会覆盖旧文件
        </div>
      </template>
    </el-upload>
  </template>
  