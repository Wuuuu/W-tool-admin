// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username: string;
    nickname?: string;
    // name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    data: {
      access_token: string;
    };
    success: boolean;
    code: number;
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type CollectionListItem = {
    _id: string;
    coverUrl: any;
    collectionName: string;
    summary?: string;
    likeCount?: number;
    updatedTime?: string;
    createdTime?: string;
  };

  type CollectionList = {
    data?: CollectionListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type SubCategory = {
    data: SubCategoryItem[];
    code?: number;
    status?: string;
    message?: string;
  };

  type SubCategoryItem = {
    _id: string;
    subCategoryId: string;
    subCategoryName: string;
    categoryId: string;
    list?: any[];
    content?: string;
    createdTime?: string;
    updatedTime?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    // autoLogin?: boolean;
    // type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type IntlProjectProps = {
    projectName: string;
    projectType: string;
    coverUrl: string;
    description: string;
  };

  type TranslateTextProps = {
    translatText: string;
    targetLang: string[];
    detectedSourceLang?: string;
  };
}
