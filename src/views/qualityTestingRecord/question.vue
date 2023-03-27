<template>
  <div class="clipboard-container">
    <el-card :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="扫码枪编号:">
          <el-select
            v-model="searchForm.roleCode"
            placeholder="选择扫码枪编码"
            clearable
            @clear="searchForm.roleCode = ''"
          >
            <el-option
              v-for="item in scanCodeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input
            v-model="searchForm.questionCode"
            placeholder="请输入问题编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
          <el-button type="" size="medium" @click="handleReset">重 置</el-button>
          <el-button type="primary" size="medium" @click="handleAdd">新 增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="table-box">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="roleCode" label="扫码枪编号" />
        <el-table-column prop="questionCode" label="问题编码" />
        <el-table-column prop="questionContent" label="问题描述" min-width="100" />
        <el-table-column prop="updateTime" label="创建时间" min-width="60" />
        <el-table-column prop="createTime" label="更新时间" min-width="60" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="" size="mini" @click="handleEdit(scope.row)">修改</el-button>
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              title="是否确认删除?"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
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
      title="编辑问题"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        size="medium"
        ref="ruleFormRef"
        label-width="120"
      >
        <el-form-item label="扫码枪编号" prop="roleCode">
          <el-select v-model="formData.roleCode" placeholder="选择扫码枪编码">
            <el-option
              v-for="item in scanCodeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题编码" prop="questionCode">
          <el-input
            v-model="formData.questionCode"
            placeholder="请输入问题编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="questionContent">
          <el-input
            v-model="formData.questionContent"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="medium">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            size="medium"
            @click="handleSubmit(ruleFormRef)"
          >
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TestingQuestion">
import { reactive, ref, onMounted } from "vue";
import { getQualityTestingQuestion, deleteOr, addOrUpdate } from "@/api/planSheet";

const scanCodeList = ref(["1号枪", "2号枪", "3号枪", "4号枪"]);
const loading = ref(false);
const dialogVisible = ref(false);
const searchForm = reactive({
  roleCode: "",
  questionCode: "",
  questionContent: "",
});
const paginationInfo = reactive({
  currentPage: 1,
  pageSize: 10,
});
const pageTotal = ref(0);
const tableData = ref([]);
const time = ref([]);

const getTableList = async () => {
  loading.value = true;
  try {
    const { data } = await getQualityTestingQuestion({
      ...searchForm,
      ...paginationInfo,
    });
    tableData.value = data.data || [];
    pageTotal.value = data.totalCount;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const handleSearch = () => {
  paginationInfo.currentPage = 1;
  getTableList();
};
const handleReset = () => {
  searchForm.questionContent = "";
  searchForm.roleCode = "";
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

onMounted(() => {
  getTableList();
});

const handleDelete = async (row) => {
  try {
    await deleteOr({ id: row.id });
    getTableList();
  } catch (error) {
    console.log(error);
  }
};

const ruleFormRef = ref();
const formData = reactive({
  questionCode: "",
  roleCode: "",
  questionContent: "",
});

const formRules = reactive({
  questionCode: [{ required: true, message: "请输入问题编号", trigger: "blur" }],
  roleCode: [{ required: true, message: "请选择扫码枪编码", trigger: "change" }],
  questionContent: [{ required: true, message: "请输入问题描述", trigger: "blur" }],
});

const submitLoading = ref(false);

const handleClose = () => {
  ruleFormRef.value.resetFields();
  dialogVisible.value = false;
};

const handleAdd = () => {
  formData.roleCode = "";
  formData.questionCode = "";
  formData.questionContent = "";
  dialogVisible.value = true;
  formRules.value.clearValidate();
};

const handleEdit = ({ questionCode, roleCode, questionContent, id }) => {
  formData.roleCode = roleCode;
  formData.questionCode = questionCode;
  formData.questionContent = questionContent;
  formData.id = id;
  dialogVisible.value = true;
  formRules.value.clearValidate();
};

const handleSubmit = (formEl) => {
  formEl.validate(async (valid, field) => {
    if (valid) {
      try {
        submitLoading.value = true;
        await addOrUpdate(formData);
        getTableList();
        dialogVisible.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        submitLoading.value = false;
      }
    }
  });
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
