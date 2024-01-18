export interface ItemProps {
  _id: string;
  key: number;
  languageField: string;
  desc: string;
  id: string;
  fr: string;
  ar: string;
  hi: string;
  bn: string;
  lo: string;
  vi: string;
  newItem?: boolean;
}

export interface EditableRowProps {
  index: number;
}
