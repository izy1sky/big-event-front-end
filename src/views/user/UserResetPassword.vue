<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { userResetPasswordService } from '@/api/user.js'
import { useTokenStore } from '../../stores/token';
import useUserInfoStore from '../../stores/userInfo';
import { useRouter } from 'vue-router';
//导入pinia中的两个状态
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()

//导入router
const router = useRouter()

// 自定义确认密码校验逻辑
const checkPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('确认密码不能为空'))
    } else if (value !== resetPasswordModel.value.new_pwd) {
        callback(new Error("两次密码不一致"))
    } else {
        callback()
    }
}

// 密码重置数据模型
const resetPasswordModel = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: '',
})

const rules = {
    old_pwd: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
    new_pwd: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
    re_pwd: [{ validator: checkPassword, trigger: 'blur' }],
}

// 修改密码确认框
const openResetPassword = () => {
    ElMessageBox.confirm(
        '确认修改密码吗？',
        '修改密码',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await userResetPasswordService(resetPasswordModel.value)
            ElMessage({
                type: 'success',
                message: result.data ? result.data : '修改成功',
            })
            tokenStore.removeToken()
            userInfoStore.removeUserInfo()
            router.push('/login')
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消修改密码',
            })
        })
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="card-header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="resetPasswordModel" status-icon :rules="rules" label-width="100px" size="large"
                    class="demo-ruleForm">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input v-model="resetPasswordModel.old_pwd" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input v-model="resetPasswordModel.new_pwd" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_pwd">
                        <el-input v-model="resetPasswordModel.re_pwd" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="openResetPassword">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
  
<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 480px;
}
</style>