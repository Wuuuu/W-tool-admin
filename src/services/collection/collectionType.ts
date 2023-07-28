import { request } from '@umijs/max';

/** 获取合集类型 GET /api/collection-type/list */
export async function getCollectionTypeList() {
  return request(`/api/collection-type/list`, {
    method: 'GET',
  });
}

/** 新增合集类型 POST /api/collection-type/create */
export async function addCollectionType(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/collection-type/create', {
    method: 'POST',
    data: options || {},
  });
}
