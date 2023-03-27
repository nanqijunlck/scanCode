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
        <el-form-item label="二维码:">
          <el-input v-model="searchForm.qrcode" placeholder="请输入二维码编码"></el-input>
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
    <div class="table-box">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="roleCode" label="二维码" />
        <el-table-column prop="orderCode" label="计划单号" />
        <el-table-column prop="benChangCode" label="编码" />
        <el-table-column prop="merchantCode" label="客户代码" />
        <el-table-column prop="merchantSpe" label="客户型号" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
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
    </div>
  </div>
</template>

<script setup name="QualityTesting">
import { reactive, ref, onMounted, inject } from "vue";
import { getQrCodeList } from "@/api/planSheet";

const searchForm = reactive({
  orderCode: "",
  merchantCode: "",
  benChangCode: "",
  merchantSpe: "",
  qrcode: "",
});
const paginationInfo = reactive({
  currentPage: 1,
  pageSize: 10,
});
const pageTotal = ref(0);
const tableData = ref([]);

const getTableList = async () => {
  try {
    const { data } = await getQrCodeList({ ...searchForm, ...paginationInfo });
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
  searchForm.qrcode = "";
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

const handleDownloadFile = async (row) => {
  try {
    let res = await downloadQrCode(searchForm);
  } catch (error) {
    console.log(error);
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
