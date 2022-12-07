<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios';
import { onMounted, ref } from 'vue';
import AddEvalModal from './components/AddEvalModal.vue'

const pageNo = ref(1)
const addModalVisible = ref(false)

onMounted(() => {
  // axios({
  //   method: 'post',
  //   url: 'http://localhost:3000/ccep/query_prj',
  //   data: {
  //     pageNo: 1,
  //     pageNum: 20
  //   }
  // }).then((res)=>{
  //   if(res.data.msg == 200) {
  //     ElMessage({
  //       message: '查询成功',
  //       type: 'success'
  //     })
  //   } else {
  //     ElMessage.error('查询失败')
  //   }
  // });
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
function handleDetail() {
  console.log('查看详情', addModalVisible.value)
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
    if(res.data.msg == 200) {
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
const handleCurrentChange = () => {
  axios({
    method: 'post',
    url: 'http://localhost:3000/ccep/query_prj',
    data: {
      pageNo: 1,
      pageNum: 20
    }
  }).then((res)=>{
    if(res.data.msg == 200) {
      tableData = res.data
    } else {
      ElMessage.error('查询失败')
    }
  });
}

// mock
let tableData = [
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-03',
    name: '重庆信息通信咨询设计院有限公司',
    state: '估算功能点',
    city: 'Los Angeles',
    address: '重庆信息通信咨询设计院有限公司',
    zip: '董立陶',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  }
]
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
        <el-table-column prop="state" label="评估类型" min-width="110" />
        <el-table-column prop="address" label="送评单位" min-width="320" />
        <el-table-column prop="date" label="送评时间" min-width="120" />
        <el-table-column prop="zip" label="主评人" min-width="110" />
        <el-table-column prop="zip" label="协评人" min-width="110" />
        <el-table-column fixed="right" label="操作" min-width="100">
          <template #default>
            <el-button link type="primary" size="small" @click="handleDetail">详情</el-button>
            <el-button link type="primary" size="small" @click="handleDel">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        :page-size="20"
        :background="true"
        layout="total, prev, pager, next"
        :total="100"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <AddEvalModal :add-modal-visible="addModalVisible" @close-add-modal="closeAddModal" />
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
  height: 90%;
  border: 1px solid black;
}
.cell {
  height: 40px;
  font-size: 16px !important;
}
</style>
