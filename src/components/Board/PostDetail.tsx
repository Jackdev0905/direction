import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ArrowLeft, Calendar, User, Tag, Edit, Trash2, MessageSquare } from 'lucide-react';
import { postsApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { POST_CATEGORIES } from '../../utils/constants';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: post, isLoading, error } = useQuery(
    ['post', id],
    () => postsApi.getPost(id!),
    {
      enabled: !!id,
      retry: 1,
    }
  );

  const deleteMutation = useMutation(
    () => postsApi.deletePost(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
        navigate('/posts');
      },
      onError: (error: any) => {
        console.error('Delete error:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
      },
    }
  );

  const getCategoryLabel = (categoryValue: string) => {
    const category = POST_CATEGORIES.find(cat => cat.value === categoryValue);
    return category?.label || categoryValue;
  };

  const getCategoryColor = (categoryValue: string) => {
    switch (categoryValue) {
      case 'NOTICE':
        return 'bg-red-100 text-red-800';
      case 'QNA':
        return 'bg-green-100 text-green-800';
      case 'FREE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return formatDate(dateString);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.')) {
      try {
        await deleteMutation.mutateAsync();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex items-center space-x-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시글을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">
            존재하지 않는 게시글이거나 삭제된 게시글입니다.
          </p>
          <Link
            to="/posts"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            게시판으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.userId;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/posts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">목록으로 돌아가기</span>
        </Link>
      </div>

      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                {getCategoryLabel(post.category)}
              </span>
              <span className="text-sm text-gray-500">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/posts/edit/${post.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isLoading}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteMutation.isLoading ? '삭제 중...' : '삭제'}
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">{post.userId}</span>
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
              {post.body}
            </div>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50/30 p-6">
            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50/50 p-6">
            <div className="text-sm text-gray-500">
              게시글 ID: <span className="font-mono">{post.id}</span>
            </div>
            
            
        </div>
      </article>

      {deleteMutation.isError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">삭제 실패</h3>
            <p className="text-gray-600 mb-4">
              게시글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => deleteMutation.reset()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;