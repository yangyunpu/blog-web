<!-- 展示分类与搜索框 -->
<script setup>
import ArticleCardMini from '@/components/article/ArticleCardHot.vue';
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTypes, getHotArticle } from '@/apis/article';
const router = useRouter();
const input = ref('');
const jumpSearch = () => {
    router.push({
        path: '/search',
        query: {
            para: input.value,
            type: "search",
        }
    })
}
const tagSearch = (item) => {
    router.push({
        path: '/search',
        query: {
            para: item,
            type: "tag",
        }
    })
}
const types = ref([])

const articleList = ref([])
// 加载热点文章数据
onMounted(() => {
    // 获取最热文章数据
    getHotArticle().then(res => {
        articleList.value = res.result.slice(0,5);
    });
    getTypes().then(res => {
        console.log('全部分类', res);
        types.value = res.result
    })
});

</script>

<template>
    <div style="margin-top: 18px;">
        <div style="margin-bottom: 10px;">
            <el-text>热门分类</el-text>
        </div>
        <el-card class="card" shadow="never">
            <el-tag class="tag" @click="tagSearch(type.id)" v-for="type in types">{{ type.tag_name }} </el-tag>
        </el-card>

        <div style="margin-bottom: 10px;">
            <el-text>搜索任意</el-text>
        </div>
        <!-- 搜索框 -->
        <el-input class="input" v-model="input" placeholder="在这里查找任意内容">
            <template #prepend>
                <el-button @click="jumpSearch" :icon="Search" />
            </template>
        </el-input>
        <el-badge value="hot" class="item">
            <div style="margin-bottom: 10px;">
                <el-text>最热文章</el-text>
            </div>
        </el-badge>
        <el-card class="card" shadow="never">
            <ArticleCardMini :articleList="articleList" />
        </el-card>

    </div>
</template>

<style scoped>
.tag {
    margin-top: 7px;
    margin-right: 5px;
}

.item {
    margin-top: 10px;
}

.input {
    height: 35px;
    width: 320px;
    margin-bottom: 20px;
}

.card {
    width: 320px;
    border-radius: 7px;
    margin-bottom: 15px;
}

.mainTitle {
    font-size: 16px;
    color: #4a4a4a;
    font-weight: bolder;
}
</style>