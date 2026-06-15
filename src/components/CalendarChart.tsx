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
      const firstValidDay = week.find(day => day && day.date);
      if (firstValidDay) {
        const date = new Date(firstValidDay.date);
        const month = date.getMonth();
        
        if (!isNaN(month) && month !== currentMonth) {
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
    const tooltipWidth = 150;
    const tooltipHeight = 100;
    const offset = 15;
    
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
    <div className="relative">
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center space-x-8 text-gray-400">
          <button
            onClick={() => onYearChange(year - 1)}
            disabled={!availableYears.includes(year - 1)}
            className="hover:text-black dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-sm tracking-[0.2em]">{year}</span>
          <button
            onClick={() => onYearChange(year + 1)}
            disabled={!availableYears.includes(year + 1)}
            className="hover:text-black dark:hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-8 flex justify-start md:justify-center">
        <div className="inline-block min-w-max px-4 md:px-0">
          {/* Month labels at top - perfectly aligned with cells */}
          <div className="flex mb-2" style={{ marginLeft: '32px' }}>
            {monthPositions.map((pos, index) => (
              <div
                key={index}
                className="text-[10px] text-gray-400 tracking-widest text-center uppercase"
                style={{ 
                  width: `${(pos.endWeek - pos.startWeek + 1) * 14}px`,
                  marginRight: '1px'
                }}
              >
                {pos.month ? pos.month.substring(0, 3) : ''}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels on left side - better alignment */}
            <div className="flex flex-col mr-2">
              {weekdayLabels.map((day, index) => (
                <div
                  key={index}
                  className="text-[10px] text-gray-400 text-center w-8 h-3 flex items-center justify-center mb-1 tracking-widest uppercase"
                  style={{ 
                    height: '14px', 
                    marginBottom: '4px',
                    lineHeight: '14px'
                  }}
                >
                  {index % 2 === 0 ? day.substring(0, 3) : ''}
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
                        className={`w-3 h-3 m-[1px] cursor-pointer transition-all duration-200 ${
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

      {/* Hover tooltip */}
      {hoveredCell?.data && mousePosition && (
        <div
          className="fixed bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 shadow-2xl z-50 pointer-events-none"
          style={{ 
            left: `${getTooltipPosition(mousePosition.x, mousePosition.y).left}px`,
            top: `${getTooltipPosition(mousePosition.x, mousePosition.y).top}px`
          }}
        >
          <div className="text-xs font-bold text-black dark:text-white tracking-widest mb-3">
            {hoveredCell.date}
          </div>
          <div className="text-xs text-gray-500 space-y-2 tracking-wider">
            <div>DIST <span className="text-black dark:text-white float-right ml-4">{formatDistance(hoveredCell.data.distance)}</span></div>
            <div>PACE <span className="text-black dark:text-white float-right ml-4">{hoveredCell.data.pace}/km</span></div>
            <div>HR <span className="text-black dark:text-white float-right ml-4">{hoveredCell.data.heartRate} bpm</span></div>
            {hoveredCell.data.startTime && (
              <div>TIME <span className="text-black dark:text-white float-right ml-4">{hoveredCell.data.startTime}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarChart;
