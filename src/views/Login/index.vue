<script setup>
import LayoutHeader from '../Layout/components/LayoutHeader.vue';
import { useRouter } from 'vue-router';
// 引入图标
import { TopRight, MagicStick } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { login, getUserInfoById } from '@/apis/login';
import { randomStr } from '@antfu/utils';
import { useAccountStore } from '@/stores/useAccountStore.js'
import LayoutFooter from '@/components/LayoutFooter.vue';

// 使用路由
const router = useRouter();
// 跳转回首页
const backHome = () => {
  router.push({
    path: '/'
  })
}
const register = () => {
  console.log('注册');
  router.push({
    path: '/register'
  })
}
// 星评值
const value = ref(5)
// 需要写出函数，加载时自动调用，点击验证码时调用
// 生成随机字符串key并保存在本地
const key = ref(randomStr())

// 登录参数
const loginPara = ref({
  username: '',
  code: '',
  key: '',
  password: ''
})
// 使用用户数据
const accountStore = useAccountStore()

// 点击登录上传key以及参数
const access = () => {
  if (loginPara.value.username == '' || loginPara.value.password == '') {
      msg.value = "请填写账号密码"
      return
  }
  console.log('登录', loginPara.value.username);
  // 获取登录结果
  login({
    username: loginPara.value.username,
    password: loginPara.value.password
  }).then(res => {
    if (res.code != '0') {
      msg.value = res.message
    } else {
      localStorage.setItem("token",res.result.token)
      getUserInfoById(res.result.id).then(res => {
        console.log('获取文章信息', res.result);
        //存储数据
        const account= res.result
        // console.log('登录:用户数据',res)
        accountStore.setAccount(account)
        //登陆成功跳转首页 并传递数据
        router.push({
          path: '/loading',
        })
      });
    }
  })
}
//提示信息
const msg = ref('')
//同意协议
const agree = ref(1)

onMounted: {

}
</script>

<template>
  <!-- 在此页面内隐藏副导航栏 -->
  <LayoutHeader />
  <!-- 登录组件 -->
  <el-row style="margin-bottom: 30px;">
    <el-col :span="9"></el-col>
    <el-col :span="6">
      <!-- 登陆卡片 -->
      <el-card class="box-card">
        <div class="card-header">
          <el-rate v-model="value" />
        </div>
        <div>
          <!-- 账号 -->
          <el-input class="input" v-model="loginPara.username" clearable placeholder="输入你的账号">
            <template #prepend>
              <el-icon>
                <TopRight />
              </el-icon>
            </template>
          </el-input>
          <!-- 密码 -->
          <el-input class="input" v-model="loginPara.password" clearable show-password placeholder="你的密码">
            <template #prepend>
              <el-icon>
                <TopRight />
              </el-icon>
            </template>
          </el-input>
          <!-- 验证码 -->
          <!-- <div style="margin-top: 5px;">
            <el-input class="input-mini" v-model="loginPara.code" placeholder="输入验证码">
              <template #append>
                <el-button @click="refreshCaptcha">刷新</el-button>
              </template>
            </el-input>
          </div> -->
          <!-- 跳转回首页 -->
          <div style="margin-top: 25px;">
            <el-button size="small" plain @click="backHome">返回首页</el-button>
            <el-text type="danger" style="margin-left: 15px;">{{ msg }}</el-text>
          </div>

          <!-- 登录按钮/注册 -->
          <div style="text-align:center;margin-top: 50px;">
            <el-button-group>
              <!-- 登录 -->
              <el-button class="button" type="primary" size="large" @click="access">登录</el-button>
              <!-- 注册 -->
              <el-button type="primary" @click="register" size="large">注册
                <el-icon style="margin-left: 10px;" size="20">
                  <MagicStick />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>
          <!-- 协议框 -->
          <div style="margin-top: 30px;text-align: center;">
            <el-switch v-model="agree" />
            <el-text class="title">同意FoRum《用户隐私协议》</el-text>
          </div>
        </div>
      </el-card>

    </el-col>
    <el-col :span="9"></el-col>
  </el-row>
  <LayoutFooter />
</template>

<style scoped>
.button {
  width: 160px;
}

.input {
  margin-top: 25px;
  height: 38px;
  width: 100%;
}

.input-mini {
  margin-top: 20px;
  height: 38px;
  width: 50%;
}

.title {
  font-size: 13px;
  color: #444444;
  padding-left: 5px;
}

.img {
  height: 50px;
  margin-top: 20px;
  margin-left: 10px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  margin-top: 30px;
  margin-left: 0;
  width: 100%;
  height: 480px;
  border-radius: 15px;
}
</style>