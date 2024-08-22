/**
 * 注意！ 本文件代码用以获取后端数据
 * 为了文件结构而保留，其本身需根据您的需求进行编写
 * 在组件中已经将此部分注释
 * @author xxh 2023-6-3
 */

import httpInstance from "@/utils/request";

//获取用户标签信息
export function getUserTagList(){
    return httpInstance({
        url:`/tag/tagList`,
        method:'get',
    })
}

export function getUserArticleList(){
    return httpInstance({
        url:`/article`,
        method:'get',
    })
}



// 更新标签值
export function updateTagName(tag){
    return httpInstance({
        url:`/tag`,
        method:'put',
        data:tag
    })
}

// 删除一个标签
export function deleteTag(tagId) {
    return httpInstance({
        url:`/tag/${tagId}`,
        method:'delete',
    })
}

// 新增标签
export function postNewTag(tag){
    return httpInstance({
        url:`/tag`,
        method:'post',
        data:tag
    })
}

// yyp
// 获取当前登录人的信息(重复api/login.js  getUserInfoById)
export function getUserInfo(id){
    return httpInstance({
        url:`/api/user/getUserInfoById/${id}`,
        method:'get',
    })
}

// 用户修改密码
export function updateUserPassword(data){
    return httpInstance({
        url:'/api/user/updatePassword',
        method:'put',
        data: data
    })
}

// 用户修改个人信息 （更新用户信息）
export function updateUserInfo(data){
    return httpInstance({
        url:'/api/user/updateOwnUserInfo',
        method:'put',
        data: data
    })
}

