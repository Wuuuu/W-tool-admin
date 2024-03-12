import { omit } from 'lodash';
import { ItemProps } from './index.d';

export const initDataItem = {
  moduleClassification: '',
  languageField: '',
  desc: '',
  'zh-CN': '',
  'zh-TW': '',
  'en-US': '',
  ja: '',
  ko: '',
  de: '',
  es: '',
  pt: '',
  id: '',
  fr: '',
  ar: '',
  hi: '',
  bn: '',
  lo: '',
  vi: '',
};

export function getLanguageCodeList() {
  const languageObject = omit(initDataItem, ['desc', 'languageField', 'moduleClassification']);
  return Object.keys(languageObject);
}

export function generatJsonFiles(data: ItemProps[]) {
  const dataJson = JSON.stringify(data);
  const blob = new Blob([dataJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;

  a.download = 'messages.json';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
