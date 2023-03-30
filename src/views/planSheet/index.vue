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
        <el-form-item label="编码:">
          <el-input v-model="searchForm.benChangCode" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="客户代码:">
          <el-input
            v-model="searchForm.merchantCode"
            placeholder="请输入客户代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户型号:">
          <el-input
            v-model="searchForm.merchantSpe"
            placeholder="请输入客户型号"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
          <el-button type="" size="medium" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="table-box">
      <el-button type="success" size="medium" @click="dialogVisible = !dialogVisible">导入计划单</el-button>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="orderCode" label="计划单号" width="180" />
        <el-table-column prop="benChangCode" label="编码" width="180" />
        <el-table-column prop="merchantCode" label="客户代码" />
        <el-table-column prop="merchantSpe" label="客户型号" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="createTime" label="创建时间" />
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
    <el-dialog
      v-model="dialogVisible"
      title="导入计划单"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-upload
        class="upload-demo"
        :auto-upload="false"
        :on-success="handleUpSuccess"
        :limit="1"
        :on-exceed="handleExceed"
        name="excelFile"
        ref="uploadRef"
        drag
        :action="`${uploadApi}/1.0/saleOrder/importSaleOrder`"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传excel文件</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="medium" @click="dialogVisible = false">取消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="uploadLoading"
            @click="handleUploadSubmit"
          >
            确定上传
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Plan">
import { UploadFilled } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, inject } from "vue";
import { getPlanSheetList } from "@/api/planSheet";

const uploadApi = inject("$uploadApi");
const uploadRef = ref();
const uploadLoading = ref(false);
const dialogVisible = ref(false);
const searchForm = reactive({
  orderCode: "",
  merchantCode: "",
  benChangCode: "",
  merchantSpe: "",
});
const paginationInfo = reactive({
  currentPage: 1,
  pageSize: 10,
});
const pageTotal = ref(0);
const tableData = ref([]);

const getTableList = async () => {
  try {
    const { data } = await getPlanSheetList({ ...searchForm, ...paginationInfo });
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
  searchForm.benChangCode = "";
  searchForm.merchantCode = "";
  searchForm.merchantSpe = "";
};
const handleSizeChange = (val) => {
  paginationInfo.pageSize = val;
  getTableList();
};
const handleCurrentChange = (val) => {
  paginationInfo.currentPage = val;
  getTableList();
};

const handleClose = () => {
  dialogVisible.value = false;
};
onMounted(() => {
  getTableList();
});
const handleExceed = (files) => {
  uploadRef.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value.handleStart(file);
};
const handleUploadSubmit = () => {
  uploadLoading.value = true;
  uploadRef.value.submit();
};
const handleUpSuccess = (res) => {
  if (res.code === "1000") {
    getTableList();
    dialogVisible.value = false;
    ElMessage.success("导入成功");
  } else {
    ElMessage.warning(res.msg);
  }
  uploadLoading.value = false;
};
</script>

<style lang="scss">
.clipboard-container {
  background-color: #fff;

  .copv-wrapper {
    padding-top: 20px;
  }
}
</style>
