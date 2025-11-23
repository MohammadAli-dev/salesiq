import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { SentimentPoint } from '../types';

interface SentimentChartProps {
  data: SentimentPoint[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as SentimentPoint;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-sm">
        <p className="font-semibold text-gray-900 mb-1">{dataPoint.label}</p>
        <p className="text-primary-600 font-medium">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-[400px]">
       <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
          Engagement & Sentiment Flow
        </h2>
        <p className="text-sm text-gray-500 mt-1 ml-4">Analysis of call momentum over time</p>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              hide={true} // Clean look, show label in tooltip
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};