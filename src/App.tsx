import React, { useState, useMemo } from 'react';
import CalendarChart from './components/CalendarChart';
import BarChart from './components/BarChart';
import MonthlyChart from './components/MonthlyChart';
import ThemeToggle from './components/ThemeToggle';
import { sampleData } from './data/sampleData';
import { RunningData } from './types';

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const runningData: RunningData = sampleData;

  const totalStats = useMemo(() => {
    const totalDays = Object.values(runningData.yearly).reduce((sum, year) => sum + year.days, 0);
    const totalDistance = Object.values(runningData.yearly).reduce((sum, year) => sum + year.distance, 0);
    const averageDistance = totalDistance / totalDays;
    
    return { totalDays, totalDistance, averageDistance };
  }, [runningData.yearly]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                跑步数据可视化
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                近3年跑步数据分析与展示
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalStats.totalDays}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              总跑步天数
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalStats.totalDistance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              总跑步距离 (km)
            </div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {totalStats.averageDistance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              平均距离 (km/天)
            </div>
          </div>
        </div>

        {/* Calendar Chart */}
        <div className="mb-8">
          <CalendarChart
            dailyData={runningData.daily}
            year={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Yearly Distribution */}
          <BarChart
            title="年度分布"
            data={runningData.yearly}
            type="distance"
            color="bg-blue-500"
          />

          {/* Location Distribution */}
          <BarChart
            title="地理位置分布"
            data={runningData.locations}
            type="distance"
            color="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pace Distribution */}
          <BarChart
            title="配速分布"
            data={runningData.pace}
            type="days"
            color="bg-orange-500"
          />

          {/* Heart Rate Distribution */}
          <BarChart
            title="心率分布"
            data={runningData.heartRate}
            type="days"
            color="bg-red-500"
          />
        </div>

        {/* Distance Distribution */}
        <div className="mb-8">
          <BarChart
            title="距离分布"
            data={runningData.distance}
            type="days"
            color="bg-purple-500"
          />
        </div>

        {/* Monthly Distribution */}
        <div className="mb-8">
          <MonthlyChart
            monthlyData={runningData.monthly}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container-custom text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 跑步数据可视化 - 基于 React + TypeScript + Tailwind CSS 构建
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
