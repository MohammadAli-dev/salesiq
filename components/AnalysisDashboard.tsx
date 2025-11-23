import React from 'react';
import { AnalysisResult } from '../types';
import { TranscriptView } from './TranscriptView';
import { SentimentChart } from './SentimentChart';
import { CoachingCard } from './CoachingCard';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { CallScore } from './CallScore';
import { ObjectionsCard } from './ObjectionsCard';
import { RisksCard } from './RisksCard';
import { NextStepsCard } from './NextStepsCard';
import { PlayCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
  audioUrl: string | null;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, audioUrl }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
        {audioUrl && (
          <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-3 shadow-sm w-full sm:w-auto">
             <PlayCircle size={20} className="text-primary-600 shrink-0" />
             <audio src={audioUrl} controls className="h-8 w-full sm:w-48 outline-none" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analytics (Wider) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Row: Score & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1">
                <CallScore score={data.callScore} />
             </div>
             <div className="md:col-span-2">
                <CoachingCard data={data.coaching} />
             </div>
          </div>

          {/* Second Row: Risks & Objections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RisksCard redFlags={data.redFlags} />
            <ObjectionsCard objections={data.objections} />
          </div>

          {/* Third Row: Competitors & Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <CompetitorAnalysis mentions={data.competitors} />
             <NextStepsCard steps={data.nextSteps} />
          </div>

          {/* Fourth Row: Sentiment */}
          <SentimentChart data={data.sentimentGraph} />
        </div>

        {/* Right Column: Transcript (Narrower) */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
             <TranscriptView transcript={data.transcript} />
          </div>
        </div>
      </div>
    </div>
  );
};