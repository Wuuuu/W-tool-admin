export interface ItemProps {
  _id: string;
  key: number;
  languageField: string;
  desc: string;
  'zh-CN': string;
  'en-US': string;
  ja: string;
  ko: string;
  es: string;
  pt: string;
  id: string;
  fr: string;
  ar: string;
  hi: string;
  bn: string;
  lo: string;
  vi: string;
  updated_time?: string;
  newItem?: boolean;
}

export interface EditableRowProps {
  index: number;
}
