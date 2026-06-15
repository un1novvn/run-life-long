import React, { useState, useMemo } from 'react';
import CalendarChart from './components/CalendarChart';
import BarChart from './components/BarChart';
import MonthlyChart from './components/MonthlyChart';
import ThemeToggle from './components/ThemeToggle';
import GitHubToggle from './components/GitHubToggle';
import BlogToggle from './components/BlogToggle';
import { SITE_CONFIG } from './config';
import { sampleData } from './data';
import { RunningData } from './types';

const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
      {/* Header */}
      <header className="py-8 mb-12">
        <div className="container-custom flex justify-between items-center">
          <div className="text-sm font-bold text-black dark:text-white tracking-widest uppercase">
            {SITE_CONFIG.title}
          </div>
          <div className="flex items-center space-x-6">
            <GitHubToggle />
            <BlogToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom pb-24">
        {/* Hero Section */}
        <div className="mb-32 text-center">
          {/* <div className="text-gray-400 dark:text-gray-500 text-xs tracking-widest mb-16 uppercase">
            未知的终点，无尽的旅程。
          </div> */}
          
          <div className="flex flex-col md:flex-row justify-center items-end space-y-16 md:space-y-0 md:space-x-32">
            <div className="flex flex-col items-center">
              <div className="text-[36px] md:text-[48px] font-bold leading-none tracking-tighter text-black dark:text-white">
                {totalStats.totalDays}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 tracking-widest">
                总跑步天数
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-[36px] md:text-[48px] font-bold leading-none tracking-tighter text-black dark:text-white">
                {Math.floor(totalStats.totalDistance)}<span className="text-[18px] md:text-[24px] text-gray-300 dark:text-gray-700">.{(totalStats.totalDistance % 1).toFixed(2).substring(2)}</span>
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 tracking-widest">
                总跑步距离 (km)
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-[36px] md:text-[48px] font-bold leading-none tracking-tighter text-black dark:text-white">
                {totalStats.averageDistance.toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-3 tracking-widest">
                平均距离 (km/天)
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-4xl mx-auto h-[1px] bg-gray-200 dark:bg-gray-800 mt-24"></div>
        </div>

        {/* Calendar Chart */}
        <div className="mb-24">
          <CalendarChart
            dailyData={runningData.daily}
            year={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <BarChart
            title="年度分布"
            data={runningData.yearly}
            initialType="distance"
            color="bg-black dark:bg-white"
          />
          <BarChart
            title="地理位置分布"
            data={runningData.locations}
            initialType="distance"
            color="bg-black dark:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          <BarChart
            title="配速分布"
            data={runningData.pace}
            initialType="days"
            color="bg-black dark:bg-white"
          />
          <BarChart
            title="心率分布"
            data={runningData.heartRate}
            initialType="days"
            color="bg-black dark:bg-white"
          />
        </div>

        <div className="mb-16">
          <BarChart
            title="距离分布"
            data={runningData.distance}
            initialType="days"
            color="bg-black dark:bg-white"
          />
        </div>

        <div className="mb-16">
          <MonthlyChart
            monthlyData={runningData.monthly}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-900">
        <div className="container-custom text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 tracking-widest uppercase">
            {SITE_CONFIG.footerText}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 tracking-widest uppercase mt-2">
            Inspired by <a href="https://nodaysoff.run/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">NODAYSOFF</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
