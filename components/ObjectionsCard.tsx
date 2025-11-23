import React from 'react';
import { Objection } from '../types';
import { ShieldQuestion, CheckCircle2, XCircle } from 'lucide-react';

interface ObjectionsCardProps {
  objections: Objection[];
}

export const ObjectionsCard: React.FC<ObjectionsCardProps> = ({ objections }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShieldQuestion className="text-indigo-500" size={24} />
          Objection Handling
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Barriers raised and rep response
        </p>
      </div>

      {objections.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No major objections detected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {objections.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-slate-800 text-sm">"{item.objection}"</span>
                <span className="text-xs text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {item.timestamp}
                </span>
              </div>
              <div className="text-sm text-slate-600 pl-3 border-l-2 border-indigo-200">
                <span className="text-xs font-bold text-indigo-600 block mb-1 uppercase tracking-wide">Rep Response</span>
                {item.response}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};