import { request } from '@umijs/max';

/** 获取合集子类列表 GET /api/knowledge-subCategory/{id} */
export async function getSubCategory(params: { categoryId?: string }) {
  return request<API.SubCategory>(`/api/knowledge-subCategory/${params.categoryId}`, {
    method: 'GET',
  });
}

/** 新建合集子类别 POST /api/knowledge-subCategory/create */
export async function addSubCategory(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/knowledge-subCategory/create', {
    method: 'POST',
    data: options || {},
  });
}

/** 新建子类别问答列表 POST /api/subCategory-list/create */
export async function addQuestionContent(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/subCategory-list/create', {
    method: 'POST',
    data: options || {},
  });
}

/** 删除合集子类别 DELETE /api/knowledge-category/delete */
export async function removeSubCategory(currentSubCategoryId?: string) {
  return request<Record<string, any>>(`/api/knowledge-subCategory/${currentSubCategoryId}`, {
    method: 'DELETE',
  });
}

/** 更新子类别问答列表 PATCH /api/subCategory-list/{id} */
export async function updateQuestionContent(options: { [key: string]: any }) {
  const { questionId, ...params } = options;
  return request<Record<string, any>>(`/api/subCategory-list/${questionId}`, {
    method: 'PATCH',
    data: params || {},
  });
}
