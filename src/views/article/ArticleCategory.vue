<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { articleCategoryService, articleCategoryAddService, articleCategoryUpdateService, articleCategoryDeleteService } from '@/api/article.js'
import { ElMessage, ElMessageBox } from 'element-plus'
//控制添加分类弹窗
const dialogVisible = ref(false)

//添加弹窗标题
const title = ref('')
//添加分类数据模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: '',
    id: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}

// 显示添加表单
const showAddDialog = () => {
    title.value = '添加弹层'
    dialogVisible.value = true
    categoryModel.value.categoryName = ''
    categoryModel.value.categoryAlias = ''
    categoryModel.value.id = ''
}
// 显示编辑表单
const showEditDialog = (row) => {
    title.value = '编辑弹层'
    dialogVisible.value = true
    categoryModel.value.categoryName = row.categoryName
    categoryModel.value.categoryAlias = row.categoryAlias
    categoryModel.value.id = row.id
}

//提交添加表单回调
const addCategory = async () => {
    let result = await articleCategoryAddService(categoryModel.value)
    ElMessage.success(result.msg ? result.msg : '添加成功')
    result = await articleCategoryService()
    categorys.value = result.data
    dialogVisible.value = false
}

// 更新表单回调
const updateCategory = async () => {
    let result = await articleCategoryUpdateService(categoryModel.value)
    ElMessage.success(result.msg ? result.msg : '更新成功')
    result = await articleCategoryService()
    categorys.value = result.data
    dialogVisible.value = false
}

// 显示删除操作提示框
const openDeleteDialog = (row) => {
    ElMessageBox.confirm(
        '确认要删除该分类信息吗？',
        '删除提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            // 调用分类删除函数
            let result = await articleCategoryDeleteService(row.id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            result = await articleCategoryService()
            categorys.value = result.data
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

const categorys = ref([])

// 加载页面完毕后获取初始数据
onMounted(async () => {
    let result = await articleCategoryService()
    categorys.value = result.data
})

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click="showAddDialog">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="openDeleteDialog(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
        <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
            <el-form-item label="分类名称" prop="categoryName">
                <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="分类别名" prop="categoryAlias">
                <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="title === '添加弹层' ? addCategory() : updateCategory()"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>