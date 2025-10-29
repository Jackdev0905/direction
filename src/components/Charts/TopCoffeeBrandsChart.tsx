import React from 'react';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { mockApi } from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TopCoffeeBrandsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'topCoffeeBrands',
    mockApi.getTopCoffeeBrands
  );

  if (isLoading) {
    return <div className="h-80 flex items-center justify-center">Loading...</div>;
  }

  if (error || !data) {
    return <div className="h-80 flex items-center justify-center">Error loading data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-80">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">바 차트</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, '인기도']} />
            <Legend />
            <Bar dataKey="popularity" fill="#3b82f6" name="인기도 (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-80">
        <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">도넛 차트</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ brand, popularity }) => `${brand}: ${popularity}%`}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="popularity"
              nameKey="brand"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, '인기도']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCoffeeBrandsChart;