<script setup>
import ArticleCardMini from '@/components/article/ArticleCardMini.vue';
import { getArticleList } from '@/apis/home';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

// 获取登陆数据
import { useAccountStore } from '@/stores/useAccountStore';
import { getUserArticleList } from '@/apis/user';

//加载参数
const accountStore = useAccountStore()
const account = accountStore.getAccount()
const code = ref(account.role);
console.log('获取code', code.value);
console.log('获取account', account);
//跳转登录页
const router = useRouter();
const createArticle = () => {
    console.log('获取code1', code.value);
    if ( code.value == 1) {
        console.log('获取code2', code.value);
        router.push({
            path: '/editor',
            query: {
                modify: 0
            }
        })
    } else {
        console.log('获取code3', code.value);
        router.push({
            path: '/login'
        })
    }
}

const articleList = ref([])

// 首页获取文章列表
const getHomeArticleList = async () => {
  let res = await getArticleList({
    current: 1,
    size: 3,
    author_id: account.id,
    article_title: null,
    tag_id: null,
    category_id: null,
    is_top: null,
    status: null,
    create_time: null
  });
  if (res && res.code == 0) {
    articleList.value = res.result.list;
  } else {
    // ElMessage.error("未授权！！！");
  }
};

onMounted: {
    // 获取后端数据
    if (account.id) {
        getHomeArticleList()
    }
}
</script>

<template>
    <div>
        <div style="height: 30px;"></div>
        <el-row>
            <el-col :span="16">
                <el-text class="title">你的最近发布</el-text>
            </el-col>
            <el-col class="row" :span="8">
                <el-button type="success" @click="createArticle">New+</el-button>
            </el-col>
        </el-row>
        <div style="height: 10px;"></div>

        <div>
            <div style="height: 20px;"></div>
            <!-- 传递文章数据给子组件 -->
            <div style="margin-left: 40px;">
                <ArticleCardMini v-if="code == 1" :articleList="articleList"></ArticleCardMini>
                <el-text class="text" v-else>登录查看你的文章</el-text>
            </div>
        </div>
        <!-- 显示一些状态 -->
        <div style="height: 20px;"></div>
        <el-text class="title">相关内容</el-text>
        <el-card shadow="hover" class="card">
            <h3>很多年</h3>
            <h3>在浓雾中吹起口哨</h3>
            <h3>桥上的火车</h3>
            <h3>驶过一个个季节</h3>
        </el-card>
    </div>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 18px;
    font-weight: bolder;
    color: #000;
    padding-left: 25px;
}

.card {
    margin-top: 10px;
    margin-left: 25px;
    margin-right: 25px;
}

.text {
    margin-left: 25px;
    width: 300px;
}
</style>


  
  