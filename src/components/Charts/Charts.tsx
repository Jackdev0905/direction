import React from 'react';
import TopCoffeeBrandsChart from './TopCoffeeBrandsChart';
import WeeklyMoodTrendChart from './WeeklyMoodTrendChart';
import CoffeeConsumptionChart from './CoffeeConsumptionChart';

const Charts: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">데이터 시각화</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            인기 커피 브랜드
          </h2>
          <TopCoffeeBrandsChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            주간 기분 트렌드
          </h2>
          <WeeklyMoodTrendChart />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          커피 소비량과 생산성 관계
        </h2>
        <CoffeeConsumptionChart />
      </div>
    </div>
  );
};

export default Charts;