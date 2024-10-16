/**
 * 注意！ 本文件代码用以获取后端数据
 * 为了文件结构而保留，其本身需根据您的需求进行编写
 * 在组件中已经将此部分注释
 * @author xxh 2023-6-3
 */

// 获取文章信息
import httpInstance from "@/utils/request";

// 根据aid 获取文章信息
export function getArticleDetails(aid) {
    return httpInstance({
        url: `/article/${aid}`,
        method: 'get'
    });
}




// yyp
// 获取分类字典
export function getCategoryDictionary() {
    return httpInstance({
        url: `/Category/getCategoryDictionary`,
        method: 'get'
    });
}

// 获取标签字典
export function getTagDictionary() {
    return httpInstance({
        url: `/tag/getTagDictionary`,
        method: 'get'
    });
}

// 新增文章
export function addArticle(data) {
    return httpInstance({
        url: `/article/add`,
        method: 'post',
        data: data
    });
}

// 修改文章
export function editArticle(data) {
    return httpInstance({
        url: `/article/update`,
        method: 'put',
        data: data
    });
}

// 用户删除这篇文章
export function deleteArt(id, status) {
    return httpInstance({
        url: `/article/delete/${id}/${status}`,
        method: 'delete',
    });
}

// 获取主页文章信息
export function getHomeArticleDetails(aid) {
    return httpInstance({
        url: `/article/getArticleById/${aid}`,
        method: 'get'
    });
}

// 文章点赞(成功后，加载 addLike 接口)
export function articleLike(aid) {
    return httpInstance({
        url: `/article/like/${aid}`,
        method: 'put'
    });
}

// 取消文章点赞(取消成功后，加载 cancelLike 接口)
export function cancelArticleLike(aid) {
    return httpInstance({
        url: `/article/cancelLike/${aid}`,
        method: 'put'
    });
}

// 文章点赞
export function addLike(data) {
    return httpInstance({
        url: `/like/addLike`,
        method: 'post',
        data: data
    });
}

/** 判断当前用户是否点赞了 */
export function getIsLikeByIdAndType(data) {
    return httpInstance({
        url: `/like/getIsLikeByIdAndType`,
        method: 'post',
        data: data
    });
}

// 取消点赞
export function cancelLike(data) {
    return httpInstance({
        url: `/like/cancelLike`,
        method: 'post',
        data: data
    });
}

// 获取所有的分类信息
export function getTypes() {
    return httpInstance({
        url: `/tag/getTagDictionary`,
        method: 'get',
    });
}

// 获取获取热门文章
export function getHotArticle() {
    return httpInstance({
        url: `/article/getHotArticle`,
        method: 'get'
    });
}


// 获取父级评论
export function frontGetParentComment(data) {
    return httpInstance({
        url: `/comment/frontGetParentComment`,
        method: 'post',
        data: data
    });
}

// 获取子级评论
export function frontGetChildrenComment(data) {
    return httpInstance({
        url: `/comment/frontGetChildrenComment`,
        method: 'post',
        data: data
    });
}

// 发表评论（父级）
export function addComment(data) {
    return httpInstance({
        url: `/comment/add`,
        method: 'post',
        data: data
    });
}

// 回复评论信息（子级）
export function applyComment(send) {
    return httpInstance({
        url: `/comment/apply`,
        method: 'post',
        data: send
    });
}

// 删除评论信息
export function deleteComment(id, parent_id = 0) {
    return httpInstance({
        url: `/comment/delete/${id}/${parent_id}`,
        method: 'delete',
    });
}