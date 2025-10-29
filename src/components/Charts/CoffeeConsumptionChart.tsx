import React from 'react';
import { useQuery } from 'react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Scatter, ScatterChart, ZAxis } from 'recharts';
import { mockApi } from '../../services/api';

const CoffeeConsumptionChart: React.FC = () => {
  const { data, isLoading, error } = useQuery(
    'coffeeConsumption',
    mockApi.getCoffeeConsumption
  );

  if (isLoading) {
    return <div className="h-96 flex items-center justify-center">Loading...</div>;
  }

  if (error || !data) {
    return <div className="h-96 flex items-center justify-center">Error loading data</div>;
  }

  const transformDataForChart = () => {
    const teams = data.teams;
    const allCups = Array.from(new Set(teams.flatMap(team => team.series.map(point => point.cups)))).sort((a, b) => a - b);
    
    return allCups.map(cup => {
      const point: any = { cups: cup };
      teams.forEach(team => {
        const teamData = team.series.find(d => d.cups === cup);
        if (teamData) {
          point[`${team.team}_bugs`] = teamData.bugs;
          point[`${team.team}_productivity`] = teamData.productivity;
        }
      });
      return point;
    });
  };

  const chartData = transformDataForChart();
  const teams = data.teams.map(team => team.team);

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{`커피 ${label}잔/일`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey.includes('bugs') ? '버그 수' : '생산성'}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="cups" 
            label={{ value: '커피 섭취량 (잔/일)', position: 'insideBottom', offset: -5 }} 
          />
          <YAxis 
            yAxisId="left"
            label={{ value: '버그 수', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ value: '생산성 점수', angle: -90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {teams.map((team, index) => (
            <React.Fragment key={team}>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={`${team}_bugs`}
                stroke={colors[index]}
                strokeWidth={2}
                name={`${team} - 버그 수`}
                dot={{ fill: colors[index], r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={`${team}_productivity`}
                stroke={colors[index]}
                strokeWidth={2}
                strokeDasharray="5 5"
                name={`${team} - 생산성`}
                dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
              />
            </React.Fragment>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoffeeConsumptionChart;