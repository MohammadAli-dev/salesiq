import React from 'react';
import { AnalysisResult } from '../types';
import { TranscriptView } from './TranscriptView';
import { SentimentChart } from './SentimentChart';
import { CoachingCard } from './CoachingCard';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { PlayCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
  audioUrl: string | null;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, audioUrl }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
        {audioUrl && (
          <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-3 shadow-sm">
             <PlayCircle size={20} className="text-primary-600" />
             <audio src={audioUrl} controls className="h-8 w-48 outline-none" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Charts and Coaching (Wider) */}
        <div className="lg:col-span-8 space-y-8">
          <CoachingCard data={data.coaching} />
          <CompetitorAnalysis mentions={data.competitors} />
          <SentimentChart data={data.sentimentGraph} />
        </div>

        {/* Right Column: Transcript (Narrower) */}
        <div className="lg:col-span-4">
          <TranscriptView transcript={data.transcript} />
        </div>
      </div>
    </div>
  );
};