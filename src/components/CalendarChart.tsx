import React, { useState, useMemo } from 'react';
import { CalendarCell, DailyData } from '../types';
import { 
  generateHorizontalCalendar, 
  getColorIntensity, 
  getMonthLabels, 
  getWeekdayLabels, 
  formatDistance, 
  getMaxDistance 
} from '../utils/calendarUtils';

interface CalendarChartProps {
  dailyData: Record<string, DailyData>;
  year: number;
  onYearChange: (year: number) => void;
}

const CalendarChart: React.FC<CalendarChartProps> = ({ dailyData, year, onYearChange }) => {
  const [hoveredCell, setHoveredCell] = useState<CalendarCell | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  
  const weeks = useMemo(() => generateHorizontalCalendar(dailyData, year), [dailyData, year]);
  const monthLabels = useMemo(() => getMonthLabels(year), [year]);
  const weekdayLabels = getWeekdayLabels();

  // Flatten all cells to calculate max distance
  const allCells = useMemo(() => weeks.flat(), [weeks]);
  const maxDistance = useMemo(() => getMaxDistance(allCells), [allCells]);

  const availableYears = Object.keys(dailyData)
    .map(date => new Date(date).getFullYear())
    .filter((year, index, arr) => arr.indexOf(year) === index)
    .sort((a, b) => b - a);

  // Calculate month positions for the month labels
  const getMonthPositions = () => {
    const positions: { month: string; startWeek: number; endWeek: number }[] = [];
    let currentMonth = -1;
    let startWeek = 0;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        
        if (month !== currentMonth) {
          if (currentMonth !== -1) {
            positions.push({
              month: monthLabels[currentMonth],
              startWeek,
              endWeek: weekIndex - 1
            });
          }
          currentMonth = month;
          startWeek = weekIndex;
        }
      }
    });

    // Add the last month
    if (currentMonth !== -1) {
      positions.push({
        month: monthLabels[currentMonth],
        startWeek,
        endWeek: weeks.length - 1
      });
    }

    return positions;
  };

  const monthPositions = getMonthPositions();

  // Calculate tooltip position with bounds checking
  const getTooltipPosition = (mouseX: number, mouseY: number) => {
    const tooltipWidth = 200; // maxWidth from the tooltip
    const tooltipHeight = 150; // estimated height
    const offset = 10; // offset from cursor
    
    let left = mouseX + offset;
    let top = mouseY + offset;
    
    // Check right boundary
    if (left + tooltipWidth > window.innerWidth) {
      left = mouseX - tooltipWidth - offset;
    }
    
    // Check bottom boundary
    if (top + tooltipHeight > window.innerHeight) {
      top = mouseY - tooltipHeight - offset;
    }
    
    return { left, top };
  };

  return (
    <div className="card relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          跑步日历 {year}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onYearChange(year - 1)}
            disabled={!availableYears.includes(year - 1)}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一年
          </button>
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={() => onYearChange(year + 1)}
            disabled={!availableYears.includes(year + 1)}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一年
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Month labels at top - perfectly aligned with cells */}
          <div className="flex mb-2" style={{ marginLeft: '32px' }}>
            {monthPositions.map((pos, index) => (
              <div
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400 text-center"
                style={{ 
                  width: `${(pos.endWeek - pos.startWeek + 1) * 14}px`,
                  marginRight: '1px'
                }}
              >
                {pos.month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels on left side - better alignment */}
            <div className="flex flex-col mr-2">
              {weekdayLabels.map((day, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 dark:text-gray-400 text-center w-8 h-3 flex items-center justify-center mb-1"
                  style={{ 
                    height: '14px', 
                    marginBottom: '4px',
                    lineHeight: '14px'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid - horizontal weeks, vertical days */}
            <div className="flex flex-col">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="flex mb-1">
                  {weeks.map((week, weekIndex) => {
                    const cell = week[dayIndex];
                    if (!cell || !(cell.date)) return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="w-3 h-3 rounded-sm m-px opacity-0"
                      />
                    );
                    
                    return (
                      <div
                        key={cell.date}
                        className={`w-3 h-3 rounded-sm m-px cursor-pointer transition-all duration-200 ${
                          getColorIntensity(cell.distance, maxDistance)
                        } ${cell.isEmpty ? 'opacity-50' : ''}`}
                        onMouseEnter={(e) => {
                          setHoveredCell(cell);
                          // Capture mouse position for tooltip
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e) => {
                          // Update mouse position as mouse moves
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => {
                          setHoveredCell(null);
                          setMousePosition(null);
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip - positioned at mouse cursor */}
      {hoveredCell?.data && mousePosition && (
        <div
          id="calendar-tooltip"
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-50 pointer-events-none"
          style={{ 
            maxWidth: '200px',
            left: `${getTooltipPosition(mousePosition.x, mousePosition.y).left}px`,
            top: `${getTooltipPosition(mousePosition.x, mousePosition.y).top}px`
          }}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {hoveredCell.date}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-1">
            <div>距离: {formatDistance(hoveredCell.data.distance)}</div>
            <div>配速: {hoveredCell.data.pace}/km</div>
            <div>心率: {hoveredCell.data.heartRate} bpm</div>
            <div>地点: {hoveredCell.data.location}</div>
            <div>开始时间: {hoveredCell.data.startTime}</div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-2 text-xs text-gray-600 dark:text-gray-400">
        <span>较少</span>
        {[0.2, 0.4, 0.6, 0.8, 1].map((intensity, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${getColorIntensity(intensity * maxDistance, maxDistance)}`}
          />
        ))}
        <span>较多</span>
      </div>
    </div>
  );
};

export default CalendarChart;
