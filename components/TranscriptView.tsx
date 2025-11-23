import React from 'react';
import { TranscriptSegment } from '../types';
import { User, Headphones } from 'lucide-react';

interface TranscriptViewProps {
  transcript: TranscriptSegment[];
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
          Call Transcript
        </h2>
        <p className="text-sm text-gray-500 mt-1 ml-4">Speaker diarization and content</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {transcript.map((segment, index) => {
          const isRep = segment.speaker.toLowerCase().includes('rep') || segment.speaker.toLowerCase().includes('agent');
          
          return (
            <div key={index} className={`flex gap-4 ${isRep ? 'flex-row-reverse' : ''}`}>
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${isRep ? 'bg-primary-100 text-primary-600' : 'bg-orange-100 text-orange-600'}
              `}>
                {isRep ? <Headphones size={20} /> : <User size={20} />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${isRep ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-700">{segment.speaker}</span>
                  <span className="text-xs text-gray-400">{segment.timestamp}</span>
                </div>
                <div className={`
                  p-4 rounded-2xl text-sm leading-relaxed
                  ${isRep 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'}
                `}>
                  {segment.text}
                </div>
                {/* Sentiment Indicator for the bubble */}
                <div className="mt-1">
                    {segment.sentiment === 'positive' && <span className="text-xs text-green-600 font-medium">Positive</span>}
                    {segment.sentiment === 'negative' && <span className="text-xs text-red-500 font-medium">Negative</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};