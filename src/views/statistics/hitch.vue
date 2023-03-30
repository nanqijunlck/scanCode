<template>
  <div class="clipboard-container">
    <el-card :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="计划单号:">
          <el-input
            v-model="searchForm.orderCode"
            placeholder="请输入计划单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户代码:">
          <el-input
            v-model="searchForm.merchantCode"
            placeholder="请输入客户代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="编码:">
          <el-input v-model="searchForm.benChangCode" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="客户型号:">
          <el-input
            v-model="searchForm.merchantSpe"
            placeholder="请输入客户型号"
          ></el-input>
        </el-form-item>
        <el-form-item label="扫码枪编码:">
          <el-select v-model="searchForm.roleCode" placeholder="选择扫码枪编码">
            <el-option
              v-for="item in scanCodeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <el-config-provider :locale="zhCn">
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYY-MM-DD"
              @change="handleTimeChange"
            />
          </el-config-provider>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
          <el-button type="" size="medium" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <table-container>
      <template v-slot:content>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="questionCode" label="问题编码" />
          <el-table-column prop="questionCount" label="问题数量" />
          <el-table-column prop="questionContent" label="问题描述" min-width="200" />
          <el-table-column prop="questionPercent" label="百分比" />
        </el-table>
        <div class="pagination-box">
          <el-pagination
            v-model:current-page="paginationInfo.currentPage"
            v-model:page-size="paginationInfo.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="small"
            :disabled="disabled"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>
    </table-container>
  </div>
</template>

<script setup name="QualityTesting">
import { reactive, ref, onMounted, inject } from "vue";
import { getHitchList } from "@/api/planSheet";

const scanCodeList = inject("$scanCode");
const searchForm = reactive({
  orderCode: "",
  merchantCode: "",
  benChangCode: "",
  merchantSpe: "",
  questionCode: "",
  roleCode: "",
  startTime: "",
  endTime: "",
});
const paginationInfo = reactive({
  currentPage: 1,
  pageSize: 10,
});
const pageTotal = ref(0);
const tableData = ref([]);
const time = ref([]);

const getTableList = async () => {
  try {
    let params = {
      ...searchForm,
      ...paginationInfo,
    };
    const { data } = await getHitchList(params);
    tableData.value = data.data || [];
    pageTotal.value = data.totalCount;
  } catch (error) {
    console.log(error);
  }
};
const handleSearch = () => {
  paginationInfo.currentPage = 1;
  getTableList();
};
const handleReset = () => {
  searchForm.orderCode = "";
  searchForm.merchantCode = "";
  searchForm.benChangCode = "";
  searchForm.merchantSpe = "";
  searchForm.questionCode = "";
};
const handleSizeChange = (val) => {
  paginationInfo.pageSize = val;
  getTableList();
};
const handleCurrentChange = (val) => {
  paginationInfo.currentPage = val;
  getTableList();
};
const handleTimeChange = (val) => {
  if (val?.length > 0) {
    searchForm.startTime = val[0];
    searchForm.endTime = val[1];
  } else {
    searchForm.startTime = "";
    searchForm.endTime = "";
  }
};
onMounted(() => {
  getTableList();
});
</script>

<style lang="scss">
.clipboard-container {
  background-color: #fff;

  .copv-wrapper {
    padding-top: 20px;
  }
}
</style>
