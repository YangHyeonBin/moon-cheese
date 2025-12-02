export const CATEGORY = {
  CHEESE: 'CHEESE',
  CRACKER: 'CRACKER',
  TEA: 'TEA',
} as const;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export const CATEGORY_DISPLAY_NAME: Record<Category, string> = {
  CHEESE: '치즈',
  CRACKER: '크래커',
  TEA: '티',
};
