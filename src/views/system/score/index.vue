<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="学生" prop="studentId">
        <el-select
          v-model="queryParams.studentId"
          placeholder="请选择学生"
          clearable
          filterable
        >
          <el-option
            v-for="item in studentList"
            :key="item.studentId"
            :label="item.studentName"
            :value="item.studentId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="课程" prop="courseId">
        <el-select
          v-model="queryParams.courseId"
          placeholder="请选择课程"
          clearable
          filterable
        >
          <el-option
            v-for="item in courseOptions"
            :key="item.courseId"
            :label="item.courseName"
            :value="item.courseId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="学期" prop="term">
        <el-input
          v-model="queryParams.term"
          placeholder="请输入学期"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="考试日期" prop="examDate">
        <el-date-picker
          v-model="queryParams.examDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:score:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:score:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:score:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:score:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="scoreList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="成绩ID" align="center" prop="scoreId" />
      <el-table-column label="学生姓名" align="center" prop="studentName" />
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="考试成绩" align="center" prop="score" />
      <el-table-column label="学期" align="center" prop="term" />
      <el-table-column
        label="考试日期"
        align="center"
        prop="examDate"
        width="180"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.examDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:score:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:score:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="scoreRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生" prop="studentId">
          <el-select
            v-model="form.studentId"
            placeholder="请选择学生"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in studentList"
              :key="item.studentId"
              :label="item.studentName"
              :value="item.studentId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="courseId">
          <el-select
            v-model="form.courseId"
            placeholder="请选择课程"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in courseOptions"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试成绩" prop="score">
          <el-input-number
            v-model="form.score"
            :min="0"
            :max="150"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-input v-model="form.term" placeholder="例如：2023秋季" />
        </el-form-item>
        <el-form-item label="考试日期" prop="examDate">
          <el-date-picker
            v-model="form.examDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Score">
import {
  listScore,
  getScore,
  delScore,
  addScore,
  updateScore,
} from "@/api/system/score";
import { listStudent } from "@/api/system/student"; // 确认路径是否正确
import { listCourse } from "@/api/system/course"; // 确认路径是否正确

const { proxy } = getCurrentInstance();

const scoreList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    studentId: null,
    courseId: null,
    score: null,
    term: null,
    examDate: null,
  },
  studentList: [], // 学生下拉选项
  courseOptions: [], // 课程下拉选项
  rules: {
    studentId: [{ required: true, message: "请选择学生", trigger: "change" }],
    courseId: [{ required: true, message: "请选择课程", trigger: "change" }],
    score: [{ required: true, message: "分数不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules, studentList, courseOptions } = toRefs(data);

/** 查询成绩列表 */
function getList() {
  loading.value = true;
  listScore(queryParams.value).then((response) => {
    scoreList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询学生下拉列表 */
function getStudentList() {
  listStudent({ pageNum: 1, pageSize: 1000 }).then((res) => {
    studentList.value = res.rows;
  });
}

/** 查询课程下拉列表 */
function getCourseList() {
  listCourse({ pageNum: 1, pageSize: 1000 }).then((res) => {
    courseOptions.value = res.rows;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    scoreId: null,
    studentId: null,
    courseId: null,
    score: null,
    term: null,
    examDate: null,
    remark: null,
  };
  proxy.resetForm("scoreRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.scoreId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加学生成绩";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _scoreId = row.scoreId || ids.value;
  getScore(_scoreId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学生成绩";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scoreRef"].validate((valid) => {
    if (valid) {
      if (form.value.scoreId != null) {
        updateScore(form.value).then(() => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addScore(form.value).then(() => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _scoreIds = row.scoreId || ids.value;
  proxy.$modal
    .confirm('是否确认删除学生成绩编号为"' + _scoreIds + '"的数据项？')
    .then(function () {
      return delScore(_scoreIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "system/score/export",
    {
      ...queryParams.value,
    },
    `score_${new Date().getTime()}.xlsx`
  );
}

// 初始化数据
getStudentList();
getCourseList();
getList();
</script>
