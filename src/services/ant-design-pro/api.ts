// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import _pick from 'lodash/pick';

/** 获取当前的用户 GET /api/user/info */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/auth/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/auth/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: _pick(body, ['username', 'password']),
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/knowledge-category/list */
export async function knowledgeList(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.CollectionList>('/api/knowledge-category/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新合集 PATCH /api/knowledge-category/update */
export async function updateCollection(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/knowledge-category/update/${options?.id}`, {
    method: 'PATCH',
    data: options || {},
  });
}

/** 新建合集 POST /api/knowledge-category/create */
export async function addCollection(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/knowledge-category/create', {
    method: 'POST',
    data: options || {},
    // ...(options || {}),
  });
}

/** 删除规则 DELETE /api/knowledge-category/delete */
export async function removeCollection(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/knowledge-category/delete/${options?.id}`, {
    method: 'DELETE',
  });
}
