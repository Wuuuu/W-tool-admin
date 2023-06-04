import { request } from '@umijs/max';

/** 获取合集子类列表 GET /api/login/captcha */
export async function getSubCategory(
  params: {
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
