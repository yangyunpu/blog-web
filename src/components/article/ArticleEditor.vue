<!-- 编辑文章 -->
<script setup>
import { h } from "vue";
import { useRoute, useRouter } from 'vue-router'
import LayoutFooter from '@/components/LayoutFooter.vue';
import { ref, reactive, onMounted } from 'vue';

// 获取是否登录数据
import { useAccountStore } from '@/stores/useAccountStore';
const accountStore = useAccountStore()
const account = accountStore.getAccount()
import { getCategoryDictionary, getTagDictionary, addArticle, editArticle, getHomeArticleDetails, getTypes } from '@/apis/article.js'
const route = useRoute()
const router = useRouter();
// 判断模式是什么 修改？新增？
const modify = ref(0)
// 显示后端参数信息
const msg = ref('这里显示警告信息')
modify.value = route.query.modify
// 文章数据
let article = reactive({
    id: "",
    article_title: "",
    category: {},
    category_id: null,
    tagIdList: [],
    tagList: [],
    author_id: account.id,
    article_content: "",
    article_cover: "",
    is_top: 2, // 置顶 1 置顶 2 取消置顶
    order: null, // 置顶文章的排序
    status: 1, // 状态 1 公开 2 私密 3 回收站（相当于草稿）
    type: 1, // 类型 1 原创 2 翻译 3 转载
    origin_url: null, // 原文链接 翻译或转载才需要填
    coverList: [],
    article_description: "" // 文章描述
})
const dialogArticleFormRef = ref();
// 校验规则
const tagV = (rule, value, cb) => {
    console.log("tagOptionList-------",value)
    if (!value.length) {
        return cb(new Error("请选择标签"));
    }
    cb();
};
const articleFormRules = reactive({
    article_title: {
      required: true,
      trigger: "blur",
      message: "请输入文章标题"
    },
    category_id: {
      required: true,
      message: "请选择文章分类",
      trigger: ["change"]
    },
    article_description: {
      required: true,
      message: "请输入文章描述",
      trigger: ["blur"]
    },
    tagIdList: {
      required: true,
      message: "请选择文章标签",
      validator: tagV,
      trigger: ["change"]
    },
    article_content: {
      required: true,
      message: "请输入文章内容",
      trigger: "blur"
    }
});

// 发送请求接收数据
onMounted(async() =>{
    await getCategoryD()
    await getTagD()
    // console.log("route.query.modify",modify.value)
    if (modify.value == 1) {
        getArticleDetails()
    }
    

})

const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
})


const articleSubmit = ref({
    aid: 0,
    content: '',
    description: '',
    title: '',
    tagIds: [],
    typeId: 0,
})

const categoryOptionList = ref([]) // 文章分类
const tagOptionList = ref([]) // 文章标签

const handleChange  = async () => {
    console.log("监听handleChange",article.tagIdList)
}
// 文章详情
const getArticleDetails = async () => {
  loading
  let res = await getHomeArticleDetails(route.query.aid);
  if (res.code == 0) {
    loading.close()
    Object.assign(article, res.result);
    console.log("文章详情result",article)
  }
};

// 文章分类字典
const getCategoryD = async () => {
  let res = await getCategoryDictionary();
  if (res.code == 0) {
    loading.close()
    categoryOptionList.value = res.result;
    console.log("categoryOptionList",categoryOptionList.value)
  }
};

// 文章标签字典
const getTagD = async () => {
  let res = await getTagDictionary();
  if (res.code == 0) {
    tagOptionList.value = res.result;
    console.log("tagOptionList",tagOptionList.value)
  }
};

