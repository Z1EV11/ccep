<script setup lang="ts">
import { ElMessage, type TableProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import AddEvalModal from './components/AddEvalModal.vue'

const addModalVisible = ref(false)
const detailModalVisible = ref(false)
let tableData = ref(<Array<Object>>[])
  // let tableData = ref([])
const pageNo = ref(1)
const pageTotal = ref(0)

onMounted(() => {
  axios({
    method: 'post',
    url: 'http://localhost:3000/ccep/query_prj',
    data: {
      pageNo: pageNo.value,
      pageNum: 20
    }
  }).then((res)=>{
    if(res.status == 200) {
      res.data.prjList && res.data.prjList.forEach((item: any) => {
        tableData.value.push({
          name: item.prj_name,
          type: item.eval_type,
          client: item.eval_client,
          time: item.eval_time,
          expert: item.eval_experts,
          experts: item.eval_experts
        })
      });
      pageTotal.value = res.data.prjList[0].total;
      // ElMessage.success('查询成功')
    } else {
      ElMessage.error('查询失败')
    }
  });
});

/*
  Add PRJ
*/
const openAddModal = () => {
  addModalVisible.value = true
}

const closeAddModal = () => {
  addModalVisible.value = false
}

/*
  Check PRJ
*/
function openDetailModal() {
  detailModalVisible.value = true
}

const closeDetailModal = () => {
  addModalVisible.value = false
}

/*
  Del PRJ
*/
function handleDel() {
  axios({
    method: 'post',
    url: 'http://localhost:3000/ccep/del_prj',
    data: {
      prj_id: '1'
    }
  }).then((res)=>{
    if(res.status == 200) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
    } else {
      ElMessage.error('删除失败')
    }
  });
}

/*
  handle Pagination
*/
const handleCurChange = (val: any) => {
  axios({
    method: 'post',
    url: 'http://localhost:3000/ccep/query_prj',
    data: {
      pageNo: val,
      pageNum: 20
    }
  }).then((res)=>{
    if(res.status == 200) {
      let dataList: Object[] = []
      res.data.prjList.forEach((item: { prj_name: any; eval_type: any; eval_client: any; eval_time: any; eval_experts: any; }) => {
        dataList.push({
          name: item.prj_name,
          type: item.eval_type,
          client: item.eval_client,
          time: item.eval_time,
          expert: item.eval_experts,
          experts: item.eval_experts
        })
      })
      tableData.value = dataList
    } else {
      ElMessage.error('查询失败')
    }
  });
}

/* mock */ 
// tableData = [
//   {
//     name: '重庆信息通信咨询设计院有限公司',
//     type: '估算功能点',
//     client: '重庆信息通信咨询设计院有限公司',
//     time: '2016-05-03',
//     expert: '董立陶',
//     experts: '董立陶'
//   },
// ]
</script>

<template>
  <div class="table-wrapper">
    <div class="table-option-title"><span>项目列表</span></div>
    <div class="table-option-wrapper">
        <el-button type="primary" :icon="Plus" @click="openAddModal">新建项目</el-button>
    </div>
    <div class="table-body-wrapper">
      <el-table :data="tableData" table-layout="auto" stripe  style="width: 100%; height: 840px; font-size: 16px;">
        <template #header>
            <el-input size="small" placeholder="Type to search" />  
        </template>
        <el-table-column prop="name" label="项目名称" min-width="320" />
        <el-table-column prop="type" label="评估类型" min-width="110" />
        <el-table-column prop="client" label="送评单位" min-width="320" />
        <el-table-column prop="time" label="送评时间" min-width="120" />
        <el-table-column prop="expert" label="主评人" min-width="110" />
        <el-table-column prop="experts" label="协评人" min-width="110" />
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default>
            <el-button link type="primary" size="small" @click="openDetailModal">详情</el-button>
            <el-button link type="primary" size="small" @click="handleDel">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        :page-size="20"
        :background="true"
        layout="total, prev, pager, next"
        :total="pageTotal"
        @current-change="handleCurChange"
      />
    </div>
  </div>
  <AddEvalModal class="eval-add-modal" :add-modal-visible="addModalVisible" @close-add-modal="closeAddModal" />
</template>
  
<style scoped>
.table-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  text-align: center;
  height: 100%;
}
.table-option-title {
  display: inline-flex;
  align-items: center;
  width: 40%;
  height: 10%;
  font-size: 36px;
}
.table-option-wrapper {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  width: 60%;
  height: 10%;
  padding-right: 20px;
}
.table-body-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 958px;
  border: 1px solid black;
}
.cell {
  height: 40px;
  font-size: 16px !important;
}
.eval-add-modal {
  width: 650px !important;
}
</style>
