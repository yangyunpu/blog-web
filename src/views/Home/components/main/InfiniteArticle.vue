<script  setup>
// 文章流组件
import ArticleCardFull from '@/components/article/ArticleCardFull.vue';
import { ref, onMounted } from 'vue';
import { getArticleList } from '@/apis/home';
// import { ElMessage } from "element-plus";
const articleList = ref([]);
const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
})

// 首页获取文章列表
const getHomeArticleList = async () => {
  loading
  let res = await getArticleList({
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

onMounted: (
  getHomeArticleList()
);

</script>

<template>
  <div>
    <ArticleCardFull :articleList="articleList" />
  </div>
</template>
