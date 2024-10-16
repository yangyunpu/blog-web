/**
 * 注意！ 本文件代码用以获取后端数据
 * 为了文件结构而保留，其本身需根据您的需求进行编写
 * 在组件中已经将此部分注释
 * @author xxh 2023-6-3
 */

import httpInstance from "@/utils/request";



export function getUserArticleList(){
    return httpInstance({
        url:`/article`,
        method:'get',
    })
}







// yyp
//获取用户标签信息(分页)
export function getUserTagList(data){
    return httpInstance({
        url:`/tag/getTagList`,
        method:'post',
        data: data
    })
}

// 新增标签
export function postNewTag(tag){
    return httpInstance({
        url:`/tag/add`,
        method:'post',
        data: tag
    })
}

// 更新标签值
export function updateTagName(tag){
    return httpInstance({
        url:`/tag/update`,
        method:'put',
        data:tag
    })
}

// 删除一个标签
export function deleteTag(data) {
    return httpInstance({
        url:`/tag/delete`,
        method:'post',
        data
    })
}


// 获取当前登录人的信息(重复api/login.js  getUserInfoById)
export function getUserInfo(id){
    return httpInstance({
        url:`/user/getUserInfoById/${id}`,
        method:'get',
    })
}

// 用户修改密码
export function updateUserPassword(data){
    return httpInstance({
        url:'/user/updatePassword',
        method:'put',
        data: data
    })
}

// 用户修改个人信息 （更新用户信息）
export function updateUserInfo(data){
    return httpInstance({
        url:'/user/updateOwnUserInfo',
        method:'put',
        data: data
    })
}

