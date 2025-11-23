import React from 'react';

interface CallScoreProps {
  score: number;
}

export const CallScore: React.FC<CallScoreProps> = ({ score }) => {
  let color = 'text-green-500';
  let borderColor = 'border-green-500';
  let bgColor = 'bg-green-50';
  let label = 'Excellent';

  if (score < 60) {
    color = 'text-red-500';
    borderColor = 'border-red-500';
    bgColor = 'bg-red-50';
    label = 'Needs Improvement';
  } else if (score < 80) {
    color = 'text-amber-500';
    borderColor = 'border-amber-500';
    bgColor = 'bg-amber-50';
    label = 'Good';
  }

  // Calculate circumference for SVG circle
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h3 className="text-gray-900 font-semibold text-lg">Call Score</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${bgColor} ${color}`}>
          {label}
        </span>
      </div>
    </div>
  );
};