import React from 'react';
import { Mic, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Mic size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">SalesIQ</h1>
              <span className="text-xs text-primary-600 font-medium">AI Coaching Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Activity size={16} />
              <span>Powered by Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};