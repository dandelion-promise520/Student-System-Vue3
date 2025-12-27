<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryRef"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级编号" prop="classCode">
        <el-input
          v-model="queryParams.classCode"
          placeholder="请输入班级编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <el-select
          v-model="queryParams.grade"
          placeholder="请选择年级"
          clearable
        >
          <el-option
            v-for="dict in sys_student_grade"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任" prop="teacherName">
        <el-input
          v-model="queryParams.teacherName"
          placeholder="请输入班主任"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:class:add']"
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
          v-hasPermi="['system:class:edit']"
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
          v-hasPermi="['system:class:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['system:class:import']"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:class:export']"
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
      :data="classList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班级ID" align="center" prop="classId" />
      <el-table-column label="班级名称" align="center" prop="className" />
      <el-table-column label="班级编号" align="center" prop="classCode" />
      <el-table-column label="年级" align="center" prop="grade">
        <template #default="scope">
          <dict-tag :options="sys_student_grade" :value="scope.row.grade" />
        </template>
      </el-table-column>
      <el-table-column label="班主任" align="center" prop="teacherName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
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
            v-hasPermi="['system:class:edit']"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:class:remove']"
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
      <el-form ref="classRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="班级编号" prop="classCode">
          <el-input v-model="form.classCode" placeholder="请输入班级编号" />
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select
            v-model="form.grade"
            placeholder="请选择年级"
            style="width: 100%"
          >
            <el-option
              v-for="dict in sys_student_grade"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任" prop="teacherName">
          <el-input v-model="form.teacherName" placeholder="请输入班主任" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-divider content-position="center">学生信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddStuStudent"
              >添加</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="Delete"
              @click="handleDeleteStuStudent"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-table
          :data="stuStudentList"
          :row-class-name="rowStuStudentIndex"
          @selection-change="handleStuStudentSelectionChange"
          ref="stuStudent"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="序号"
            align="center"
            prop="index"
            width="50"
          />
          <el-table-column label="学生姓名" prop="studentName" width="150">
            <template #default="scope">
              <el-input
                v-model="scope.row.studentName"
                placeholder="请输入学生姓名"
              />
            </template>
          </el-table-column>
          <el-table-column label="学号" prop="studentNumber" width="150">
            <template #default="scope">
              <el-input
                v-model="scope.row.studentNumber"
                placeholder="请输入学号"
              />
            </template>
          </el-table-column>
          <el-table-column label="性别" prop="gender" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.gender" placeholder="请输入性别" />
            </template>
          </el-table-column>
          <el-table-column label="出生日期" prop="birthday" width="240">
            <template #default="scope">
              <el-date-picker
                clearable
                v-model="scope.row.birthday"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择出生日期"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phone" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.phone" placeholder="请输入手机号" />
            </template>
          </el-table-column>
          <el-table-column label="邮箱" prop="email" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.email" placeholder="请输入邮箱" />
            </template>
          </el-table-column>
          <el-table-column label="家庭住址" prop="address" width="150">
            <template #default="scope">
              <el-input
                v-model="scope.row.address"
                placeholder="请输入家庭住址"
              />
            </template>
          </el-table-column>
          <el-table-column label="入学日期" prop="enrollmentDate" width="240">
            <template #default="scope">
              <el-date-picker
                clearable
                v-model="scope.row.enrollmentDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择入学日期"
              >
              </el-date-picker>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="upload.title"
      v-model="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <div class="el-upload__tip">
              <el-checkbox
                v-model="upload.updateSupport"
              />是否更新已经存在的班级数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link
              type="primary"
              :underline="false"
              style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate"
              >下载模板</el-link
            >
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Class">
import {
  listClass,
  getClass,
  delClass,
  addClass,
  updateClass,
} from "@/api/system/class";
import { getToken } from "@/utils/auth";

const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_student_grade } = proxy.useDict(
  "sys_normal_disable",
  "sys_student_grade"
);

const classList = ref([]);
const stuStudentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedStuStudent = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/class/importData",
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    className: null,
    classCode: null,
    grade: null,
    teacherName: null,
    status: null,
  },
  rules: {
    className: [
      { required: true, message: "班级名称不能为空", trigger: "blur" },
    ],
    classCode: [
      { required: true, message: "班级编号不能为空", trigger: "blur" },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询班级信息列表 */
function getList() {
  loading.value = true;
  listClass(queryParams.value).then((response) => {
    classList.value = response.rows;
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
    classId: null,
    className: null,
    classCode: null,
    grade: null,
    teacherName: null,
    status: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
  };
  stuStudentList.value = [];
  proxy.resetForm("classRef");
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
  ids.value = selection.map((item) => item.classId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加班级信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _classId = row.classId || ids.value;
  getClass(_classId).then((response) => {
    form.value = response.data;
    stuStudentList.value = response.data.stuStudentList;
    open.value = true;
    title.value = "修改班级信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classRef"].validate((valid) => {
    if (valid) {
      form.value.stuStudentList = stuStudentList.value;
      if (form.value.classId != null) {
        updateClass(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClass(form.value).then((response) => {
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
  const _classIds = row.classId || ids.value;
  proxy.$modal
    .confirm('是否确认删除班级信息编号为"' + _classIds + '"的数据项？')
    .then(function () {
      return delClass(_classIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 学生信息序号 */
function rowStuStudentIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 学生信息添加按钮操作 */
function handleAddStuStudent() {
  let obj = {};
  obj.studentName = "";
  obj.studentNumber = "";
  obj.gender = "";
  obj.birthday = "";
  obj.phone = "";
  obj.email = "";
  obj.address = "";
  obj.enrollmentDate = "";
  obj.remark = "";
  stuStudentList.value.push(obj);
}

/** 学生信息删除按钮操作 */
function handleDeleteStuStudent() {
  if (checkedStuStudent.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的学生信息数据");
  } else {
    const stuStudents = stuStudentList.value;
    const checkedStuStudents = checkedStuStudent.value;
    stuStudentList.value = stuStudents.filter(function (item) {
      return checkedStuStudents.indexOf(item.index) == -1;
    });
  }
}

/** 复选框选中数据 */
function handleStuStudentSelectionChange(selection) {
  checkedStuStudent.value = selection.map((item) => item.index);
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    "system/class/export",
    {
      ...queryParams.value,
    },
    `class_${new Date().getTime()}.xlsx`
  );
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "班级导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "system/class/importTemplate",
    {},
    `class_template_${new Date().getTime()}.xlsx`
  );
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

getList();
</script>
