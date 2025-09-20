let fs =  require('fs');
let path =  require('path');
// import path from 'path';

// Helper function to format pace from seconds to mm:ss
function formatPace(seconds) {
  const paceMin = Math.floor(seconds / 60);
  const paceSec = String(seconds % 60).padStart(2, '0');
  return `${paceMin}:${paceSec}`;
}

// Helper function to convert pace string (mm:ss) to seconds
function paceStringToSeconds(paceString) {
  const [minutes, seconds] = paceString.split(':').map(Number);
  return minutes * 60 + seconds;
}

// 处理配速区间 (3:00-8:00, 30秒间隔)
function getPaceRange(paceSeconds) {
    const minPace = 180; // 3:00 in seconds
    const maxPace = 480; // 8:00 in seconds
    const interval = 30; // 30 seconds
    
    if (paceSeconds < minPace) return '<3:00';
    if (paceSeconds >= maxPace) return '≥8:00';
    
    const rangeNum = Math.floor((paceSeconds - minPace) / interval);
    const startMin = Math.floor((minPace + rangeNum * interval) / 60);
    const startSec = (minPace + rangeNum * interval) % 60;
    const endMin = Math.floor((minPace + (rangeNum + 1) * interval) / 60);
    const endSec = (minPace + (rangeNum + 1) * interval) % 60;
    
    return `${startMin}:${startSec.toString().padStart(2, '0')}-${endMin}:${endSec.toString().padStart(2, '0')}`;
}

// 处理心率区间 (120-190, 10间隔)
function getHeartRateRange(heartRate) {
    const minHR = 120;
    const maxHR = 190;
    const interval = 10;
    
    if (heartRate < minHR) return '<120';
    if (heartRate >= maxHR) return '≥190';
    
    const rangeNum = Math.floor((heartRate - minHR) / interval);
    const start = minHR + rangeNum * interval;
    const end = start + interval;
    
    return `${start}-${end}`;
}

// 处理距离区间 (0-50km, 5km间隔)
function getDistanceRange(distance) {
    const maxDistance = 50;
    const interval = 5;
    
    if (distance >= maxDistance) return '≥50km';
    
    const rangeNum = Math.floor(distance / interval);
    const start = rangeNum * interval;
    const end = start + interval;
    
    return `${start}-${end}km`;
}

