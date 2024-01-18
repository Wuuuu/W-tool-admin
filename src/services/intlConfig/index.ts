import { request } from '@umijs/max';
import { DeleteTranslationItemProps, PatchTranslationProps } from './typeings';

/** 获取多语言项目列表 GET /api/language-config/list */
export async function getIntlProjectList() {
  return request(`/api/language-config/list`, {
    method: 'GET',
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

/** 删除合集子类别 DELETE /api/language-config/{id} */
export async function removeIntlItemData(options: DeleteTranslationItemProps) {
  return request(`/api/language-config/delete`, {
    method: 'POST',
    data: options || {},
  });
}

/** gpt4model 批量翻译成多语言 GET /api/openai-service/patch-translation-gpt4 */
export async function patchTranslationByGpt4(params: PatchTranslationProps) {
  return request('/api/openai-service/patch-translation-gpt4', {
    method: 'POST',
    data: params,
  });
}
