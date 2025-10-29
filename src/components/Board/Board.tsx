import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Plus} from 'lucide-react';
import { postsApi } from '../../services/api';
import { PostSearchParams, Category, SortField, SortOrder } from '../../types';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import PostList from './PostList';
import SearchFilters from './SearchFilters';

const Board: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PostSearchParams>({
    limit: ITEMS_PER_PAGE,
    sort: SortField.CREATED_AT,
    order: SortOrder.DESC,
  });

  const [paginationHistory, setPaginationHistory] = useState<string[]>([]);

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['posts', searchParams],
    () => postsApi.getPosts(searchParams),
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: search || undefined,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
    setPaginationHistory([]); 
  };

  const handleCategoryChange = (category: Category | '') => {
    setSearchParams(prev => ({
      ...prev,
      category: category || undefined,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
    setPaginationHistory([]);
  };

  const handleSortChange = (sort: 'title' | 'createdAt', order: 'asc' | 'desc') => {
    setSearchParams((prev:any) => ({
      ...prev,
      sort,
      order,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
    setPaginationHistory([]);
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setSearchParams(prev => ({
      ...prev,
      from: from || undefined,
      to: to || undefined,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
    setPaginationHistory([]);
  };

  const handleLoadNext = () => {
    if (postsData?.nextCursor) {
      setPaginationHistory(prev => [...prev, searchParams.nextCursor || '']); 
      setSearchParams(prev => ({
        ...prev,
        nextCursor: postsData.nextCursor || undefined,
        prevCursor: undefined, 
      }));
    }
  };

  const handleLoadPrev = () => {
    if (paginationHistory.length > 0) {
      const previousCursor = paginationHistory[paginationHistory.length - 1];
      const newHistory = paginationHistory.slice(0, -1);
      
      setSearchParams(prev => ({
        ...prev,
        prevCursor: previousCursor || undefined,
        nextCursor: undefined, 
      }));
      setPaginationHistory(newHistory);
    }
  };

  const handleResetPagination = () => {
    setSearchParams(prev => ({
      ...prev,
      nextCursor: undefined,
      prevCursor: undefined,
    }));
    setPaginationHistory([]);
  };

  const hasNextPage = !!postsData?.nextCursor;
  const hasPrevPage = paginationHistory.length > 0;
  const currentPage = paginationHistory.length + 1;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-red-600 text-lg mb-4">게시글을 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => refetch()}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">게시판</h1>
        <Link
          to="/posts/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>글쓰기</span>
        </Link>
      </div>

      <SearchFilters
        searchParams={searchParams}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onDateRangeChange={handleDateRangeChange}
      />

      <PostList
        posts={postsData?.items || []}
        isLoading={isLoading}
        hasNext={hasNextPage}
        hasPrev={hasPrevPage}
        onLoadNext={handleLoadNext}
        onLoadPrev={handleLoadPrev}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Board;