<template>
   <div class="clipboard-container">
      <el-card :body-style="{ padding: '20px' }">
         <el-form :model="searchForm" :inline="true">
            <el-form-item label="计划单号:">
               <el-input v-model="searchForm.orderCode" placeholder="请输入计划单号"></el-input>
            </el-form-item>
           <el-form-item label="编码:">
             <el-input v-model="searchForm.benChangCode" placeholder="请输入编码"></el-input>
           </el-form-item>
            <el-form-item label="客户代码:">
               <el-input v-model="searchForm.merchantCode" placeholder="请输入客户代码"></el-input>
            </el-form-item>
            <el-form-item label="客户型号:">
               <el-input v-model="searchForm.merchantSpe" placeholder="请输入客户型号"></el-input>
            </el-form-item>
            <el-form-item label="二维码:">
               <el-input v-model="searchForm.questionCode" placeholder="请输入二维码"></el-input>
            </el-form-item>
            <el-form-item label="">
               <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
               <el-button type="" size="medium" @click="handleReset">重 置</el-button>
            </el-form-item>
         </el-form>
      </el-card>
      <div class="table-box">
         <el-table :data="tableData" border style="width: 100%">
           <el-table-column prop="qrCode" label="二维码" min-width="200"/>
           <el-table-column prop="orderCode" label="计划单号"/>
           <el-table-column prop="benChangCode" label="编码"/>
           <el-table-column prop="merchantCode" label="客户代码"/>
           <el-table-column prop="merchantSpe" label="客户型号"/>
           <el-table-column prop="roleCode" label="扫码枪编号" min-width="100"/>
           <el-table-column prop="questionContent" label="问题描述" min-width="200"/>
           <el-table-column prop="qualityStatus" label="状态"/>
           <el-table-column prop="createTime" label="创建时间" min-width="180"/>
         </el-table>
         <div class="pagination-box">
            <el-config-provider :locale="zhCn">
                <el-pagination v-model:current-page="paginationInfo.currentPage" v-model:page-size="paginationInfo.pageSize"
               :page-sizes="[10, 20, 50, 100]" :small="small" :disabled="disabled" :background="true"
               layout="total, sizes, prev, pager, next, jumper" :total="pageTotal" @size-change="handleSizeChange"
               @current-change="handleCurrentChange" />
            </el-config-provider>
           
         </div>
      </div>
   </div>
</template>
  
<script setup name="QualityTesting">
import { reactive, ref, onMounted, inject } from 'vue'
import { getQualityTestingRecord } from '@/api/planSheet'
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const searchForm = reactive({
   orderCode: '',
   merchantCode: '',
   benChangCode: '',
   merchantSpe: '',
   questionCode: ''
})
const paginationInfo = reactive({
   currentPage: 1,
   pageSize: 10
})
const pageTotal = ref(0)
const tableData = ref([])

const getTableList = async () => {
   try {
      const { data } = await getQualityTestingRecord({ ...searchForm, ...paginationInfo })
      tableData.value = data.data || []
      pageTotal.value = data.totalCount
   } catch (error) {
      console.log(error);
   }
}
const handleSearch = () => {
   paginationInfo.currentPage = 1
   getTableList()
}
const handleReset = () => {
   searchForm.orderCode= ''
   searchForm.merchantCode = ''
   searchForm.benChangCode = ''
   searchForm.merchantSpe = ''
   searchForm.questionCode = ''
}
const handleSizeChange = (val) => {
   paginationInfo.pageSize = val
   getTableList()
}
const handleCurrentChange = (val) => {
   paginationInfo.currentPage = val
   getTableList()
}

onMounted(() => {
   getTableList()
})
</script>
  
<style lang="scss">
.clipboard-container {
   background-color: #fff;

   .copv-wrapper {
      padding-top: 20px;
   }
}
</style>
  