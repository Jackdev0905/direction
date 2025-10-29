import React from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { mockApi } from '../../services/api';

const WeeklyMoodTrendChart: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'weeklyMoodTrend',
    mockApi.getWeeklyMoodTrend
  );

  if (isLoading) {
    return <div className="h-80 flex items-center justify-center">Loading...</div>;
  }

  if (error || !data) {
    return <div className="h-80 flex items-center justify-center">Error loading data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stacked Bar Chart */}
      <div className="h-80">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">스택형 바 차트</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            <Bar dataKey="happy" stackId="a" fill="#10b981" name="행복" />
            <Bar dataKey="tired" stackId="a" fill="#f59e0b" name="피곤" />
            <Bar dataKey="stressed" stackId="a" fill="#ef4444" name="스트레스" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-80">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">스택형 면적 차트</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip formatter={(value:any) => [`${value}%`, '']} />
            <Legend />
            <Area type="monotone" dataKey="happy" stackId="1" stroke="#10b981" fill="#10b981" name="행복" />
            <Area type="monotone" dataKey="tired" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="피곤" />
            <Area type="monotone" dataKey="stressed" stackId="1" stroke="#ef4444" fill="#ef4444" name="스트레스" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyMoodTrendChart;