<script lang="ts" setup>
import { onMounted, reactive, ref, h } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElButton, ElNotification } from 'element-plus'
import { updateUserInfo } from '@/apis/user.js';
import { getUserInfoById } from '@/apis/login';
// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()


// 侧栏是否打开
const visible = ref(false)
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

// 表单数据
const ruleForm = ref({
    nick_name: account.nick_name,
    qq: account.qq,
})

onMounted(() => {
    
});

// 获取用户信息
const getUserInfo = async () => {
   let res = await getUserInfoById(account.id);
   if (res.code == 0) {
       ruleForm.value = res.result;
       //  更新存储数据
       accountStore.setAccount(res.result)
   }
};


const password = ref('')
// 配置表单规则
// 判定验证是否通过
const submitForm = () => {
    console.log(ruleForm.value);
    updateUserInfo(ruleForm.value).then(res => {
        console.log(res);
        if(res.code==0){
            ElNotification({
                offset: 60,
                title: "提示",
                message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "修改成功！"),
            });
            // 更新用户信息
            getUserInfo()
        }
    })
}

// 邮箱检验
const checkEmail = (rule, value, callback) => {
    const mailReg = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!value) {
        return callback(new Error('邮箱不能为空'))
    }
    if (mailReg.test(value)) {
        callback()
    } else {
        callback(new Error('请输入正确的邮箱格式'))
    }
};

const resetForm = () => {
    ruleForm.value = {
        nick_name: '',
        qq: '',
    }
}
</script>

<template>
    <div>
        <!-- 标题 -->
        <div>
            <el-text class="mainTitle">修改资料</el-text>
        </div>
        <div style="display: flex;">
            <el-card shadow="hover" class="box-card">
                <!-- 用户资料表单 -->
                <div class="profile">
                    <el-form ref="ruleFormRef" :model="ruleForm" label-width="90px" label-position="left"
                        class="demo-ruleForm" :size="formSize" status-icon>
                        
                        <el-form-item label="用户昵称" prop="nick_name">
                            <el-input clearable class="input" v-model="ruleForm.nick_name" />
                        </el-form-item>
                        <el-form-item label="qq邮箱" prop="qq">
                            <el-input clearable class="input-mini" v-model="ruleForm.qq" />
                        </el-form-item>
                        <!-- <el-form-item label="修改头像">
                            <img :src="ruleForm.avator" class="img">
                        </el-form-item> -->
                        <!-- <el-form-item label="电话" prop="mobile">
                            <el-input class="input-mini" v-model="ruleForm.mobile" />
                        </el-form-item> -->
                        <!-- <el-form-item label="年龄" prop="age">
                            <el-input class="input-mini" v-model="ruleForm.age" />
                        </el-form-item>

                        <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="ruleForm.gender">
                                <el-radio label="男" />
                                <el-radio label="女" />
                            </el-radio-group>
                        </el-form-item> -->
                        <!-- <el-form-item label="用户描述" prop="desc">
                            <el-input v-model="ruleForm.description" type="textarea" />
                        </el-form-item> -->
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
