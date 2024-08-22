<!-- 搜索界面 -->
<script setup>
import { Search } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import { getSearch } from '@/apis/search';
import { getArticleList } from '@/apis/home';
import { computed, onMounted, reactive, ref } from 'vue'
import ArticleCardFull from '@/components/article/ArticleCardFull.vue';
const route = useRoute()
const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
})

// 文章列表
const articleList = ref([]);
const queryData = reactive({
    query: route.query.para,
    status: false,
    type: route.query.type,
    size: 1,
    current: 0,
})

// 标签搜索（首页获取文章列表）
const getHomeArticleList = async () => {
  loading
  console.log('添加回复评论-被回复-',queryData.query);
  let res = await getArticleList({
    current: queryData.current,
    size: queryData.size,
    article_title: null,
    tag_id: queryData.query,
    category_id: null,
    is_top: null,
    status: null,
    create_time: null
  });
  if (res && res.code == 0) {
    loading.close()
    console.log('添加评论1', totalPage)
    const { list } = res.result
    articleList.value = articleList.value.concat(list)
    // articleList.value = res.result.list;
    const totalPage = res.result.total / res.result.size // 总页数等于 总条数除以每页条数
    console.log('添加评论', totalPage)
    queryData.current = res.result.current
    if (queryData.current >= totalPage) noMore.value = true
  } else {
    loading.close()
    // ElMessage.error("未授权！！！");
  }
};

// 文章内容搜索
const startSearch = () => {
    getSearch({
        current: queryData.current,
        size: queryData.size,
        content: queryData.query,
    }).then(res => {
        loading.close()
        const { list } = res.result
        articleList.value = articleList.value.concat(list);
        const totalPage = res.result.total / res.result.size // 总页数等于 总条数除以每页条数
        console.log('totalPage', totalPage)
        console.log('queryData.current', queryData.current)
        queryData.current = res.result.current
        if (queryData.current >= totalPage) {
            disabled.value = true
            noMore.value = true
        }
    });
}

onMounted: {
    // if (queryData.type == 'tag') {
    //     getHomeArticleList()
    // } else {
    //     startSearch()
    // }
}

const loadings = ref(false)
const noMore = ref(false)
const disabled = ref(false)
// const disabled = computed(() => noMore.value)
const load = () => {
    // if ( disabled.value == false) {
        setTimeout(() => {
            queryData.current ++
            console.log('load--totalPage', queryData.current)
            if (queryData.type == 'tag') {
                getHomeArticleList()
            } else {
                startSearch()
            }
        }, 200)
    // }
  
}


</script>

<template>
    <div class="search-content" style="overflow: auto">
        <div v-if="queryData.type == 'search'" style="display: flex;align-items: center;justify-content: center;">
            <el-input placeholder="键入内容以搜索" class="search" v-model="queryData.query"></el-input>
            <!-- 搜索按钮 -->
            <el-button type="primary" size="large" @click="startSearch">搜索
                <el-icon style="margin-left: 10px;" size="20">
                    <Search />
                </el-icon>
            </el-button>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <el-tabs 
                type="border-card" 
                class="type">
                <el-tab-pane v-infinite-scroll="load" :infinite-scroll-disabled="disabled" label="文章">
                    <!-- 显示文章 -->
                    <ArticleCardFull :articleList="articleList" />
                </el-tab-pane>
                <!-- <el-tab-pane label="用户">正在开发</el-tab-pane> -->
                <p v-if="loadings">Loading...</p>
                <p v-if="noMore">No more</p>
            </el-tabs>
            
        </div>
    </div>
</template>

<style scoped>
.search-content {
    padding-top: 30px; 
    align-items: center;
    justify-content: center;
    background-color: white;
    height: calc(100vh - 60px);
}
.search {
    width: 700px;
    height: 42px;
    margin-right: 10px;
}

.type {
    margin-top: 20px;
    width: 850px;
    margin-bottom: 100px;
}
p{
    text-align: center;
}
</style>
