<!-- 页头组件 -->
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useAccountStore } from '@/stores/useAccountStore';

//加载参数
const accountStore = useAccountStore()
const account = accountStore.getAccount()
console.log('获取用户信息', account);
const code = ref(account.role);
const user = ref(account.nick_name)

//使用路由
const router = useRouter();
const activeIndex = ref('1')
//监听按键进行跳转
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  if (key === '0') {
    router.push({
      path: '/'
    })
  }
  if (key === '2') {
    router.push({
      path: '/login'
    })
  }
  if (key == '2-1') {
    router.push({
      path: '/userHome'
    })
  }
  if (key == '2-2') {
    router.push({
      path: '/userHome/article'
    })
  }
  if (key == '2-3') {
  //清除数据恢复默认
  accountStore.clearCacheAndRestoreDefault()
  router.push({
    path: '/loading'
  })
}
}

</script>

<template>
  <!-- 主导航栏 -->
  <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect"> -->
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <!-- <img style="height: 50px;margin-top: 6px;" src="@/assets/imgs/logo.png"> -->
    <el-menu-item index="0" style="font-weight:bolder;"><span style="margin-right: 6px;">YOUNG</span> FORUM</el-menu-item>
    <!-- 副导航栏 -->
    <el-menu-item index="2" v-if="code != 1">登录以查看更多</el-menu-item>
    <el-sub-menu index="3" v-else>
      <!-- 用户信息 -->
      <template #title>hi,{{ user }}</template>
      <el-menu-item index="2-1">我的主页</el-menu-item>
      <el-menu-item index="2-2">我的文章</el-menu-item>
      <el-menu-item index="2-3">退出登录</el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<style>
.el-menu-demo{
  display: flex;
  justify-content: space-between;
}
</style>
