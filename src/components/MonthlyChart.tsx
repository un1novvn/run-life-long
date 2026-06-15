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

  const monthLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  const maxValue = useMemo(() => {
    const values = Object.values(yearData).map(data => data[type]);
    return Math.max(...values, 1);
  }, [yearData, type]);

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-xs font-bold text-black dark:text-white tracking-widest uppercase">
            月度分布
          </h3>
          <div className="relative inline-flex items-center group">
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="text-xs bg-transparent border border-gray-200 dark:border-gray-800 rounded px-2 py-1 outline-none text-gray-500 hover:text-black dark:hover:text-white cursor-pointer tracking-widest uppercase appearance-none pr-6 transition-colors duration-200"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-2 pointer-events-none text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setType('days')}
            className={`text-[10px] tracking-widest uppercase transition-colors ${
              type === 'days'
                ? 'text-black dark:text-white font-bold'
                : 'text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setType('distance')}
            className={`text-[10px] tracking-widest uppercase transition-colors ${
              type === 'distance'
                ? 'text-black dark:text-white font-bold'
                : 'text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Dist
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {monthLabels.map((monthLabel, index) => {
          const month = (index + 1).toString();
          const data = yearData[month] ? yearData[month] : yearData[month.padStart(2, '0')];
          const value = data ? data[type] : 0;
          const percentage = (value / maxValue) * 100;

          return (
            <div key={month} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">
                  {monthLabel}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-widest">
                  {type === 'days' ? `${value} d` : `${value?.toFixed(1)} km`}
                </span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-[2px] relative">
                <div
                  className="bg-black dark:bg-white h-[2px] transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyChart;
