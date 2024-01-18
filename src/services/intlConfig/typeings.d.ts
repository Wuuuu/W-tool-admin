export type PatchTranslationProps = {
  translatText: string;
  detectedSourceLang: string;
  targetLang: string[];
};

export type DeleteTranslationItemProps = {
  parentId: string;
  id: string;
};
