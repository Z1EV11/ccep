<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useUserStore } from '@/stores/user';
import AddUsrModal from './components/AddUserModal.vue'
import DetailEvalModal from './components/EditlUserModal.vue'
import { getAPI } from '@/common/utils/api';

const user = useUserStore()
const addModalVisible = ref(false)
const detailModalVisible = ref(false)
interface User {
  usrAccount: string,
  usrPwd: string,
  usrName: string,
  usrRole: string,
  usrTel: string,
  usrCorp: string
}
let detailFormParams = reactive(<User>{
  usrAccount: '',
  usrPwd: '',
  usrName: '',
  usrRole: '',
  usrTel: '',
  usrCorp: ''
})
let tableData = ref(<Array<User>>[])
const pageNo = ref(1)
const pageTotal = ref(0)

onMounted(() => {
  queryRefresh({
    pageNo: pageNo.value
  })
});

/*
  Query User
*/
function queryRefresh(params: any) {
  axios({
    method: 'post',
    url: getAPI('/user/query_usr'),
    data: {
      id: user.$state.userID,
      pageNo: params.pageNo,
      pageNum: 20
    }
  }).then((res)=>{
    if(res.status == 200) {
      let dataList: Object[] = []
      res.data.usrList && res.data.usrList.forEach((item: any) => {
        dataList.push({
          usrAccount: item.usr_account,
          usrName: item.usr_name,
          roleName: item.role_name,
          usrTel: item.usr_tel,
          usrCorp: item.role_corp,
          usrRole: item.role_id
        })
      });
      tableData.value = dataList;
      pageTotal.value = res.data.usrList[0].total;
      // ElMessage.success('查询成功')
    } else {
      ElMessage.error('查询失败')
    }
  });
}

/*
  Add PRJ
*/
const openAddUserModal = () => {
  addModalVisible.value = true
}

const closeAddUserModal = (isAdded: boolean) => {
  addModalVisible.value = false
  queryRefresh({
    pageNo: pageNo.value
  })
}

/*
  Details PRJ
*/
function openEditUserModal(row: any) {
  const rowData = toRaw(row)
  axios({
    method: 'post',
    url: getAPI('/ccep/detail_prj'),
    data: {
      prjID: rowData.prjID
    }
  }).then((res) => {
    if(res.status == 200) {
      const usrData = res.data.usrList[0];
      detailFormParams.prjID = usrData.prj_id,
      detailFormParams.prjName = usrData.prj_name,
      detailFormParams.evalMehod = usrData.eval_method,
      detailFormParams.prjClient = usrData.prj_client,
      detailFormParams.evalTime = usrData.eval_time,
      // detailModalParams.expert = prjData.eval_experts,
      detailFormParams.prjExperts = usrData.eval_experts
      detailFormParams.evalPath = usrData.eval_path
      detailFormParams.rptPath = usrData.rpt_path
      detailModalVisible.value = true
    } else {
      ElMessage.error('查询详情失败')
    }
  });
}

const closeEditUserModal = () => {
  detailModalVisible.value = false
  console.log('closeDetailModal')
}

/*
  Del PRJ
*/
function handleDel(row: any) {
  const rowData = toRaw(row)
  axios({
    method: 'post',
    url: getAPI('/user/del_usr'),
    data: {
      tk: user.$state.userID,
      usrAccount: rowData.usrAccount
    }
  }).then((res)=>{
    if(res.status == 200) {
      ElMessage.success(res.data.msg)
      queryRefresh({pageNo: 1})
    }
  }).catch((err) => {
    ElMessage.error('删除用户失败')
  });
}

const isEditable = (row: any) => {
  const rowData = toRaw(row)
  let editable = false
  if(user.$state.userAuth < rowData.usrRole || user.$state.userID == rowData.usrAccount) {
    editable = true
  }
  return editable
}

/*
  handle Pagination
*/
const handleCurChange = (val: any) => {
  queryRefresh({
    pageNo: val
  })
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
    <div class="table-option-title"><span>用户列表</span></div>
    <div class="table-option-wrapper">
        <el-button type="primary" :icon="Plus" @click="openAddUserModal">添加用户</el-button>
    </div>
    <div class="table-body-wrapper">
      <el-table :data="tableData" table-layout="auto" stripe  style="width: 100%; height: 840px; font-size: 16px;">
        <!-- <template #header>
            <el-input size="small" placeholder="Type to search" />  
        </template> -->
        <el-table-column prop="usrName" label="姓名" min-width="220" />
        <el-table-column prop="usrTel" label="联系电话" min-width="220" />
        <el-table-column prop="usrCorp" label="所属单位" min-width="320" />
        <el-table-column v-if="true" prop="usrAccount" label="账号" min-width="110" />
        <el-table-column v-if="false" prop="usrRole" label="" min-width="110" />
        <el-table-column prop="roleName" label="角色" min-width="110" />
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="tableOption">
            <div v-if="isEditable(tableOption.row)">
              <el-button link type="primary" size="small" @click="openEditUserModal(tableOption.row)">编辑</el-button>
              <el-button link type="primary" size="small" @click="openEditUserModal(tableOption.row)">修改密码</el-button>
              <el-button link type="primary" size="small" @click="handleDel(tableOption.row)">删除</el-button>
            </div>
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
  <AddUsrModal class="usr-add-modal" :add-modal-visible="addModalVisible" @close-add-modal="closeAddUserModal" />
  
  <!-- <DetailEvalModal class="eval-add-modal"
    :detail-modal-visible="detailModalVisible"
    :detail-form-params="detailFormParams"
    @close-detail-modal="closeEditUserModal"
  /> -->
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
