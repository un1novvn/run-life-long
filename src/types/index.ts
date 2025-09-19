export interface DailyData {
  distance: number;
  startTime: string;
  heartRate: number;
  pace: string;
  speedValue: number;
  sportType: number;
  location: string;
  count: number;
}

export interface MonthlyData {
  distance: number;
  days: number;
}

export interface YearlyData {
  distance: number;
  days: number;
}

export interface LocationData {
  days: number;
  distance: number;
}

export interface PaceData {
  days: number;
  distance: number;
}

export interface HeartRateData {
  days: number;
  distance: number;
}

export interface DistanceData {
  days: number;
}

export interface RunningData {
  daily: Record<string, DailyData>;
  monthly: Record<string, Record<string, MonthlyData>>;
  yearly: Record<string, YearlyData>;
  locations: Record<string, LocationData>;
  pace: Record<string, PaceData>;
  heartRate: Record<string, HeartRateData>;
  distance: Record<string, DistanceData>;
}

export interface CalendarCell {
  date: string;
  distance: number;
  data?: DailyData;
  isEmpty: boolean;
}
