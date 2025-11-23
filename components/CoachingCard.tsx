import React from 'react';
import { CoachingData } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface CoachingCardProps {
  data: CoachingData;
}

export const CoachingCard: React.FC<CoachingCardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-primary-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
             <Lightbulb size={24} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Executive Summary</h3>
            <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            Winning Moments
          </h3>
          <ul className="space-y-3">
            {data.strengths.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-green-50/50 p-3 rounded-xl border border-green-100">
                <span className="font-bold text-green-600 select-none">{idx + 1}.</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Missed Opportunities */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Missed Opportunities
          </h3>
          <ul className="space-y-3">
            {data.missedOpportunities.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-600 select-none">{idx + 1}.</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};