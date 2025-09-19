import { RunningData } from '../types';

export const sampleData: RunningData = {
  daily: {
    "2022-10-31": {
      distance: 6.211799999999999,
      startTime: "17:24",
      heartRate: 158,
      pace: "4:21",
      speedValue: 256,
      sportType: 100,
      location: "广州市",
      count: 2
    },
    "2022-10-30": {
      distance: 2.05789,
      startTime: "16:53",
      heartRate: 163,
      pace: "4:06",
      speedValue: 246,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2022-10-29": {
      distance: 8.12345,
      startTime: "18:15",
      heartRate: 152,
      pace: "4:45",
      speedValue: 238,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2022-10-28": {
      distance: 5.6789,
      startTime: "19:30",
      heartRate: 165,
      pace: "4:12",
      speedValue: 262,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2023-01-15": {
      distance: 10.2345,
      startTime: "08:45",
      heartRate: 148,
      pace: "5:10",
      speedValue: 225,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2023-02-20": {
      distance: 12.3456,
      startTime: "09:30",
      heartRate: 155,
      pace: "4:50",
      speedValue: 240,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2023-03-10": {
      distance: 8.7654,
      startTime: "18:20",
      heartRate: 162,
      pace: "4:15",
      speedValue: 255,
      sportType: 100,
      location: "惠州市",
      count: 1
    },
    "2024-05-15": {
      distance: 15.6789,
      startTime: "07:15",
      heartRate: 145,
      pace: "5:30",
      speedValue: 218,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2024-06-20": {
      distance: 6.5432,
      startTime: "19:45",
      heartRate: 168,
      pace: "4:05",
      speedValue: 265,
      sportType: 100,
      location: "广州市",
      count: 1
    },
    "2025-01-05": {
      distance: 9.8765,
      startTime: "08:00",
      heartRate: 152,
      pace: "4:55",
      speedValue: 232,
      sportType: 100,
      location: "惠州市",
      count: 1
    }
  },
  monthly: {
    "2022": {
      "10": {
        distance: 51.49173,
        days: 7
      },
      "11": {
        distance: 45.6789,
        days: 6
      },
      "12": {
        distance: 38.9123,
        days: 5
      }
    },
    "2023": {
      "1": {
        distance: 120.4567,
        days: 15
      },
      "2": {
        distance: 135.7890,
        days: 18
      },
      "3": {
        distance: 110.2345,
        days: 16
      },
      "4": {
        distance: 95.6789,
        days: 14
      },
      "5": {
        distance: 105.4321,
        days: 16
      },
      "6": {
        distance: 98.7654,
        days: 15
      },
      "7": {
        distance: 85.4321,
        days: 13
      },
      "8": {
        distance: 92.3456,
        days: 14
      },
      "9": {
        distance: 88.7654,
        days: 13
      },
      "10": {
        distance: 102.3456,
        days: 16
      },
      "11": {
        distance: 95.6789,
        days: 14
      },
      "12": {
        distance: 108.9012,
        days: 17
      }
    },
    "2024": {
      "1": {
        distance: 115.6789,
        days: 18
      },
      "2": {
        distance: 125.4321,
        days: 19
      },
      "3": {
        distance: 110.9876,
        days: 17
      },
      "4": {
        distance: 98.7654,
        days: 15
      },
      "5": {
        distance: 105.4321,
        days: 16
      },
      "6": {
        distance: 95.6789,
        days: 14
      },
      "7": {
        distance: 88.9012,
        days: 13
      },
      "8": {
        distance: 92.3456,
        days: 14
      },
      "9": {
        distance: 85.6789,
        days: 13
      },
      "10": {
        distance: 98.7654,
        days: 15
      },
      "11": {
        distance: 105.4321,
        days: 16
      },
      "12": {
        distance: 112.3456,
        days: 17
      }
    },
    "2025": {
      "1": {
        distance: 95.6789,
        days: 15
      },
      "2": {
        distance: 88.9012,
        days: 13
      },
      "3": {
        distance: 102.3456,
        days: 16
      },
      "4": {
        distance: 85.4321,
        days: 13
      },
      "5": {
        distance: 92.3456,
        days: 14
      },
      "6": {
        distance: 78.9012,
        days: 12
      },
      "7": {
        distance: 85.4321,
        days: 13
      },
      "8": {
        distance: 72.3456,
        days: 11
      },
      "9": {
        distance: 65.4321,
        days: 10
      }
    }
  },
  yearly: {
    "2022": {
      distance: 246.94477999999998,
      days: 27
    },
    "2023": {
      distance: 1238.6532299999997,
      days: 183
    },
    "2024": {
      distance: 1224.8333399999997,
      days: 199
    },
    "2025": {
      distance: 1089.2981300000001,
      days: 108
    }
  },
  locations: {
    "广州市": {
      days: 410,
      distance: 3001.5058299999982
    },
    "惠州市": {
      days: 58,
      distance: 407.5404299999999
    },
    "深圳市": {
      days: 25,
      distance: 198.7654
    },
    "北京市": {
      days: 12,
      distance: 85.4321
    },
    "上海市": {
      days: 8,
      distance: 62.3456
    }
  },
  pace: {
    "4:00-4:30": {
      days: 16,
      distance: 47.13807
    },
    "4:30-5:00": {
      days: 45,
      distance: 345.6789
    },
    "5:00-5:30": {
      days: 265,
      distance: 2059.5829200000003
    },
    "5:30-6:00": {
      days: 178,
      distance: 1456.7890
    },
    "6:00-6:30": {
      days: 95,
      distance: 678.9012
    },
    "6:30-7:00": {
      days: 42,
      distance: 298.7654
    }
  },
  heartRate: {
    "140-150": {
      days: 35,
      distance: 245.6789
    },
    "150-160": {
      days: 209,
      distance: 1590.2546600000003
    },
    "160-170": {
      days: 212,
      distance: 1830.10884
    },
    "170-180": {
      days: 145,
      distance: 1256.7890
    },
    "180-190": {
      days: 68,
      distance: 498.7654
    },
    "190-200": {
      days: 12,
      distance: 78.9012
    }
  },
  distance: {
    "0-5km": {
      days: 152
    },
    "5-10km": {
      days: 208
    },
    "10-15km": {
      days: 95
    },
    "15-20km": {
      days: 42
    },
    "20-25km": {
      days: 18
    },
    "25km+": {
      days: 8
    }
  }
};
