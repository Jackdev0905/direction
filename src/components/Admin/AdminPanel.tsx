import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Trash2, Database, Download, AlertTriangle, CheckCircle, BarChart3, Users, Archive } from 'lucide-react';
import { postsApi, mockApi } from '../../services/api';
import { Post } from '../../types';

const AdminPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const [mockCount, setMockCount] = useState(50);
  const [activeTab, setActiveTab] = useState<'stats' | 'mock' | 'management'>('stats');

  const { data: postsData, isLoading: isLoadingPosts } = useQuery(
    ['posts', 'stats'],
    () => postsApi.getPosts({ limit: 100 }), 
    {
      refetchOnWindowFocus: false,
    }
  );

  const deleteAllMutation = useMutation(postsApi.deleteAllPosts, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      queryClient.invalidateQueries(['posts', 'stats']);
    },
  });

const generateMockMutation = useMutation(
  () => mockApi.getMockPosts(mockCount),
  {
    onSuccess: async (response: any) => {
      try {
        console.log('Raw API response:', response);
        
        let mockPosts: Post[] = [];
        
        if (Array.isArray(response)) {
          mockPosts = response;
        } else if (response && Array.isArray(response.items)) {
          mockPosts = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          mockPosts = response.data;
        } else if (response && typeof response === 'object') {
          const arrays = Object.values(response).filter(val => Array.isArray(val));
          if (arrays.length > 0) {
            mockPosts = arrays[0] as Post[];
          }
        }
        
        console.log('Extracted mock posts:', mockPosts);
        
        if (!Array.isArray(mockPosts) || mockPosts.length === 0) {
          throw new Error(`Invalid response format: ${JSON.stringify(response)}`);
        }

        let createdCount = 0;
        let errorCount = 0;

        for (const post of mockPosts) {
          try {
            await postsApi.createPost({
              title: post.title || '제목 없음',
              body: post.body || '내용 없음',
              category: post.category || 'FREE',
              tags: post.tags || ['sample'],
            });
            createdCount++;
            
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.error('Failed to create post:', post.title, error);
            errorCount++;
          }
        }

        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['posts', 'stats']);

        if (errorCount > 0) {
          alert(`${createdCount}개의 게시글 생성 성공, ${errorCount}개 실패`);
        } else {
          alert(`${createdCount}개의 Mock 게시글이 성공적으로 생성되었습니다.`);
        }
      } catch (error) {
        console.error('Error in mock data generation:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Mock data generation error:', error);
      alert(`Mock 데이터 생성 실패: ${error.message}`);
    },
  }
);
  

  const handleDeleteAll = async () => {
    const postCount = postsData?.items.length || 0;
    if (postCount === 0) {
      alert('삭제할 게시글이 없습니다.');
      return;
    }

    if (window.confirm(`정말로 모든 게시글(${postCount}개)을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await deleteAllMutation.mutateAsync();
        alert('모든 게시글이 삭제되었습니다.');
      } catch (error) {
        console.error('Delete all error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleGenerateMock = async () => {
    if (mockCount < 1 || mockCount > 500) {
      alert('1에서 500 사이의 숫자를 입력해주세요.');
      return;
    }

    if (window.confirm(`${mockCount}개의 Mock 게시글을 생성하시겠습니까?\n기존 데이터는 유지됩니다.`)) {
      try {
        await generateMockMutation.mutateAsync();
      } catch (error) {
      }
    }
  };

  const currentPostCount = postsData?.items.length || 0;
  const currentPosts = postsData?.items || [];

  const categoryDistribution = currentPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">관리자 패널</h1>
        <p className="text-gray-600 mt-2">데이터 관리 및 시스템 설정</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'stats', name: '통계', icon: BarChart3 },
            { id: 'mock', name: 'Mock 데이터', icon: Database },
            { id: 'management', name: '데이터 관리', icon: Archive },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 게시글</p>
                  <p className="text-3xl font-bold text-gray-900">{currentPostCount}</p>
                  <p className="text-xs text-gray-500 mt-1">총 게시글 수</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">데이터 상태</p>
                  <p className={`text-lg font-semibold ${
                    currentPostCount > 0 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {currentPostCount > 0 ? '정상' : '데이터 없음'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">시스템 상태</p>
                </div>
                {currentPostCount > 0 ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">카테고리 수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(categoryDistribution).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">다양한 카테고리</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {Object.keys(categoryDistribution).length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리 분포</h3>
              <div className="space-y-3">
                {Object.entries(categoryDistribution).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category.toLowerCase()}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(count / currentPostCount) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mock' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-green-500" />
              Mock 데이터 생성
            </h3>
            <p className="text-gray-600 mb-6">
              테스트용 Mock 게시글을 생성합니다. 다양한 카테고리와 태그를 가진 샘플 데이터가 생성됩니다.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생성할 게시글 수 (1-500)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={mockCount}
                  onChange={(e) => setMockCount(Math.max(1, Math.min(500, Number(e.target.value))))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  현재 <span className="font-semibold">{currentPostCount}개</span>의 게시글이 있습니다. Mock 데이터를 생성하면 기존 데이터에 추가됩니다.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <Database className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Mock 데이터 정보</p>
                    <p className="text-sm text-blue-700 mt-1">
                      • 다양한 카테고리(NOTICE, QNA, FREE)로 생성됩니다<br/>
                      • 샘플 태그가 포함됩니다<br/>
                      • 실제 같은 테스트 데이터입니다<br/>
                      • 기존 데이터는 유지됩니다
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleGenerateMock}
                disabled={generateMockMutation.isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Database className="h-5 w-5 mr-2" />
                {generateMockMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    생성 중...
                  </>
                ) : (
                  `${mockCount}개 Mock 데이터 생성`
                )}
              </button>
            </div>
          </div>

          {generateMockMutation.isSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <p className="text-green-700 font-medium">Mock 데이터 생성 완료</p>
                  <p className="text-green-600 text-sm mt-1">
                    {mockCount}개의 게시글이 성공적으로 생성되었습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {generateMockMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <p className="text-red-700 font-medium">Mock 데이터 생성 실패</p>
                  <p className="text-red-600 text-sm mt-1">
                    생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'management' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-red-500" />
            데이터 관리
          </h3>
          <p className="text-gray-600 mb-6">
            시스템 데이터를 관리합니다. 주의해서 사용해주세요.
          </p>
          
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">위험한 작업</p>
                  <p className="text-sm text-red-700 mt-1">
                    이 작업은 모든 게시글 데이터를 영구적으로 삭제합니다. 삭제된 데이터는 복구할 수 없습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800">현재 데이터 현황</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    총 {currentPostCount}개의 게시글이 저장되어 있습니다.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-800">{currentPostCount}</p>
                  <p className="text-sm text-yellow-600">게시글</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDeleteAll}
              disabled={deleteAllMutation.isLoading || currentPostCount === 0}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              {deleteAllMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  삭제 중...
                </>
              ) : (
                '모든 게시글 삭제'
              )}
            </button>
          </div>

          {/* Status Message */}
          {deleteAllMutation.isSuccess && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-700">
                  모든 게시글이 성공적으로 삭제되었습니다.
                </p>
              </div>
            </div>
          )}

          {deleteAllMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700">
                  삭제 중 오류가 발생했습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;