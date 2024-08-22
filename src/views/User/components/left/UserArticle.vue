<!-- 用户文章界面 -->
<script setup>
import ArticleCardFull from '@/components/article/ArticleCardFull.vue';

import { getArticleList } from '@/apis/home';
import {onMounted, ref} from "vue";
// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
const articleList = ref([]);

onMounted(() => {
  getHomeArticleList()
});

const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
})

// 首页获取文章列表
const getHomeArticleList = async () => {
  loading
  let res = await getArticleList({
    author_id: account.id,
    current: 1,
    size: 10,
    article_title: null,
    tag_id: null,
    category_id: null,
    is_top: null,
    status: null,
    create_time: null
  });
  if (res && res.code == 0) {
    articleList.value = res.result.list;
    loading.close()
  } else {
    loading.close()
    // ElMessage.error("未授权！！！");
  }
};

</script>

<template>
    <div>
        <div>
            <el-text class="mainTitle">我的全部文章</el-text>
        </div>
        <div style="margin-left: 20px;margin-top: 20px; width: 750px;">
          <div>
            <!-- 参数指明是作者 -->
            <ArticleCardFull :articleList="articleList" :author="1"/>
          </div>
        </div>
    </div>
</template>

<style scoped>
.mainTitle {
    margin-left: 30px;
    font-size: 18px;
    color: #000;
    font-weight: bolder;
}
</style>