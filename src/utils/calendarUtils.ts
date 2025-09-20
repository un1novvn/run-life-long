import { CalendarCell, DailyData } from '../types';

export const generateCalendarData = (dailyData: Record<string, DailyData>, year: number): CalendarCell[] => {
  const calendar: CalendarCell[] = [];
  
  // Get first day of the year
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  
  // Calculate offset for the first day (0 = Sunday, 1 = Monday, etc.)
  let startOffset = firstDay.getDay();
  if (startOffset === 0) startOffset = 7; // Make Monday the first day of week
  
  // Generate all days of the year
  const currentDate = new Date(firstDay);
  while (currentDate <= lastDay) {
    // Use local date format instead of ISO string to avoid timezone issues
    const currentYear = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${currentYear}-${month}-${day}`;
    
    const daily = dailyData[dateStr];
    
    calendar.push({
      date: dateStr,
      distance: daily?.distance || 0,
      data: daily,
      isEmpty: !daily
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return calendar;
};

export const generateHorizontalCalendar = (dailyData: Record<string, DailyData>, year: number): CalendarCell[][] => {
  const weeks: CalendarCell[][] = [];
  let currentWeek: CalendarCell[] = [];
  
  // Get first day of the year (using local time)
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);
  
  // Generate all days of the year grouped by weeks
  const currentDate = new Date(firstDay);
  
  // If the first day is not Monday, fill the first week with empty cells
  // empty cells 的 distance 是 0，而不是空, 确保 getMaxDistance 传入的是数字, 否则导致的问题是所有单元格没有颜色深浅变化
  const firstDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // Convert to 1-7 (Mon-Sun)
  if (firstDayOfWeek > 1) {
    for (let i = 1; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        distance: 0,
        data: undefined,
        isEmpty: true
      } as CalendarCell);
    }
  }
  
  while (currentDate <= lastDay) {
    // Use local date format instead of ISO string to avoid timezone issues
    const currentYear = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${currentYear}-${month}-${day}`;
    
    const daily = dailyData[dateStr];
    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Convert to 1-7 (Mon-Sun)
    
    const cell: CalendarCell = {
      date: dateStr,
      distance: daily?.distance || 0,
      data: daily,
      isEmpty: !daily
    };
    
    currentWeek.push(cell);
    
    // If it's Sunday or last day of year, push the week
    if (dayOfWeek === 7 || currentDate.getTime() === lastDay.getTime()) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return weeks;
};

export const getColorIntensity = (distance: number, maxDistance: number): string => {
  if (distance === 0) return 'bg-gray-100 dark:bg-gray-800';
  
  const intensity = Math.min(distance / maxDistance, 1);
  
  if (intensity < 0.2) return 'bg-green-100 dark:bg-green-900';
  if (intensity < 0.4) return 'bg-green-200 dark:bg-green-800';
  if (intensity < 0.6) return 'bg-green-300 dark:bg-green-700';
  if (intensity < 0.8) return 'bg-green-400 dark:bg-green-600';
  return 'bg-green-500 dark:bg-green-500';
};

export const getMonthLabels = (year: number): string[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  });
};

export const getWeekdayLabels = (): string[] => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
};

export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(2)} km`;
};

export const getMaxDistance = (calendarData: CalendarCell[]): number => {
  return Math.max(...calendarData.map(cell => cell.distance), 1);
};
