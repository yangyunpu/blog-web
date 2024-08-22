<!-- 展示评论 -->
<script setup>
import { defineProps, ref, h } from 'vue';
import { deleteComment, applyComment, frontGetChildrenComment } from '@/apis/article.js';
import { useRouter } from 'vue-router';

// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
const router = useRouter();
// 接收外部参数
const props = defineProps({
    isRefresh: {
        type: Function,
        default: null
    },
    for_id: { // 当前文章id
        type: Number
    },
    author_id: { // 文章作者id
        type: Number
    },
    parent_id: { // 评论父级id
        type: Number
    },
});
const commentList = ref([]);

// 回复评论
const send = ref({
    from_id: account.id, // from_id表示当前评论人id
    from_avatar: account.avatar, // 评论人头像
    from_name: account.nick_name, // 评论人昵称
    to_id: '', // 被回复的人id
    to_avatar: '', // 被回复人的头像
    to_name: '', // 被回复人的昵称
    content: '', // 回复内容
    parent_id: '', // 评论父级id
    for_id: props.for_id, // 文章id
    type: 1, // 类型 article 1
    author_id: props.author_id, // author_id表示当前被评论的作者的id
})

// 添加回复信息
const sendMsg = (item) => {
    console.log('添加回复评论-被回复-',item);
    send.value.to_id = item.from_id
    send.value.to_avatar = item.from_avatar
    send.value.to_name = item.from_name
    send.value.parent_id = item.id  // 父级id
    // return
    applyComment(send.value).then(res => {
        console.log('添加评论', res)
        if (res && res.code == 0) {
            ElNotification({
                offset: 60,
                title: "提示",
                message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "回复评论成功"),
            });
        }
    });
    // alert('模拟添加')
}

const params = ref({
  current: 1,
  size: 20,
  type: 1,
  for_id: props.for_id, // 文章id
  parent_id: props.parent_id, // 评论父级id
  user_id: account.id, // 当前用户id
});
// 获取子级评论
const getComment = async (item) => {
//   // 如果要刷新 就让分页为1
//   if (type == "clear") {
//     params.current = 1;
//   }

  const res = await frontGetChildrenComment(params.value);
  if (res && res.code == 0) {
    
    const { list, total } = res.result;
    commentList.value = list;
  } else {
    ElNotification({
      offset: 60,
      title: "错误提示",
      message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
    });
  }
//   params.loading = false;
};

// 删除一个回复消息
const deleteOwnComment = (id) => {
  ElMessageBox.confirm("确认删除此条评论吗", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then(async () => {
    const res = await deleteComment(id, props.parent_id);
    if (res && res.code == 0) {
      ElNotification({
        offset: 60,
        title: "提示",
        message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "删除成功"),
      });
      getComment();
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  });
};


// 发送请求接收数据
onMounted: {
    getComment()
}
</script>

<template>
    <!-- 标签栏 -->
    <div v-if="commentList.length > 0">
        <!-- 子评论 -->
        <div 
            v-for="(comment, index) in commentList"
            :key="index" class="subCon">
            <div style="display:flex;align-items: center;justify-content: center;">
                <!-- <img :src="comment.uavator" style="height: 25px;border-radius: 50%;margin-right: 15px;"> -->
                {{ comment.from_name
                }}
                <div style="margin-left: 15px;margin-right: 15px;">回复: @{{ comment.to_name }}</div>
                {{ comment.createdAt }}
                <el-popover placement="right" :width="400" trigger="click">
                    <template #reference>
                        <el-button style="margin-left: 5px;" size="small">回复</el-button>
                    </template>{{ send.content }}
                    <el-input v-model="send.content" placeholder="在这里回复" />
                    <el-button @click="sendMsg(comment)" type="primary" size="small"
                        style="margin-top: 10px;">确定</el-button>
                </el-popover>
                <el-button v-if="account.id === comment.from_id" style="margin-left: 5px;" size="small" @click="deleteOwnComment(comment.id)">删除</el-button>
                <div class="flex-grow" />
            </div>
            <div style="margin-top: 15px;">{{ comment.content }}</div>
        </div>
    </div>
</template>

<style scoped>
.flex-grow {
    flex-grow: 1;
}

.card {
    margin-top: 10px;
    width: 900px;
}

.con {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    margin-bottom: 15px;
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
}

.subCon {
    border-left: 4px solid rgb(217, 217, 217);
    margin-left: 20px;
    margin-top: 15px;
    padding-left: 10px;
}

.title {
    font-size: 18px;
    font-weight: bolder;
    color: #000;
    padding-left: 16px;
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
</style>