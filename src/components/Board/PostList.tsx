import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Post } from '../../types';
import { POST_CATEGORIES } from '../../utils/constants';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  onLoadNext: () => void;
  onLoadPrev: () => void;
  currentPage: number;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  isLoading,
  hasNext,
  hasPrev,
  onLoadNext,
  onLoadPrev,
  currentPage,
}) => {
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
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-6 border-b border-gray-200 animate-pulse">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
        <div className="text-gray-400 mb-4">
          <MessageSquare className="h-16 w-16 mx-auto" />
        </div>
        <p className="text-gray-500 text-lg mb-2">게시글이 없습니다.</p>
        <p className="text-gray-400 text-sm">첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {posts.map((post) => (
          <article key={post.id} className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.userId}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
            
            <Link to={`/posts/${post.id}`} className="block group">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 line-clamp-2 mb-3">
                {post.body}
              </p>
            </Link>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {(hasNext || hasPrev) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={onLoadPrev}
                disabled={!hasPrev || isLoading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <button
                onClick={onLoadNext}
                disabled={!hasNext || isLoading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && posts.length > 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading more posts...</p>
        </div>
      )}
    </div>
  );
};

export default PostList;