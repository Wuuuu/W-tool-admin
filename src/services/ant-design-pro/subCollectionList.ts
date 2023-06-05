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

/** 新建合集子类别内容 POST /api/knowledge-subCategory/create */
export async function addSubCategoryContent(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/knowledge-subCategory/create', {
    method: 'POST',
    data: options || {},
  });
}

/** 删除合集子类别 DELETE /api/knowledge-category/delete */
export async function removeSubCategory(_id?: string) {
  return request<Record<string, any>>(`/api/knowledge-subCategory/${_id}`, {
    method: 'DELETE',
  });
}
