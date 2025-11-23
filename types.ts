export interface TranscriptSegment {
  speaker: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface SentimentPoint {
  timeOffset: number; // in seconds or sequence index
  score: number; // 0 to 100
  label: string; // e.g., "Intro", "Discovery", "Closing"
}

export interface CoachingData {
  strengths: string[];
  missedOpportunities: string[];
  summary: string;
}

export interface CompetitorMention {
  name: string;
  timestamp: string;
  context: string;
}

export interface AnalysisResult {
  transcript: TranscriptSegment[];
  sentimentGraph: SentimentPoint[];
  coaching: CoachingData;
  competitors: CompetitorMention[];
}

export interface AppState {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  data: AnalysisResult | null;
  error: string | null;
  audioUrl: string | null;
}