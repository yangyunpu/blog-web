<!-- 用户主页左栏 -->
<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue'
// 导入图标
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    ChatLineSquare
} from '@element-plus/icons-vue'
// 使用路由
const router = useRouter();
// 监听按钮状态
const createArticle=()=>{
    console.log('editor')
    router.push({
        path: '/editor',
        query: {
            modify: 0
        }
    })
}

// 用户主页
const jumpUserHome = () => {
    router.push({
        path: '/userHome'
    })
}

// 全部文章
const jumpArticle = () => {
    router.push({
        path: '/userHome/article'
    })
}

// 跳转标签
const jumpTags = () => {
    router.push({
        path: '/userHome/tags'
    })
}

// 暂未开通页面
const jumpEmpty = () => {
    router.push({
        path: '/empty' // 暂未开通页面
    })
}

// 跳转修改资料
const jumpProfile = () => {
    router.push({
        path: '/userHome/profile'
    })
}

// 跳转修改资料
const jumpPassword = () => {
    router.push({
        path: '/userHome/password'
    })
}


</script>

<template>
    <div>
        <!-- 创建文章 -->
        <el-button type="success" @click="createArticle" style="margin-bottom: 15px;">
            快速创建文章 new+
        </el-button>
        <!-- 菜单组件 -->
        <el-menu class="card">
            <!-- 菜单1 -->
            <el-menu-item index="0" @click="jumpUserHome">
                <el-icon><icon-menu /></el-icon>
                <template #title>我的主页</template>
            </el-menu-item>
            <!-- 菜单2 -->
            <el-menu-item index="1" @click="jumpArticle">
                <el-icon>
                    <document />
                </el-icon>
                <template #title>我的文章</template>
            </el-menu-item>
            
            <!-- 菜单3 -->
            <el-menu-item index="2" @click="jumpTags">
                <el-icon><icon-menu /></el-icon>
                <template #title>我的标签</template>
            </el-menu-item>
            <!-- 菜单4 -->
            <el-menu-item index="3" @click="jumpEmpty">
                <el-icon><ChatLineSquare /></el-icon>
                <template #title>所有评论</template>
            </el-menu-item>
            <!-- 菜单5 -->
            <el-sub-menu index="4">
                <template #title>
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>设置</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="4-1" @click="jumpProfile">修改资料</el-menu-item>
                    <el-menu-item index="4-2" @click="jumpPassword">修改密码</el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </div>
</template>
  
  
<style scoped>
/* 样式 */
.card{
    width: 200px;
    min-height: 400px;
    border-radius: 10px;
}
</style>
  