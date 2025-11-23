import React from 'react';
import { CompetitorMention } from '../types';
import { Swords, Clock, ShieldAlert } from 'lucide-react';

interface CompetitorAnalysisProps {
  mentions: CompetitorMention[];
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ mentions }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Swords className="text-rose-500" size={24} />
          Competitor Intelligence
        </h2>
        <p className="text-sm text-gray-500 mt-1 ml-8">
          Competitors mentioned during the conversation
        </p>
      </div>

      {mentions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ShieldAlert className="text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 font-medium">No competitors detected</p>
          <p className="text-xs text-gray-400">The prospect did not explicitly mention any competitors.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mentions.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-xs shadow-sm">
                  {item.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <div className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-white px-2 py-1 rounded-full border border-rose-100">
                    <Clock size={12} />
                    {item.timestamp}
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{item.context}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};