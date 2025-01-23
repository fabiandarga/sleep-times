import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

const REFERENCE_TIME = 23;

const SleepTimeChart = ( { sleepTimeData } ) => {
  const calculateTimeDifference = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    let totalHours = hours + minutes / 60;
    if (totalHours < 12) {
      totalHours += 24;
    }
    return REFERENCE_TIME - totalHours ;
  };

  // Generate array of all dates between start and end
  const generateAllDates = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Original data with actual measurements
  const measurements = {
    ...sleepTimeData,
  };

  // Generate all dates between first and last measurement
  const allDates = generateAllDates(new Date('2024-11-18'), new Date());
  
  // Create complete dataset including empty days
  const data = allDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const time = measurements[dateStr];
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (time) {
      const diff = calculateTimeDifference(time);
      console.log(`Date: ${formattedDate}, Time: ${time}, Difference: ${diff}`);
      return {
        date: formattedDate,
        time,
        diff,
      };
    }
    return {
      date: formattedDate,
      time: null,
      diff: null,
    };
  });

  const calculateStats = () => {
    const measurementData = data.filter(d => d.diff !== null);
    const totalDays = measurementData.length;
    const avgDiff = measurementData.reduce((acc, curr) => acc + curr.diff, 0) / totalDays;
    const daysOver2Hours = measurementData.filter(d => d.diff < -2).length;
    const percentOver2Hours = (daysOver2Hours / totalDays) * 100;

    const avgSleepTime = Math.abs(avgDiff - REFERENCE_TIME);
    const avgHours = Math.floor(avgSleepTime);
    const avgMinutes = Math.round((avgSleepTime - avgHours) * 60);
    
    return {
      avgSleepTime: `${avgHours % 24}:${avgMinutes.toString().padStart(2, '0')}`,
      avgDifference: avgDiff,
      percentOver2Hours,
      daysTracked: totalDays,
      totalDays: data.length,
      trackingRate: (totalDays / data.length * 100).toFixed(1)
    };
  };

  const stats = calculateStats();

  const formatYAxis = (value) => {
    if (value === null) return '';
    const hours = Math.floor(Math.abs(value));
    const minutes = Math.round((Math.abs(value) - hours) * 60);
    return `${value >= 0 ? '+' : '-'}${hours}h${minutes ? ` ${minutes}m` : ''}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.date}</p>
          {data.time ? (
            <>
              <p>Bedtime: {data.time}</p>
              <p>Difference: {formatYAxis(data.diff)}</p>
            </>
          ) : (
            <p>No data recorded</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="w-full max-w-4xl">
      <header>
        <h1>Sleep Schedule Deviation from Target (23:00)</h1>
      </header>
      <div>
        <div className="w-full">
          <LineChart
            width={800}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            connectNulls={true}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: 'Date', position: 'bottom', offset: 0 }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              label={{ value: 'Hours Difference', angle: -90, position: 'left' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#0DD94C" strokeDasharray="3 3" />
            <ReferenceLine y={-3} stroke="#D9650D" strokeDasharray="3 3" />
            <ReferenceLine y={-5} stroke="#D91E0D" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="diff" 
              stroke="#8884d8" 
              dot={{ stroke: '#8884d8', strokeWidth: 2 }} 
              activeDot={{ r: 8 }}
              connectNulls={true}
            />
          </LineChart>
        </div>
        <div className="mt-6 space-y-2">
          <p>Average Sleep Time: {stats.avgSleepTime}</p>
          <p>Average Difference from Target: {formatYAxis(stats.avgDifference)}</p>
          <p>Days More Than 2 Hours Late: {stats.percentOver2Hours.toFixed(1)}%</p>
          <p>Tracking Rate: {stats.trackingRate}% ({stats.daysTracked} out of {stats.totalDays} days)</p>
        </div>
      </div>
    </section>
  );
};

export default SleepTimeChart;
