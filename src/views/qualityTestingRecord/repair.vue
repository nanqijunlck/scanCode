<template>
  <div class="clipboard-container">
    <el-card :body-style="{ padding: '20px' }">
      <el-form :model="searchForm" :inline="true">
        <el-form-item label="故障编码:">
          <el-input
            v-model="searchForm.repairQuestionCode"
            placeholder="请输入故障编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="medium" @click="handleSearch">查 询</el-button>
          <el-button type="" size="medium" @click="handleReset">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <table-container>
      <template v-slot:content>
        <el-button type="primary" size="medium" @click="handleAddNew()">新 增</el-button>
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column prop="questionCode" label="维修编码" />
          <el-table-column prop="questionContent" label="维修描述" min-width="100" />
          <el-table-column prop="repairQuestionCode" label="故障编码" />
          <el-table-column prop="repairQuestionContent" label="故障内容" />
          <el-table-column prop="updateTime" label="创建时间" min-width="60" />
          <el-table-column prop="createTime" label="更新时间" min-width="60" />
          <el-table-column label="操作" min-width="120">
            <template #default="scope">
              <el-button type="primary" size="medium" @click="handleAdd(scope.row)">新 增</el-button>
              <el-button type="" size="mini" @click="handleEdit(scope.row)"
                >修改</el-button
              >
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
      </template>
    </table-container>
    <el-dialog
      v-model="dialogAdd"
      title="新增维修"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
    <el-dialog
      v-model="dialogVisible"
      title="编辑故障"
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
        <el-form-item label="检测工位" prop="roleCode">
          <el-input
              v-model="formData.roleCode"
              placeholder="请输入检测工位"
          ></el-input>
        </el-form-item>
        <el-form-item label="故障编码" prop="questionCode">
          <el-input
            v-model="formData.questionCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="故障描述" prop="questionContent">
          <el-input
            v-model="formData.questionContent"
          ></el-input>
        </el-form-item>
        <el-form-item label="维修编码" prop="questionCode">
          <el-input
              v-model="formData.repairQuestionCode"
              placeholder="请输入维修编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="维修描述" prop="questionContent">
          <el-input
              v-model="formData.repairQuestionContent"
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
import {useRoute} from 'vue-router';
import { reactive, ref, onMounted } from "vue";
import { getQualityTestingQuestionRepair, deleteOr, addOrUpdateRepair } from "@/api/planSheet";

const route = useRoute();
const scanCodeList = ref(["调试", "老化", "试焊", "综合测试", "维修"]);
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
    const { data } = await getQualityTestingQuestionRepair({
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
  searchForm.repairQuestionCode = route.query.questionCode;
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
  repairQuestionCode:"",
  repairQuestionContent:"",
});

const formRules = reactive({
  questionCode: [{ required: true, message: "请输入故障编号", trigger: "blur" }],
  roleCode: [{ required: true, message: "请选择检测工位", trigger: "change" }],
  questionContent: [{ required: true, message: "请输入故障描述", trigger: "blur" }],
  repairQuestionCode: [{ required: true, message: "请输入维修编码", trigger: "blur" }],
  repairQuestionContent: [{ required: true, message: "请输入维修描述", trigger: "blur" }],
});

const submitLoading = ref(false);

const handleClose = () => {
  ruleFormRef.value.resetFields();
  dialogVisible.value = false;
};

const handleAdd = ({ questionCode, roleCode, questionContent }) => {
  formData.roleCode = roleCode;
  formData.questionCode = questionCode;
  formData.questionContent = questionContent;
  dialogVisible.value = true;
  formRules.value.clearValidate();
};
const handleAddNew = () => {
  formData.roleCode = '';
  formData.questionCode = '';
  formData.questionContent = '';
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
        await addOrUpdateRepair(formData);
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
