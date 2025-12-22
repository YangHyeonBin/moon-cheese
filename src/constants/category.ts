import type { TagType } from '@/ui-lib';

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

/**
 * UI 라이브러리의 요구사항에 맞게 도메인 타입인 Category를 변환
 * => 냅다 lowercase하지 말고 태그 타입으로 변경하는 함수 만들기
 */
// export const categoryToTagType = (category: Category): TagType => {
//   return category.toLowerCase() as TagType;
// };

export const CATEGORY_TO_TAG_TYPE: Record<Category, TagType> = {
  CHEESE: 'cheese',
  CRACKER: 'cracker',
  TEA: 'tea',
};
