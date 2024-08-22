<script lang="ts" setup>
import { onMounted, reactive, ref, h } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import { ElButton } from 'element-plus'
// import UserPassword from '@/views/User/components/left/UserPassword.vue'
import { getUserInfo, updateUserPassword } from '@/apis/user.js';
// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
//使用路由
const router = useRouter();

// 侧栏是否打开
const visible = ref(false)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

// 表单数据
const passwordForm = ref({
    id: account.id,
    password: '', // 原密码
    password1: '', // 新密码
    password2: '', // 二次新密码
})

// 校验数据
const formRules = reactive({
    // 原密码
    password: [
        { required: true, message: '请输入原密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' }
    ],
    // 新密码
    password1: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' }
    ],
    // 再次输入密码
    password2: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是 6-15位 的非空字符', trigger: 'blur' },
        {
        validator: (rule, value, callback) => {
            // 判断 value 和 当前 form 中收集的 password 是否一致
            if (value !== passwordForm.value.password1) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback() // 校验成功
            }
        },
        trigger: 'blur'
        }
    ],

});

onMounted(() => {
    
});


// 配置表单规则
// 判定验证是否通过
const submitForm = async () => {
    // 整合数据
    let res = await updateUserPassword(passwordForm.value);
    if (res && res.code == 0) {
        ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "修改成功！"),
        });
        //清除数据恢复默认
        accountStore.clearCacheAndRestoreDefault()
        router.push({
            path: '/loading'
        })
    }
}

const resetForm = () => {
    passwordForm.value = {
        id: account.id,
        password: '',
        password1: '',
        password2: '',
    }
}
</script>

<template>
    <div>
        <!-- 标题 -->
        <div>
            <el-text class="mainTitle">修改密码</el-text>
        </div>
        <div style="display: flex;">
            <el-card shadow="hover" class="box-card">
                <!-- 用户资料表单 -->
                <div class="profile">
                    <el-form ref="ruleFormRef" 
                        :model="passwordForm" label-width="90px" label-position="left"
                        class="demo-ruleForm" :size="formSize" 
                        :rules="formRules"
                        status-icon
                    >
                        
                        <el-form-item label="原密码" prop="password">
                            <el-input
                                class="input-mini"
                                type="password"
                                show-password
                                v-model="passwordForm.password"
                                placeholder="请输入原密码"
                                minlength="4"
                                maxlength="16"
                            />
                        </el-form-item>
                        <el-form-item label="新密码" prop="password1">
                            <el-input
                                class="input-mini"
                                show-password
                                v-model="passwordForm.password1"
                                placeholder="请输入新密码"
                                minlength="4"
                                maxlength="16"
                            />
                        </el-form-item>
                         <el-form-item label="确认密码" prop="password2">
                            <el-input
                                class="input-mini"
                                show-password
                                v-model="passwordForm.password2"
                                placeholder="请二次确认新密码"
                                minlength="4"
                                maxlength="16"
                            />
                        </el-form-item>
                        <!-- 提交表单 -->
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">
                                保存
                            </el-button>
                            <el-button type="danger" @click="resetForm()">清除</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            
        </div>
        <!-- <UserPassword /> -->
    </div>
</template>

<style scoped>
.img{
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}
.box-card {
    margin-top: 21px;
    margin-left: 20px;
    border-radius: 7px;
    width: 750px;
    padding-right: 30px;
}

.card {
    margin-top: 21px;
    margin-left: 20px;
    border-radius: 5px;
    width: 300px;
    height: 300px;
}

.input {
    width: 500px;
    height: 40px;
}

.input-mini {
    width: 250px;
    height: 40px;
}

.mainTitle {
    margin-left: 30px;
    font-size: 18px;
    color: #000;
    font-weight: bolder;
}

.profile {
    margin-left: 30px;
    margin-top: 20px;
}
</style>