// 整理文章的数据返回给后端
function arrangeArticle(articleForm) {
    const { id, category_id, tagIdList, ...restArticle } = articleForm;
    let newCategory;
    const newTagList = [];

    // 当创建新的分类或者是标签时 类型是string而id是number
    if (typeof category_id == "number") {
      newCategory = categoryOptionList.value.find(
        category => (category.id = category_id)
      );
    } else {
      newCategory = {
        category_name: category_id
      };
    }
    tagIdList.forEach(tagId => {
      if (typeof tagId == "number") {
        newTagList.push(tagOptionList.value.find(tag => tag.id == tagId));
      } else {
        newTagList.push({
          tag_name: tagId
        });
      }
    });

    restArticle.category = newCategory;
    restArticle.tagList = newTagList;
    if (id) {
      restArticle.id = id;
    }
    // 谁发布的
    // if (!id) {
    //   restArticle.author_id = userId ? userId : 1;
    // }
    return restArticle;
}

// 提交修改的数据
const put = async () => {
    // 整合数据
    const finalArticle = arrangeArticle(article);
    let res = await editArticle({ article: finalArticle });
    if (res && res.code == 0) {
        ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "修改成功！"),
        });
        setTimeout(() => {
            router.go(-1)
        }, 500)
    }
}

// 新建数据提交
const add = async () => {
    const finalArticle = arrangeArticle(article);
    let res = await addArticle({ article: finalArticle });
    if (res && res.code == 0) {
        ElNotification({
            offset: 60,
            title: "提示",
            message: h("div", { style: "color: #7ec050; font-weight: 600;" }, "发布成功！"),
        });
        setTimeout(() => {
            router.go(-1)
        }, 500)
    }
}

// 保存文章
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (modify.value == 1) {
                put();
            } else {
                add();
            }
        }
    })
}

</script>

<template>
    <div class="center">
        <div style="width: 1200px;margin-top: 20px;">
            <el-form
                style="width: 30%"
                ref="dialogArticleFormRef"
                :model="article"
                :rules="articleFormRules"
            >
                <el-form-item
                    label="文章标题"
                    prop="article_title"
                >
                    <el-input
                        v-model="article.article_title"
                        placeholder="请输入文章标题"
                        clearable
                        maxlength="20"
                    />
                </el-form-item>
                <el-form-item
                    label="文章描述"
                    prop="article_description"
                >
                    <el-input
                        v-model="article.article_description"
                        placeholder="请输入文章描述"
                        clearable
                        maxlength="20"
                    />
                </el-form-item>
                <el-form-item
                    label="文章分类"
                    prop="category_id"
                >
                    <el-select
                        v-model="article.category_id"
                        placeholder="请选择文章分类"
                        filterable
                        clearable
                        allow-create
                    >
                        <el-option
                            v-for="item in categoryOptionList"
                            :key="item.id"
                            :label="item.category_name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="文章标签"
                    prop="tagIdList"
                >
                    <el-select
                        v-model="article.tagIdList"
                        placeholder="请选择文章标签"
                        filterable
                        clearable
                        multiple
                        allow-create
                        :multiple-limit="3"
                    >
                        <el-option
                            v-for="item in tagOptionList"
                            :key="item.id"
                            :label="item.tag_name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item 
                label="是否置顶">
                    <el-switch
                        v-model="article.is_top"
                        size="small"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="2"
                    />
                </el-form-item>
                <el-form-item 
                    prop="article_content" 
                    style="width: 1200px;margin-top: 10px;">
                    <v-md-editor 
                        v-model="article.article_content" 
                        @save="submitForm(dialogArticleFormRef)" 
                        height="100vh"
                        placeholder="使用md格式即可轻松编辑文本 :-) ">
                    </v-md-editor>
                </el-form-item>
            </el-form>
        </div>
       
        <!-- <el-text type="danger" style="margin-left: 15px;margin-top: 10px;">{{ msg }}</el-text> -->
        <!-- <div style="width: 1200px;margin-top: 10px;">
            <v-md-editor v-model="article.content" @save="save" height="100vh"
                placeholder="使用md格式即可轻松编辑文本 :-) "></v-md-editor>
        </div> -->
    </div>
    <LayoutFooter />
</template>

<style scoped>
.tag {
    margin-right: 5px;
}

.title {
    font-size: 14px;
    font-weight: bolder;
}

.input {
    margin-top: 10px;
    margin-bottom: 10px;
}

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;
}
</style>