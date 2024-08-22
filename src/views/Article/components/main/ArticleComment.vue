<!-- 展示评论 -->
<script setup>
import { defineProps, ref, h } from 'vue';
import { addComment, applyComment, deleteComment } from '@/apis/article.js';
import { useRouter } from 'vue-router';
import ChildrenComment from './ChildrenComment.vue';

// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
const code = ref(account.code);
const router = useRouter();
console.log('用户信息--',account.nick_name);
// 接收外部参数
const props = defineProps({
    getComment: {
        type: Function,
        default: null
    },
    aid: { // 当前文章id
        type: Number
    },
    author_id: { // 文章作者id
        type: Number
    },
    contentments: {
        type: Array,
        default: () => []
    }
});

// 评论
const commentText = ref({
    for_id: props.aid, // 文章id
    type: 1, // 类型 article 1
    content: '',
    from_id: account.id, // from_id表示当前评论人id
    author_id: props.author_id, // author_id表示当前 被评论的作者的id (父级为文章作者id)
    from_name: account.nick_name, // 评论人昵称
})

// 添加父级信息
const addComments = () => {
    console.log('添加评论', commentText.value)
    // return
    addComment(commentText.value).then(res => {
        if (res && res.code == 0) {
            ElNotification({
                offset: 60,
                title: "提示",
                message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "添加评论成功"),
            });
            // 加载评论接口
            props.getComment()
        }
        // ElMessage.error(res.data.msg);
        console.log('添加评论', res)
    });
}

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
    for_id: props.aid, // 文章id
    type: 1, // 类型 article 1
    author_id: props.author_id, // author_id表示当前被评论的作者的id
})

// 添加回复信息
const sendMsg = (item) => {
    // send.value.for_id = props.aid
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
}


// 删除评论
const deleteMag = (id) => {
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
       // 刷新评论接口
       props.getComment()
    } else {
      ElNotification({
        offset: 60,
        title: "错误提示",
        message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message),
      });
    }
  });
}
</script>

<template>
    <el-card class="card">
        <!-- 标签栏 -->
        <div>
            <el-text class="title">评论</el-text>
            <div style="display: flex;margin-bottom: 10px;">
                <el-input v-model="commentText.content" style="margin-top: 10px;height: 35px;" placeholder="在这里回复" />
                <el-button @click="addComments()" type="primary"
                    style="margin-top: 10px;margin-bottom: 10px;margin-left: 10px;">回复</el-button>
            </div>
            <div v-for="item in contentments" class="con">
                <!-- 父评论 -->
                <div style="display:flex;align-items: center;justify-content: center;">
                    <!-- <img :src="item.uavator" style="height: 30px;border-radius: 50%;margin-right:15px;"> -->
                    {{ item.from_name }}
                    <el-popover placement="right" :width="400" trigger="click">
                        <template #reference>
                            <el-button style="margin-left: 5px;" size="small">回复</el-button>
                        </template>
                        <el-input v-model="send.content" placeholder="在这里回复" />
                        <el-button @click="sendMsg(item)" type="primary" size="small"
                            style="margin-top: 10px;">确定</el-button>
                    </el-popover>
                    <el-button v-if="account.id === item.from_id" style="margin-left: 5px;" size="small" @click="deleteMag(item.id)">删除</el-button>
                    <div class="flex-grow" />时间: {{ item.createdAt }}
                </div>
                <div style="margin-top: 15px;">{{ item.content }}</div>
                <!-- 子评论 -->
                <ChildrenComment :author_id="author_id" :for_id="item.for_id" :parent_id="item.id" />
            </div>
        </div>
    </el-card>
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