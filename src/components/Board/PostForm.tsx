import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Save, X } from 'lucide-react';
import { postsApi } from '../../services/api';
import { PostCreateRequest, PostUpdateRequest, Category } from '../../types';
import { POST_CATEGORIES, FORBIDDEN_WORDS } from '../../utils/constants';
import { containsForbiddenWords, validateTags } from '../../utils/validation';

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<PostCreateRequest>({
    title: '',
    body: '',
    category: Category.FREE,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: post, isLoading: isLoadingPost } = useQuery(
    ['post', id],
    () => postsApi.getPost(id!),
    {
      enabled: isEdit,
      onSuccess: (data) => {
        setFormData({
          title: data.title,
          body: data.body,
          category: data.category,
          tags: data.tags,
        });
      },
    }
  );

  const createMutation = useMutation(postsApi.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      navigate('/posts');
    },
  });

  const updateMutation = useMutation(
    (data: PostUpdateRequest) => postsApi.updatePost(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', id]);
        navigate(`/posts/${id}`);
      },
    }
  );

  const isLoading = isLoadingPost || createMutation.isLoading || updateMutation.isLoading;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 80) {
      newErrors.title = '제목은 80자 이내로 입력해주세요.';
    } else if (containsForbiddenWords(formData.title)) {
      newErrors.title = '제목에 금지된 단어가 포함되어 있습니다.';
    }

    if (!formData.body.trim()) {
      newErrors.body = '내용을 입력해주세요.';
    } else if (formData.body.length > 2000) {
      newErrors.body = '내용은 2000자 이내로 입력해주세요.';
    } else if (containsForbiddenWords(formData.body)) {
      newErrors.body = '내용에 금지된 단어가 포함되어 있습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const newTags = validateTags([...formData.tags, tagInput.trim()]);
    setFormData(prev => ({ ...prev, tags: newTags }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (isEdit && isLoadingPost) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로 가기
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? '게시글 수정' : '새 게시글'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              {POST_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="제목을 입력해주세요 (최대 80자)"
              maxLength={80}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.title.length}/80
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (최대 5개)
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="태그를 입력 후 Enter 키를 누르세요"
                maxLength={24}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-primary-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {formData.tags.length}/5 (각 태그 최대 24자)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 *
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                errors.body ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="내용을 입력해주세요 (최대 2000자)"
              maxLength={2000}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-600">{errors.body}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.body.length}/2000
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              금지어 안내
            </h3>
            <p className="text-sm text-yellow-700">
              다음 단어는 사용할 수 없습니다: {FORBIDDEN_WORDS.join(', ')}
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '저장 중...' : (isEdit ? '수정하기' : '작성하기')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;