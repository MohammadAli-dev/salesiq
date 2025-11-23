import React from 'react';
import { RedFlag } from '../types';
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

interface RisksCardProps {
  redFlags: RedFlag[];
}

export const RisksCard: React.FC<RisksCardProps> = ({ redFlags }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AlertOctagon className="text-red-500" size={24} />
          Risks & Red Flags
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Churn signals and deal blockers
        </p>
      </div>

      {redFlags.length === 0 ? (
        <div className="text-center py-8 bg-green-50 rounded-xl border border-dashed border-green-200 text-green-700">
          <p className="font-medium">All clear</p>
          <p className="text-xs opacity-80">No significant red flags detected.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {redFlags.map((risk, idx) => (
            <div key={idx} className="flex gap-3 items-start p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
               <div className="mt-0.5">
                 {risk.riskLevel === 'High' ? (
                   <AlertOctagon size={18} className="text-red-600" />
                 ) : risk.riskLevel === 'Medium' ? (
                   <AlertTriangle size={18} className="text-amber-500" />
                 ) : (
                   <Info size={18} className="text-blue-500" />
                 )}
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{risk.flag}</h4>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        risk.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 
                        risk.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {risk.riskLevel}
                    </span>
                 </div>
                 <p className="text-xs text-gray-600 leading-snug">{risk.context}</p>
                 <span className="text-[10px] text-gray-400 mt-1 block">Detected at {risk.timestamp}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};