// Process all JSON files in output directory
async function processAllData() {
    try {
        const corosDataDir = 'coros-data';
        const files = fs.readdirSync(corosDataDir).filter(f => f.endsWith('.json'));
        
        let exerciseData = {};
        let yearlyStats = {};
        let monthlyStats = {};
        let locationStats = {};
        let paceStats = {};
        let heartRateStats = {};
        let distanceStats = {};

        // Process each JSON file
        files.forEach(file => {
            const filePath = path.join(corosDataDir, file);
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            rawData.data.forEach(activity => {
                // 过滤掉非跑步的运动
                if(activity.sportType !== 100 && activity.sportType !== 103){
                    return;
                }

                // Convert timestamp to YYYY-MM-DD key
                const date = new Date(activity.startTime * 1000);
                // 设置为UTC+8时区
                const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
                const dateKey = `${utc8Date.getUTCFullYear()}-${String(utc8Date.getUTCMonth() + 1).padStart(2, '0')}-${String(utc8Date.getUTCDate()).padStart(2, '0')}`;
                
                // Convert pace from seconds to mm:ss format
                const paceFormatted = formatPace(activity.avgPace);
                
                // Extract location from name (before first space)
                let location = activity.name.split(' ')[0] || '未知位置';
                if(!location.endsWith('市')){
                    location = '广州市'; // 命名是其他时，默认广州市
                }

                // Initialize or update day's data
                if (!exerciseData[dateKey]) {
                    exerciseData[dateKey] = {
                        distance: activity.distance / 1000, // Convert m to km
                        startTime: `${String(utc8Date.getUTCHours()).padStart(2, '0')}:${String(utc8Date.getUTCMinutes()).padStart(2, '0')}`, // HH:MM format
                        heartRate: activity.avgHeartRate,
                        pace: paceFormatted,
                        speedValue: activity.speedValue,
                        sportType: activity.sportType,
                        location: location,
                        count: 1
                    };
                } else {
                    // Aggregate multiple activities for same day
                    const existing = exerciseData[dateKey];

                    const totalDistance = existing.distance + (activity.distance / 1000);
                    
                    // Weighted average for heart rate
                    const totalHeartRate = (existing.heartRate * existing.count) + activity.avgHeartRate;
                    
                    // Weighted average for pace (convert to seconds first)
                    const existingPaceSec = parseInt(existing.pace.split(':')[0]) * 60 + parseInt(existing.pace.split(':')[1]);
                    const newPaceSec = activity.avgPace;
                    const totalPaceSec = (existingPaceSec * existing.count) + newPaceSec;
                    
                    exerciseData[dateKey] = {
                        distance: totalDistance,
                        startTime: existing.startTime, // Keep earliest time
                        heartRate: Math.round(totalHeartRate / (existing.count + 1)),
                        pace: formatPace(Math.round(totalPaceSec / (existing.count + 1))),
                        speedValue: activity.speedValue, // Keep latest speed
                        sportType: activity.sportType, // Keep latest sport type
                        location: existing.location !== location ? `${existing.location}, ${location}` : existing.location,
                        count: existing.count + 1
                    };
                }
            });
        });

        // Process yearly and monthly statistics
        Object.entries(exerciseData).forEach(([dateKey, activity]) => {
            const [year, month] = dateKey.split('-');
            
            // Yearly stats
            if (!yearlyStats[year]) {
                yearlyStats[year] = { distance: 0, days: 0 };
            }
            yearlyStats[year].distance += activity.distance;
            yearlyStats[year].days += 1;
            
            // Monthly stats
            if (!monthlyStats[year]) {
                monthlyStats[year] = {};
                for (let m = 1; m <= 12; m++) {
                    const monthKey = m.toString().padStart(2, '0');
                    monthlyStats[year][monthKey] = { distance: 0, days: 0 };
                }
            }
            monthlyStats[year][month].distance += activity.distance;
            monthlyStats[year][month].days += 1;
            
            // Location stats
            const locKey = activity.location;
            locationStats[locKey] = locationStats[locKey] || { days: 0, distance: 0 };
            locationStats[locKey].days += 1;
            locationStats[locKey].distance += activity.distance;
            
            // Pace stats
            const paceRange = getPaceRange(paceStringToSeconds(activity.pace));
            paceStats[paceRange] = paceStats[paceRange] || { days: 0, distance: 0 };
            paceStats[paceRange].days += 1;
            paceStats[paceRange].distance += activity.distance;
            
            // Heart rate stats
            const hrRange = getHeartRateRange(activity.heartRate);
            heartRateStats[hrRange] = heartRateStats[hrRange] || { days: 0, distance: 0 };
            heartRateStats[hrRange].days += 1;
            heartRateStats[hrRange].distance += activity.distance;
            
            // Distance stats
            const distRange = getDistanceRange(activity.distance);
            distanceStats[distRange] = distanceStats[distRange] || { days: 0, distance: 0 };
            distanceStats[distRange].days += 1;
            distanceStats[distRange].distance += activity.distance;
        });

        // Sort data according to requirements
        // 1. 年度分布排序根据年份升序排序
        const sortedYearlyStats = Object.fromEntries(
            Object.entries(yearlyStats).sort(([a], [b]) => parseInt(a) - parseInt(b))
        );

        // 2. 地理分布根据总距离排序
        const sortedLocationStats = Object.fromEntries(
            Object.entries(locationStats).sort(([, a], [, b]) => b.distance - a.distance)
        );

        // 3. 配速分布根据时间升序排序
        const sortedPaceStats = Object.fromEntries(
            Object.entries(paceStats).sort(([a], [b]) => {
                // Handle special cases first
                if (a === '<3:00') return -1;
                if (b === '<3:00') return 1;
                if (a === '≥8:00') return 1;
                if (b === '≥8:00') return -1;
                
                // Extract start time from range (e.g., "4:00-4:30" -> "4:00")
                const aStart = a.split('-')[0];
                const bStart = b.split('-')[0];
                
                // Convert to seconds for comparison
                const aSeconds = paceStringToSeconds(aStart);
                const bSeconds = paceStringToSeconds(bStart);
                
                return aSeconds - bSeconds;
            })
        );

        // 4. 心率分布根据心率升序排序
        const sortedHeartRateStats = Object.fromEntries(
            Object.entries(heartRateStats).sort(([a], [b]) => {
                // Handle special cases first
                if (a === '<120') return -1;
                if (b === '<120') return 1;
                if (a === '≥190') return 1;
                if (b === '≥190') return -1;
                
                // Extract start heart rate from range (e.g., "140-150" -> 140)
                const aStart = parseInt(a.split('-')[0]);
                const bStart = parseInt(b.split('-')[0]);
                
                return aStart - bStart;
            })
        );

        // 5. 距离分布根据距离升序排序
        const sortedDistanceStats = Object.fromEntries(
            Object.entries(distanceStats).sort(([a], [b]) => {
                // Handle special cases first
                if (a === '≥50km') return 1;
                if (b === '≥50km') return -1;
                
                // Extract start distance from range (e.g., "5-10km" -> 5)
                const aStart = parseInt(a.split('-')[0]);
                const bStart = parseInt(b.split('-')[0]);
                
                return aStart - bStart;
            })
        );

        // Generate the final sampleData structure with sorted data
        const sampleData = {
            daily: exerciseData,
            monthly: monthlyStats,
            yearly: sortedYearlyStats,
            locations: sortedLocationStats,
            pace: sortedPaceStats,
            heartRate: sortedHeartRateStats,
            distance: sortedDistanceStats
        };

        // Generate TypeScript output
        const output = `import { RunningData } from '../types';\n\nexport const sampleData: RunningData = ${JSON.stringify(sampleData, null, 2)};`;
        const outputFile = 'src/data/index.ts'
        fs.writeFileSync(outputFile, output);
        console.log(`Successfully compiled data to ${outputFile}`);
        
    } catch (error) {
        console.error('Error processing data:', error);
    }
}

processAllData().catch(console.error);
