import { FORBIDDEN_WORDS } from './constants';

export const containsForbiddenWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_WORDS.some(word => lowerText.includes(word.toLowerCase()));
};

export const validateTags = (tags: string[]): string[] => {
  const uniqueTags = Array.from(new Set(tags.map(tag => tag.trim()).filter(tag => tag.length > 0)));
  return uniqueTags.slice(0, 5).filter(tag => tag.length <= 24);
};

export const validatePost = (title: string, body: string): string[] => {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push('제목을 입력해주세요.');
  } else if (title.length > 80) {
    errors.push('제목은 80자 이내로 입력해주세요.');
  }

  if (!body.trim()) {
    errors.push('내용을 입력해주세요.');
  } else if (body.length > 2000) {
    errors.push('내용은 2000자 이내로 입력해주세요.');
  }

  if (containsForbiddenWords(title) || containsForbiddenWords(body)) {
    errors.push('금지된 단어가 포함되어 있습니다.');
  }

  return errors;
};