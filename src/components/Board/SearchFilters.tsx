import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Calendar } from 'lucide-react';
import { PostSearchParams, Category, SortField, SortOrder } from '../../types';
import { POST_CATEGORIES } from '../../utils/constants';

interface SearchFiltersProps {
  searchParams: PostSearchParams;
  onSearch: (search: string) => void;
  onCategoryChange: (category: Category | '') => void;
  onSortChange: (sort: SortField, order: SortOrder) => void;
  onDateRangeChange: (from: string, to: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchParams,
  onSearch,
  onCategoryChange,
  onSortChange,
  onDateRangeChange,
}) => {
  const [searchInput, setSearchInput] = useState(searchParams.search || '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    
    if (newFromDate && toDate) {
      onDateRangeChange(newFromDate, toDate);
    } else if (!newFromDate && !toDate) {
      onDateRangeChange('', '');
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToDate = e.target.value;
    setToDate(newToDate);
    
    if (fromDate && newToDate) {
      onDateRangeChange(fromDate, newToDate);
    } else if (!fromDate && !newToDate) {
      onDateRangeChange('', '');
    }
  };

  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
    onDateRangeChange('', '');
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="제목 또는 내용 검색..."
            />
          </form>
        </div>

        <div className="w-full lg:w-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center space-x-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    max={toDate || getTodayDate()}
                    className="block w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="From date"
                  />
                </div>
                <span className="hidden sm:inline text-gray-400 self-center">~</span>
                <div className="relative">
                  <input
                    type="date"
                    value={toDate}
                    onChange={handleToDateChange}
                    min={fromDate}
                    max={getTodayDate()}
                    className="block w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="To date"
                  />
                </div>
                {(fromDate || toDate) && (
                  <button
                    onClick={clearDateFilter}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.category || ''}
              onChange={(e) => onCategoryChange(e.target.value as Category | '')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">모든 카테고리</option>
              {POST_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full lg:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={`${searchParams.sort}-${searchParams.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-') as [SortField, SortOrder];
                onSortChange(sort, order);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="createdAt-desc">최신순</option>
              <option value="createdAt-asc">오래된순</option>
              <option value="title-asc">제목 가나다순</option>
              <option value="title-desc">제목 가나다역순</option>
            </select>
          </div>
        </div>
      </div>

      {(fromDate || toDate) && (
        <div className="mt-3 flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <Calendar className="h-4 w-4" />
            <span>
              {fromDate && toDate 
                ? `기간: ${fromDate} ~ ${toDate}`
                : fromDate 
                ? `From: ${fromDate}`
                : `To: ${toDate}`
              }
            </span>
          </div>
          <button
            onClick={clearDateFilter}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;