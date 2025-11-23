import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AppState, AnalysisResult } from './types';
import { analyzeSalesCall } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    data: null,
    error: null,
    audioUrl: null,
  });

  const handleFileSelect = async (file: File) => {
    // Create local URL for playback
    const url = URL.createObjectURL(file);
    
    setState({
      status: 'analyzing',
      data: null,
      error: null,
      audioUrl: url,
    });

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:audio/mp3;base64,")
        const base64Data = base64String.split(',')[1];
        
        try {
            const result = await analyzeSalesCall(base64Data, file.type);
            setState(prev => ({ ...prev, status: 'complete', data: result }));
        } catch (err: any) {
             console.error(err);
             setState(prev => ({ 
                ...prev, 
                status: 'error', 
                error: err.message || "Failed to analyze audio. Please try again." 
             }));
        }
      };
      
      reader.onerror = () => {
         setState(prev => ({ ...prev, status: 'error', error: "Failed to read file." }));
      }

      reader.readAsDataURL(file);

    } catch (e: any) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: e.message || "An unexpected error occurred." 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />
      
      <main>
        {state.status === 'idle' && (
           <div className="py-16">
             <div className="text-center mb-12">
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
                 Unlock the power of your <br/>
                 <span className="text-primary-600">Sales Conversations</span>
               </h2>
               <p className="max-w-2xl mx-auto text-xl text-slate-500">
                 Upload your sales call recordings and let Gemini transcribe, analyze, and coach your team to close more deals.
               </p>
             </div>
             <FileUpload onFileSelect={handleFileSelect} isAnalyzing={false} />
           </div>
        )}

        {state.status === 'analyzing' && (
           <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 className="animate-spin text-primary-600 mb-6" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Conversation</h3>
              <p className="text-gray-500">Processing audio with Gemini 2.5 Flash...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-primary-500 animate-progress"></div>
              </div>
           </div>
        )}

        {state.status === 'error' && (
          <div className="max-w-2xl mx-auto mt-12 px-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-red-700 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-6">{state.error}</p>
              <button 
                onClick={() => setState(prev => ({ ...prev, status: 'idle', error: null }))}
                className="px-6 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {state.status === 'complete' && state.data && (
          <AnalysisDashboard data={state.data} audioUrl={state.audioUrl} />
        )}
      </main>
      
      {/* Utility Style for progress bar animation */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 95%; }
        }
        .animate-progress {
          animation: progress 8s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;