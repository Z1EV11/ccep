<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
import { onMounted, reactive, ref, toRaw } from 'vue';
import AddEvalModal from './components/AddEvalModal.vue'
import DetailEvalModal from './components/DetailEvalModal.vue'
import { useUserStore } from '@/stores/user';
import { getAPI } from '@/common/utils/api';

const user = useUserStore()
const addModalVisible = ref(false)
const detailModalVisible = ref(false)
interface Project {
  prjID: string,
  prjName: string,
  evalMehod: string,
  prjClient: string,
  evalTime: string,
  expName: string,
  expTel: string,
  prjExperts: string, //expertName
  evalPath: string,
  rptPath: string
}
let detailFormParams = reactive(<Project>{
  prjID: '',
  prjName: '',
  evalMehod: '',
  prjClient: '',
  evalTime: '',
  expName: '',
  expTel: '',
  prjExperts: '',
  evalPath: '',
  rptPath: ''
})
let tableData = ref(<Array<Project>>[])
const pageNo = ref(1)
const pageTotal = ref(0)
const evalMehodMap: any = {
  NESMA_IND: '功能点指示法',
  NESMA_EVAL: '功能点估算法'
}

onMounted(() => {
  console.log('onMounted', pageNo.value)
  queryRefresh({
    pageNo: pageNo.value
  })
});

/*
  Query PRJ
*/
function queryRefresh(params: any) {
  console.log('queryRefresh', params)
  axios({
    method: 'post',
    url: getAPI('/ccep/query_prj'),
    data: {
      userID: user.$state.userID,
      pageNo: params.pageNo,
      pageNum: 20
    }
  }).then((res)=>{
    if(res.status == 200) {
      let dataList: Object[] = []
      res.data.prjList && res.data.prjList.forEach((item: any) => {
        dataList.push({
          prjID: item.prj_id,
          prjName: item.prj_name,
          evalMehod: evalMehodMap[item.eval_method],
          prjClient: item.prj_client,
          evalTime: item.eval_time,
          expName: item.usr_name,
          expID: item.usr_account,
          expRole: item.role_id,
          prjExperts: item.eval_experts
        })
      });
      tableData.value = dataList;
      pageTotal.value = res.data.prjList[0] && res.data.prjList[0].total;
      // ElMessage.success('查询成功')
    } else {
      ElMessage.error('查询失败')
    }
  });
}

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
  Details PRJ
*/
function openDetailModal(index: number, row: any) {
  const rowData = toRaw(row)
  axios({
    method: 'post',
    url: getAPI('/ccep/detail_prj'),
    data: {
      prjID: rowData.prjID
    }
  }).then((res)=>{
    if(res.status == 200) {
      const prjData = res.data.prjList[0];
      detailFormParams.prjID = prjData.prj_id
      detailFormParams.prjName = prjData.prj_name
      detailFormParams.evalMehod = evalMehodMap[prjData.eval_method]
      detailFormParams.prjClient = prjData.prj_client
      detailFormParams.evalTime = prjData.eval_time
      // detailModalParams.expert = prjData.eval_experts,
      detailFormParams.expName = prjData.usr_name
      detailFormParams.expTel = prjData.usr_tel
      detailFormParams.evalPath = prjData.eval_path
      detailFormParams.rptPath = prjData.rpt_path
      detailModalVisible.value = true
    } else {
      ElMessage.error('查询详情失败')
    }
  });
}

const closeDetailModal = () => {
  detailModalVisible.value = false
  console.log('closeDetailModal')
}

/*
  Del PRJ
*/
function handleDel(index: number, row: any) {
  const rowData = toRaw(row)
  axios({
    method: 'post',
    url: getAPI('/ccep/del_prj'),
    data: {
      prjID: rowData.prjID
    }
  }).then((res)=>{
    if(res.status == 200) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      console.log('handleDel', pageNo.value)
      queryRefresh({pageNo: 1})
    } else {
      ElMessage.error('删除失败')
    }
  });
}

/*
  handle Pagination
*/
const handleCurChange = (val: number) => {
  console.log('handleCurChange', val)
  queryRefresh({
    pageNo: val
  })
}

const isDeletable = (row: any) => {
  const rowData = toRaw(row)
  let deletable = false
  if(user.$state.userAuth < rowData.expRole || user.$state.userID == rowData.expID) {
    deletable = true
  }
  return deletable
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
        <!-- <template #header>
            <el-input size="small" placeholder="Type to search" />  
        </template> -->
        <el-table-column v-if="true"  prop="prjID" label="id" min-width="320" />
        <el-table-column prop="prjName" label="项目名称" min-width="320" />
        <el-table-column prop="evalMehod" label="评估类型" min-width="110" />
        <el-table-column prop="prjClient" label="送评单位" min-width="320" />
        <el-table-column prop="evalTime" label="送评时间" min-width="120" />
        <el-table-column prop="expName" label="主评人" min-width="110" />
        <!-- <el-table-column prop="experts" label="协评人" min-width="110" /> -->
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default="tableOption">
            <el-button link type="primary" size="small" @click="openDetailModal(tableOption.$index, tableOption.row)">详情</el-button>
            <el-button link type="primary" size="small" @click="handleDel(tableOption.$index, tableOption.row)">删除</el-button>
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
  <DetailEvalModal class="eval-add-modal"
    :detail-modal-visible="detailModalVisible"
    :detail-form-params="detailFormParams"
    @close-detail-modal="closeDetailModal"
  />
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
