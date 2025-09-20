import React, { useState } from 'react';

interface BarChartProps {
  title: string;
  data: Record<string, { days: number; distance?: number }>;
  initialType?: 'days' | 'distance';
  color?: string;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  title, 
  data, 
  initialType = 'days', 
  color = 'bg-blue-500',
  className = '' 
}) => {
  const [type, setType] = useState<'days' | 'distance'>(initialType);
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value[type] || 0), 1);

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        
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
      
      <div className="space-y-3">
        {entries.map(([label, value]) => {
          const percentage = ((value[type] || 0) / maxValue) * 100;
          
          return (
            <div key={label} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {label}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {type === 'days' ? `${value.days} 天` : `${value.distance?.toFixed(2)} km`}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-300 group-hover:opacity-80`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Hover tooltip */}
              {/* <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10 -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                  {label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {type === 'days' ? (
                    `${value.days} 天跑步`
                  ) : (
                    <>
                      {value.days} 天<br />
                      {value.distance?.toFixed(2)} km
                    </>
                  )}
                </div>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
