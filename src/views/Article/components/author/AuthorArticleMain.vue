<!-- 作者页面下的文章详情页 -->
<script setup>
import { h } from "vue";
import { useRoute, useRouter } from 'vue-router'
import ArticleComment from '../main/ArticleComment.vue';
import ArticlePreview from '../../../../components/article/ArticlePreview.vue';
import GsapCount from '@/components/GsapCount/index.vue';
import { getHomeArticleDetails, deleteArt, frontGetParentComment, articleLike, cancelArticleLike, addLike, cancelLike, getIsLikeByIdAndType } from '@/apis/article.js'
import { onMounted, ref } from 'vue';

// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
const params = ref({
    current: 1,
    size: 5,
    type: "",
    for_id: "",
    parent_id: "",
    loading: false,
});
const articleInfo = ref({});
const router = useRouter();
// 接收参数
const route = useRoute()
const contentment = ref([])
const commentabled = ref(true) // 开启文章评论
const isLike = ref(false)
const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
})

// 文章详情
const getArticleDetails = async () => {
  loading
  let res = await getHomeArticleDetails(route.query.aid);
  if (res.code == 0) {
    loading.close()
    articleInfo.value = res.result;
    if (account.id) {
      const res = await getIsLikeByIdAndType({
        for_id: articleInfo.value.id,
        type: 1,
        user_id: account.id,
      });
      if (res.code == 0) {
        isLike.value = res.result;
      }
    }
  }
};


// 文章点赞
const like = async () => {
  // 取消点赞
  if (isLike.value) {
    let tRes = await cancelArticleLike(route.query.aid);
    if (tRes.code == 0) {
      await cancelLike({ for_id: articleInfo.value.id, type: 1, user_id: account.id });
      articleInfo.value.thumbs_up_times--;
      isLike.value = false;
      ElNotification({
        offset: 60,
        title: "提示",
        message: h(
          "div",
          { style: "color: #7ec050; font-weight: 600;" },
          "有什么不足可以给我留下评论，感谢指正"
        ),
      });
    }
  }
  // 点赞
  else {
    let tRes = await articleLike(route.query.aid);
    if (tRes.code == 0) {
      await addLike({ for_id: articleInfo.value.id, type: 1, user_id: account.id });
      articleInfo.value.thumbs_up_times++;
      isLike.value = true;
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "点赞成功，谢谢支持"),
      });
    }
  }
};

// 接收文章父级评论
const getComment = async () => {
    let res = await frontGetParentComment({
    current: params.value.current, //
        for_id: route.query.aid, // 评论的对象id 比如说说id、文章id等
        order: "", // hot new 文章类型
        size: params.value.size, //
        type: 1, // 评论类型 1 文章 2 说说 3 留言 
  });
  if (res && res.code == 0) {
    contentment.value= res.result.list
  }
};


// 跳转修改文章
const articleEditor = () => {
    router.push({
        path: '/editor',
        query: {
            modify: 1,
            aid: articleInfo.value.id
        }
    })
}

// 删除文章
const deleteArticle = () => {
    ElMessageBox.confirm("确认删除此文章吗", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
    }).then(async () => {
      const res = await deleteArt(articleInfo.value.id, articleInfo.value.status );
      if (res && res.code == 0) {
        ElNotification({
          offset: 60,
          title: "提示",
          message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "删除成功"),
        });
        setTimeout(() => {
            router.go(-1)
        }, 500)
      } else {
        ElNotification({
          offset: 60,
          title: "错误提示",
          message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
        });
      }
    });
}

// 发送请求接收数据
onMounted: {
    getArticleDetails()
    getComment()
}

//判断权限
</script>

<template>
    <el-card class="card">
        <!-- 标签栏 -->
        <div class="head">
            <el-text class="title">{{ articleInfo.article_title }}</el-text>
        </div>
        <div class="tagLine">
            <el-button type="success" size="small" @click="articleEditor">编辑文章</el-button>
            <el-button type="danger" size="small" @click="deleteArticle">删除文章</el-button>
            <el-text class="text" style="margin-left: 10px;">文章标签:</el-text>
            <el-tag class="tag" v-for="tag in articleInfo.tagNameList">{{ tag }}</el-tag>
        </div>
        <ArticlePreview :content="articleInfo.article_content" />
        <div :class="['like', isLike ? 'is-like' : '']" @click="like">
            <i class="iconfont icon-dianzan !mr-[5px]"></i>
            <GsapCount
              :class="[isLike ? 'is-like' : '']"
              v-if="articleInfo.thumbs_up_times - 0 < 1000"
              :value="articleInfo.thumbs_up_times"
            />
            <span v-else :class="[isLike ? 'is-like' : '']">
              {{ articleInfo.thumbs_up_times }}
            </span>
        </div>
    </el-card>
    <!-- 评论区 传入评论参数 -->
    <ArticleComment v-if="commentabled" :getComment="getComment" :contentments="contentment" :author_id="articleInfo.author_id" :aid="articleInfo.id" />
</template>

<style scoped>
.head {
    display: flex;
    margin-bottom: 10px;
}

.card {
    border-radius: 9px;
    width: 900px;
}

.title {
    font-size: 24px;
    font-weight: bolder;
    color: #000;
    padding-left: 16px;
    margin-bottom: 5px;
}

.text {
    font-size: 14px;
    color: #000;
    margin-right: 10px;
}

.iconfont {
    font-size: 25px;
}

.tagLine {
    margin-left: 16px;
    margin-bottom: 10px;
}

.tag {
    margin-right: 5px;
    margin-bottom: 5px;
}

.like {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-dianzan {
    font-size: 20px;
    transition: all 0.3s;
    &:hover {
      scale: 1.1;
    }
  }
}

.is-like {
  font-size: 20px;
  font-weight: 600;
  color: #5cbfef;
  .icon-dianzan {
    font-size: 22px;
    color: #5cbfef;
  }
}
</style>