<!-- 文章卡片 -->
<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
  author: {
    type: Number,
    required: true
  },
  articleList: {
    type: Array,
    default: () => []
  }
});
// const nick_name = ref();
// const avatar = ref();

const router = useRouter();
// 在此处设计携带aid跳转
const jumpDetailsPage = (aid) => {
  if (props.author == 1) {
    router.push({
      path: '/article/auart',
      query: {
        aid: aid
      }
    })
  } else {
    router.push({
      path: '/article',
      query: {
        aid: aid
      }
    })
  }
}

</script>

<template>
  <div class="body" v-for="article in articleList" @click="jumpDetailsPage(article.id)">
    <el-card class="box-card" shadow="hover">
      <!-- 卡片头 -->
      <el-row>
        <el-col :span="20">
          <div><el-text class="title">{{ article.article_title }}</el-text></div>
          <div style="margin-top: 10px;"><el-text class="text">{{ article.article_description }}</el-text></div>
          <div style="height: 15px;"></div>
          <el-row class="row">
            <el-col :span="14">
              <!-- 点赞 浏览 评论 -->
              <el-row class="row">
                <el-col :span="6">
                  <div class="icon">{{ article.blog_user.nick_name }}</div>
                </el-col>
                <el-col :span="6">
                  <div class="icon"><i class="iconfont icon-dianzan"></i>{{ article.thumbs_up_times }}</div>
                </el-col>
                <el-col :span="6">
                  <div class="icon"><i class="iconfont icon-browse"></i>{{ article.view_times }}</div>
                </el-col>
                <el-col :span="6">
                  <div class="icon"><i class="iconfont icon-pinglun"></i>评论</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="10">
              <el-text style="margin-right: 10px;">tags:</el-text>
              <el-tag class="tag">{{ article.categoryName }}</el-tag>
              <el-tag class="tag" v-for="tag in article.tagNameList">{{ tag }}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
.body {
  margin-top: 10px;
  margin-bottom: 5px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 14px;
  font-weight: bolder;
}

.text {
  font-size: 14px;
}

.tag {
  margin-right: 5px;
}

.icon {
  font-size: 13px;
  margin-right: 35px;
}

.box-card {
  width: 100%;
  margin-left: 0%;
  border-radius: 6px;
  margin-bottom: 20px;
}
</style>
