import React, { useState, useMemo } from 'react';
import { MonthlyData } from '../types';

interface MonthlyChartProps {
  monthlyData: Record<string, Record<string, MonthlyData>>;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ 
  monthlyData, 
  selectedYear, 
  onYearChange 
}) => {
  const [type, setType] = useState<'days' | 'distance'>('days');
  
  const availableYears = Object.keys(monthlyData)
    .map(year => parseInt(year))
    .sort((a, b) => b - a);

  const yearData = useMemo(() => {
    const yearStr = selectedYear.toString();
    return monthlyData[yearStr] || {};
  }, [monthlyData, selectedYear]);

  const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  const maxValue = useMemo(() => {
    const values = Object.values(yearData).map(data => data[type]);
    return Math.max(...values, 1);
  }, [yearData, type]);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          月度分布 {selectedYear}
        </h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setType('days')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                type === 'days'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              天数
            </button>
            <button
              onClick={() => setType('distance')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                type === 'distance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              距离
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {monthLabels.map((monthLabel, index) => {
          const month = (index + 1).toString();
          // 月份数字有 2 和 02 两种情况
          const data = yearData[month] ? yearData[month] : yearData[month.padStart(2, '0')];
          const value = data ? data[type] : 0;
          const percentage = (value / maxValue) * 100;

          return (
            <div key={month} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium min-w-[40px]">
                  {monthLabel}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {type === 'days' ? `${value} 天` : `${value?.toFixed(2)} km`}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300 group-hover:opacity-80"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Hover tooltip */}
              {data && (
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10 -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    {monthLabel} {selectedYear}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>跑步天数: {data.days} 天</div>
                    <div>总距离: {data.distance.toFixed(2)} km</div>
                    <div>平均距离: {(data.distance / data.days).toFixed(2)} km/天</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyChart;
