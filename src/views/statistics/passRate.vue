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
        <el-form-item label="检测工位:">
          <el-select v-model="searchForm.roleCode" placeholder="选择检测工位">
            <el-option
              v-for="item in scanCodeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD"
            @change="handleTimeChange"
          />
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
          <el-table-column prop="lastSuccessPercent" label="百分百下线合格率(%)" />
          <el-table-column prop="noQuestionPercent" label="一次性合格率(%)" />
          <el-table-column prop="questionCode" label="商户编码" />
          <el-table-column prop="questionContent" label="故障描述" />
          <el-table-column prop="scanRecordCount" label="扫码记录数" />
          <el-table-column prop="scanRecordErrorCount" label="扫码记录异常数量" />
          <el-table-column prop="scanRecordSuccessCount" label="扫码记录成功数量" />
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
import { getPassRateList } from "@/api/planSheet";

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
    const { data } = await getPassRateList(params);
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
