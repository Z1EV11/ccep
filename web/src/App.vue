<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import en from 'element-plus/lib/locale/lang/en'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

// onMounted(() => {
//   document.body.style.setProperty('--el-color-primary', '#142d4b');
//   document.body.style.setProperty('--el-color-primary-light-9', '#4391f1');
//   document.body.style.setProperty('--el-color-primary-light-3', '#2e5687');
// })
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped>

</style>
