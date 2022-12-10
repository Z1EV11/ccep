<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import zhCn from "element-plus/lib/locale/lang/zh-cn"
import en from 'element-plus/lib/locale/lang/en'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped>

</style>
