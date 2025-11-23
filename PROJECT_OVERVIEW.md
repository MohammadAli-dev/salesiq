# SalesIQ - Project Overview

## 1. Introduction
**SalesIQ** is an AI-powered sales coaching application designed to analyze **audio and video** recordings of sales calls. It leverages Google's **Gemini 2.5 Flash** model to provide detailed insights, including speaker-diarized transcripts, sentiment analysis, objection handling reviews, and strategic coaching advice.

## 2. Technical Stack

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts/Visualization**: Recharts
- **Build Tool**: (Implied Vite/Parcel environment)

### AI Services
- **Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
- **SDK**: `@google/genai`
- **Integration**: Direct client-side API calls via `services/geminiService.ts`.

## 3. Architecture & Data Flow

### Application State (`App.tsx`)
The application uses a state machine approach within the root `App` component to manage the analysis lifecycle:
- **`status`**: Tracks the current phase:
  - `idle`: Initial state, waiting for user input.
  - `ready`: File selected or URL entered, user is reviewing selection.
  - `analyzing`: Sending data to Gemini API.
  - `complete`: Analysis finished, displaying results.
  - `error`: An error occurred during processing.
- **`data`**: Stores the structured `AnalysisResult` returned by Gemini.
- **`mediaUrl`**: A local Blob URL or remote URL for the media file.
- **`mimeType`**: The MIME type of the media (e.g., `audio/mp3`, `video/mp4`).
- **`fileName`**: Name of the file or URL resource for display.

### Service Layer (`services/geminiService.ts`)
- **Input**: Base64 encoded media string and MIME type (supports Audio & Video).
- **Process**:
  1. Constructs a multimodal prompt asking for specific JSON output (Transcript, Sentiment, Coaching, etc.).
  2. Sends the request to Gemini 2.5 Flash using the `generateContent` method.
  3. Uses a defined `Schema` to ensure strict JSON adherence.
- **Output**: Returns a typed `AnalysisResult` object.

## 4. Key Components

### Core Views
- **`App.tsx`**: Main controller. Handles state transitions (`handleFileSelect`, `handleAnalyze`, `handleReset`).
- **`FileUpload.tsx`**: 
  - Handles Drag & Drop for Audio/Video files.
  - Validates file types and sizes.
  - Provides a "Paste Link" tab for URL inputs.
  - Displays a "Review" card with options to Remove or Analyze the selected media.
- **`AnalysisDashboard.tsx`**: The main report view. Includes an integrated media player (Audio/Video) and grid layout for insights.

### Visualization Components
- **`TranscriptView.tsx`**: Renders the conversation bubble chat, distinguishing between "Sales Rep" and "Prospect".
- **`SentimentChart.tsx`**: Uses `Recharts` to display an area chart tracking the call's emotional tone over time.
- **`CallScore.tsx`**: A gauge-style circular progress indicator for the overall call rating (0-100).

### Insight Cards
- **`CoachingCard.tsx`**: Displays Strengths, Missed Opportunities, and an Executive Summary.
- **`ObjectionsCard.tsx`**: Lists specific objections raised and how they were handled.
- **`RisksCard.tsx`**: Highlights potential churn risks or red flags (Budget, Competitors, etc.).
- **`CompetitorAnalysis.tsx`**: Detailed view of competitor mentions with timestamps and context.
- **`NextStepsCard.tsx`**: A checklist of recommended actions for the sales rep.

## 5. File Structure

```
/
├── index.html              # Entry HTML with Tailwind CDN
├── index.tsx               # React Root
├── App.tsx                 # Main Application Logic
├── types.ts                # TypeScript Interfaces (Data Models)
├── metadata.json           # App Metadata
├── services/
│   └── geminiService.ts    # Gemini API Integration
└── components/
    ├── Header.tsx          # App Navigation Bar
    ├── FileUpload.tsx      # Media Upload & Review
    ├── AnalysisDashboard.tsx # Results View & Player
    ├── TranscriptView.tsx  # Chat UI
    ├── SentimentChart.tsx  # Graph UI
    ├── CoachingCard.tsx    # Strengths/Weaknesses
    ├── CallScore.tsx       # 0-100 Score Gauge
    ├── ObjectionsCard.tsx  # Objection List
    ├── RisksCard.tsx       # Red Flag Alerts
    ├── NextStepsCard.tsx   # Action Items
    └── CompetitorAnalysis.tsx # Competitor Intelligence
```

## 6. Data Model (`types.ts`)

The application relies on a central `AnalysisResult` interface that aggregates all insights:

```typescript
interface AnalysisResult {
  transcript: TranscriptSegment[]; // Speaker, Text, Sentiment, Timestamp
  sentimentGraph: SentimentPoint[]; // TimeOffset, Score (0-100)
  coaching: CoachingData;          // Strengths, Weaknesses, Summary
  competitors: CompetitorMention[];// Name, Context, Timestamp
  callScore: number;               // 0-100
  objections: Objection[];         // Objection, Rep Response
  redFlags: RedFlag[];             // Flag Name, Risk Level (High/Med/Low)
  nextSteps: string[];             // List of strings
}
```

## 7. Future Roadmap Ideas
- **Real-time Analysis**: Using Gemini Live API for real-time coaching during the call.
- **CRM Integration**: Exporting results directly to Salesforce or HubSpot.
- **Team Leaderboard**: Aggregating scores across multiple reps.
- **Custom Playbooks**: allowing users to define their own sales methodologies (e.g., MEDDIC, SPIN) for the AI to check against.