/**
 * 注意！ 本文件代码用以获取后端数据
 * 为了文件结构而保留，其本身需根据您的需求进行编写
 * 在组件中已经将此部分注释
 * @author xxh 2023-6-3
 */

import httpInstance from "@/utils/request";

// 与搜索有关的文章
export function getSearch(data) {
    return httpInstance({
        url: `/article/getArticleListByContent`,
        method: 'post',
        data
    });
}