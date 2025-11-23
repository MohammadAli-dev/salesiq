import React, { useRef, useState } from 'react';
import { UploadCloud, FileAudio, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      setError("Please upload a valid audio file.");
      return;
    }
    // Limit to approx 10MB for this demo to ensure quick processing
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit for this demo.");
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full h-80 
          rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
          ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center p-6">
          <div className="bg-primary-100 p-4 rounded-full mb-4 text-primary-600">
            {isAnalyzing ? (
              <div className="animate-pulse">
                <FileAudio size={48} />
              </div>
            ) : (
              <UploadCloud size={48} />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isAnalyzing ? 'Analyzing Audio...' : 'Upload Sales Call'}
          </h3>
          
          <p className="text-gray-500 mb-6 max-w-sm">
            {isAnalyzing 
              ? 'Gemini is identifying speakers, analyzing sentiment, and generating coaching insights.' 
              : 'Drag and drop your audio recording here, or click to browse.'}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleChange}
            disabled={isAnalyzing}
          />
          
          {!isAnalyzing && (
            <button
              onClick={onButtonClick}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
            >
              Select Audio File
            </button>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
      
      {!isAnalyzing && (
        <p className="text-center text-gray-400 text-sm mt-6">
          Supports MP3, WAV, M4A, AAC. Max 10MB.
        </p>
      )}
    </div>
  );
};