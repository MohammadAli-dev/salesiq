import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { SettingsModal } from './components/SettingsModal';
import { AppState } from './types';
import { analyzeSalesCall } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    data: null,
    error: null,
    mediaUrl: null,
    mimeType: null,
    fileName: null,
    customInstructions: "",
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const analyzeMedia = async () => {
      if (!state.mediaUrl || !state.mimeType) return;

      setState(prev => ({ ...prev, status: 'analyzing', error: null }));

      try {
        let base64Data = '';
        
        // Fetch blob from local object URL or remote URL to get base64
        const response = await fetch(state.mediaUrl);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            // Handle data: URLs (common with FileReader) vs raw
            base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
            
            try {
                // Pass custom instructions to the service
                const result = await analyzeSalesCall(base64Data, state.mimeType!, state.customInstructions);
                setState(prev => ({ ...prev, status: 'complete', data: result }));
            } catch (err: any) {
                console.error(err);
                setState(prev => ({ 
                    ...prev, 
                    status: 'error', 
                    error: err.message || "Failed to analyze media. Please try again." 
                }));
            }
        };
        reader.readAsDataURL(blob);

      } catch (err: any) {
         setState(prev => ({ 
            ...prev, 
            status: 'error', 
            error: "Failed to process the media file." 
         }));
      }
  };

  /**
   * Helper to determine MIME type, especially for files where browser returns empty string (common with .m4a)
   */
  const getMimeType = (file: File): string => {
    if (file.type) return file.type;
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'm4a': return 'audio/mp4'; // Gemini often handles m4a better as mp4 container
        case 'mp4': return 'video/mp4';
        case 'mp3': return 'audio/mpeg';
        case 'wav': return 'audio/wav';
        case 'aac': return 'audio/aac';
        case 'flac': return 'audio/flac';
        case 'ogg': return 'audio/ogg';
        case 'webm': return 'video/webm';
        case 'mov': return 'video/quicktime';
        default: return 'application/octet-stream';
    }
  };

  const handleFileSelect = (file: File) => {
    // Create local URL for playback
    const url = URL.createObjectURL(file);
    const mimeType = getMimeType(file);
    
    setState(prev => ({
      ...prev,
      status: 'ready',
      data: null,
      error: null,
      mediaUrl: url,
      mimeType: mimeType,
      fileName: file.name
    }));
  };

  const handleUrlSelect = async (url: string) => {
      const name = url.split('/').pop() || 'Remote File';
      
      setState(prev => ({
          ...prev,
          status: 'ready',
          data: null,
          error: null,
          mediaUrl: url,
          mimeType: 'audio/mp3', // Default, likely to be updated if needed or generic
          fileName: name
      }));
  };

  const handleRemoveFile = () => {
      if (state.mediaUrl && state.mediaUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.mediaUrl);
      }
      setState(prev => ({
          ...prev,
          status: 'idle',
          data: null,
          error: null,
          mediaUrl: null,
          mimeType: null,
          fileName: null
      }));
  };

  const handleReset = () => {
      handleRemoveFile();
  };

  const handleSaveSettings = (instructions: string) => {
    setState(prev => ({ ...prev, customInstructions: instructions }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveSettings}
        currentInstructions={state.customInstructions}
      />
      
      <main>
        {state.status === 'idle' && (
           <div className="py-16">
             <div className="text-center mb-12">
               <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
                 Unlock the power of your <br/>
                 <span className="text-primary-600">Sales Conversations</span>
               </h2>
               <p className="max-w-2xl mx-auto text-xl text-slate-500 px-4">
                 Upload sales call recordings (audio or video) to let Gemini transcribe, analyze, and coach your team.
               </p>
             </div>
             <FileUpload 
                onFileSelect={handleFileSelect} 
                onUrlSelect={handleUrlSelect} 
                selectedFile={null}
                onRemove={() => {}}
                onAnalyze={() => {}}
                isAnalyzing={false}
             />
             
             {/* Feature Tip */}
             <div className="max-w-2xl mx-auto mt-8 text-center">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium bg-primary-50 px-4 py-2 rounded-full transition-colors"
                >
                  ✨ Pro Tip: Click the Settings icon to customize your coaching playbook
                </button>
             </div>
           </div>
        )}

        {(state.status === 'ready' || state.status === 'analyzing') && (
           <div className="py-16">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-bold text-slate-900">
                 {state.status === 'analyzing' ? 'Analyzing Conversation' : 'Review Selection'}
               </h2>
               <p className="text-slate-500 mt-2">
                 {state.status === 'analyzing' 
                    ? 'Gemini is identifying speakers, analyzing sentiment, and generating insights.' 
                    : 'Review your file before starting the AI analysis.'}
               </p>
             </div>
             
             <FileUpload 
                onFileSelect={handleFileSelect} 
                onUrlSelect={handleUrlSelect} 
                selectedFile={state.fileName ? { name: state.fileName, type: state.mimeType || 'unknown' } : null}
                onRemove={handleRemoveFile}
                onAnalyze={analyzeMedia}
                isAnalyzing={state.status === 'analyzing'}
             />
           </div>
        )}

        {state.status === 'error' && (
          <div className="max-w-2xl mx-auto mt-12 px-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl font-bold text-red-700 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-6">{state.error}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {state.status === 'complete' && state.data && (
          <AnalysisDashboard 
            data={state.data} 
            mediaUrl={state.mediaUrl} 
            mimeType={state.mimeType} 
            onReset={handleReset}
          />
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
          animation: progress 15s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;