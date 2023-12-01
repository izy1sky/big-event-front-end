<script setup>
import {
    Edit,
    Delete,
    Plus
} from '@element-plus/icons-vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { articleCategoryService, articleListService, articleAddService, articleUpdateService, articleDeleteService } from '../../api/article';
import { QuillEditor } from '@vueup/vue-quill'
import { ref, onMounted } from 'vue'
import { useTokenStore } from '@/stores/token.js'
import { ElMessage, ElMessageBox } from 'element-plus';

// 导入token状态
const tokenStore = useTokenStore()

//文章分类数据模型
const categorys = ref([])

//用户搜索时选中的分类id
const categoryId = ref('')

//用户搜索时选中的发布状态
const state = ref('')

//文章列表数据模型
const articles = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = async (size) => {
    pageSize.value = size
    await articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = async (num) => {
    pageNum.value = num
    await articleList()
}

// 图片上传成功的回调
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data
    console.log(result.data);
}

// 发布文章的回调
const addArticle = async (isAdd, state) => {
    articleModel.value.state = state ? '已发布' : '草稿'
    let result = isAdd ? await articleAddService(articleModel.value) : await articleUpdateService(articleModel.value)
    ElMessage.success(result.message ? result.message : (isAdd ? '添加成功' : '修改成功'))
    visibleDrawer.value = false
    await articleList()
}

// 修正articles中categoryId的值为categoryName
const updateArticles = (articles) => {
    articles.map(article => {
        let name = categorys.value.filter(category => category.id === article.categoryId)[0].categoryName
        article.categoryId = name
    })
}

//获取分类信息
const categoryList = async () => {
    let categoryResult = await articleCategoryService()
    categorys.value = categoryResult.data
}

// 获取文章列表函数
const articleList = async () => {
    let listCondition = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let articlesResult = await articleListService(listCondition)
    updateArticles(articlesResult.data.items)
    total.value = articlesResult.data.total
    articles.value = articlesResult.data.items
}

// 页面渲染完成时加载数据
onMounted(async () => {
    await categoryList()
    await articleList()
})

//控制抽屉是否显示
const visibleDrawer = ref(false)
//抽屉标题
const drawerTitle = ref('')
//添加表单数据模型
const articleModel = ref({
    id: '',
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})
//重置表单数据模型
const resetArticleModel = () => {
    articleModel.value = {
        id: '',
        title: '',
        categoryId: '',
        coverImg: '',
        content: '',
        state: ''
    }
}
//设置表单数据模型
const setArticleModel = (article) => {
    articleModel.value.id = article.id
    articleModel.value.title = article.title
    articleModel.value.categoryId = categorys.value.filter(category => category.categoryName === article.categoryId)[0].id
    articleModel.value.coverImg = article.coverImg
    articleModel.value.content = article.content
    articleModel.value.state = article.state
}
// 删除表单提示框
const deleteArticleDialogOpen = (row) => {
    ElMessageBox.confirm(
        '确定删除文章吗？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await articleDeleteService(row.id)
            ElMessage({
                type: 'success',
                message: result.message ? result.message : '删除成功',
            })
            await articleList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="drawerTitle = '添加文章'; visibleDrawer = true; resetArticleModel()">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryId"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"
                        @click="drawerTitle = '修改文章'; setArticleModel(row); visibleDrawer = true"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticleDialogOpen(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="drawerTitle" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px">
                <el-form-item label="文章标题">
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <!-- 
                        auto-upload  是否自动上传
                        action  服务器接口路径
                        name  上传文件字段名
                        headers  上传的请求头
                        on-success  上传成功的回调
                     -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        :headers="{ 'Authorization': tokenStore.token }" name="file" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addArticle(drawerTitle === '添加文章', true)">发布</el-button>
                    <el-button type="info" @click="addArticle(drawerTitle === '添加文章', false)">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
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

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>