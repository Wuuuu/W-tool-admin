import { request } from '@umijs/max';

/** 获取多语言项目列表 GET /api/language-config/list */
export async function getIntlProjectList() {
  return request(`/api/language-config/list`, {
    method: 'GET',
  });
}

/** 新增多语言项目 GET /api/language-config/create */
export async function addIntlProject(params: API.IntlProjectProps) {
  return request(`/api/language-config/create`, {
    method: 'POST',
    data: params,
  });
}

/** 获取项目多语言数据配置 GET /api/language-config/:id */
export async function getIntlConfigData(id?: string) {
  return request(`/api/language-config/${id}`, {
    method: 'GET',
  });
}

/** 添加项多语言数据项 GET /api/language-config/:id/add */
export async function addListConfigData(id: string, options?: { [key: string]: any }) {
  return request(`/api/language-config/${id}/add`, {
    method: 'POST',
    data: options || {},
  });
}

/** 翻译文本 POST /api/translator */
export async function translateText(params: API.TranslateTextProps) {
  return request<Record<string, any>>('/api/translator', {
    method: 'POST',
    data: params,
  });
}
