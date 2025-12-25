<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="归属班级" prop="classId">
        <el-select
          v-model="queryParams.classId"
          placeholder="请选择班级"
          clearable
          filterable
        >
          <el-option
            v-for="item in classOptions"
            :key="item.classId"
            :label="item.className"
            :value="item.classId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入学生姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学号" prop="studentNumber">
        <el-input
          v-model="queryParams.studentNumber"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="queryParams.gender"
          placeholder="请选择性别"
          clearable
        >
          <el-option
            v-for="dict in sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          clearable
          v-model="queryParams.birthday"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择出生日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入家庭住址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入学日期" prop="enrollmentDate">
        <el-date-picker
          clearable
          v-model="queryParams.enrollmentDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择入学日期"
        >
        </el-date-picker>
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
          v-hasPermi="['system:student:add']"
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
          v-hasPermi="['system:student:edit']"
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
          v-hasPermi="['system:student:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:student:export']"
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
      :data="studentList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生ID" align="center" prop="studentId" />
      <el-table-column label="学生姓名" align="center" prop="studentName" />
      <el-table-column label="学号" align="center" prop="studentNumber" />
      <el-table-column label="性别" align="center" prop="gender">
        <template #default="scope">
          <dict-tag :options="sys_user_sex" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column
        label="出生日期"
        align="center"
        prop="birthday"
        width="120"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.birthday, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column
        label="入学日期"
        align="center"
        prop="enrollmentDate"
        width="120"
      >
        <template #default="scope">
          <span>{{ parseTime(scope.row.enrollmentDate, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
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
            v-hasPermi="['system:student:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:student:remove']"
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
      <el-form ref="studentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="归属班级" prop="classId">
          <el-select
            v-model="form.classId"
            placeholder="请选择班级"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in classOptions"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="form.studentNumber" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio
              v-for="dict in sys_user_sex"
              :key="dict.value"
              :value="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            clearable
            v-model="form.birthday"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择出生日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-form-item label="入学日期" prop="enrollmentDate">
          <el-date-picker
            clearable
            v-model="form.enrollmentDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择入学日期"
            style="width: 100%"
          >
          </el-date-picker>
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

<script setup name="Student">
import {
  listStudent,
  getStudent,
  delStudent,
  addStudent,
  updateStudent,
  getClassList,
} from "@/api/system/student";

const { proxy } = getCurrentInstance();
const { sys_user_sex } = proxy.useDict("sys_user_sex");

const studentList = ref([]);
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
    classId: null,
    studentName: null,
    studentNumber: null,
    gender: null,
    birthday: null,
    phone: null,
    email: null,
    address: null,
    enrollmentDate: null,
  },
  classOptions: [], // 班级选项存放在 reactive 里
  rules: {
    classId: [{ required: true, message: "班级不能为空", trigger: "change" }],
    studentName: [
      { required: true, message: "学生姓名不能为空", trigger: "blur" },
    ],
    studentNumber: [
      { required: true, message: "学号不能为空", trigger: "blur" },
    ],
  },
});

// 核心修复：这里要把 classOptions 也解构出来供模板使用
const { queryParams, form, rules, classOptions } = toRefs(data);

/** 查询学生信息列表 */
function getList() {
  loading.value = true;
  listStudent(queryParams.value).then((response) => {
    studentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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
    studentId: null,
    classId: null,
    studentName: null,
    studentNumber: null,
    gender: null,
    birthday: null,
    phone: null,
    email: null,
    address: null,
    enrollmentDate: null,
    remark: null,
  };
  proxy.resetForm("studentRef");
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
  ids.value = selection.map((item) => item.studentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加学生信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _studentId = row.studentId || ids.value;
  getStudent(_studentId).then((response) => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学生信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["studentRef"].validate((valid) => {
    if (valid) {
      if (form.value.studentId != null) {
        updateStudent(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStudent(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 查询班级下拉列表 */
function getClasses() {
  getClassList().then((response) => {
    // 确保这里的 response.data 结构符合你的 API 返回
    classOptions.value = response.data;
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _studentIds = row.studentId || ids.value;
  proxy.$modal
    .confirm('是否确认删除学生信息编号为"' + _studentIds + '"的数据项？')
    .then(function () {
      return delStudent(_studentIds);
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
    "system/student/export",
    {
      ...queryParams.value,
    },
    `student_${new Date().getTime()}.xlsx`
  );
}

// 执行初始化
getClasses();
getList();
</script>
