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
  color = 'bg-black dark:bg-white',
  className = '' 
}) => {
  const [type, setType] = useState<'days' | 'distance'>(initialType);
  const entries = Object.entries(data);
  const maxValue = Math.max(...entries.map(([_, value]) => value[type] || 0), 1);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <h3 className="text-xs font-bold text-black dark:text-white tracking-widest uppercase">
          {title}
        </h3>
        
        <div className="flex space-x-6">
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
        {entries.map(([label, value]) => {
          const percentage = ((value[type] || 0) / maxValue) * 100;
          
          return (
            <div key={label} className="group relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-widest uppercase">
                  {label}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 tracking-widest">
                  {type === 'days' ? `${value.days} d` : `${value.distance?.toFixed(1)} km`}
                </span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-gray-900 h-[2px] relative">
                <div
                  className={`${color} h-[2px] transition-all duration-300`}
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

export default BarChart;
