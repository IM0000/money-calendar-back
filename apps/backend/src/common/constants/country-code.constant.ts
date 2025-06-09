export const COUNTRY_CODE_MAP = {
  USA: 'USA',
  KOR: 'KOR',
} as const;

export type COUNTRY_CODE =
  (typeof COUNTRY_CODE_MAP)[keyof typeof COUNTRY_CODE_MAP];
