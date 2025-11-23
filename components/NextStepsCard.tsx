import React from 'react';
import { ListTodo, ArrowRight } from 'lucide-react';

interface NextStepsCardProps {
  steps: string[];
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ListTodo className="text-teal-500" size={24} />
          Recommended Actions
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Next steps to advance the deal
        </p>
      </div>

      <ul className="space-y-0">
        {steps.map((step, idx) => (
          <li key={idx} className="flex gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors group">
            <ArrowRight size={18} className="text-teal-500 mt-0.5 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm text-gray-700 font-medium">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};