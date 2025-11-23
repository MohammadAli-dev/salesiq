import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

// Define the expected JSON schema for the model's output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.ARRAY,
      description: "A diarized transcript of the conversation.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING, description: "Name or role of the speaker (e.g., 'Sales Rep', 'Prospect')" },
          text: { type: Type.STRING, description: "The content spoken." },
          sentiment: { type: Type.STRING, enum: ["positive", "neutral", "negative"], description: "The sentiment of this specific segment." },
          timestamp: { type: Type.STRING, description: "Approximate timestamp (e.g., '00:15')." },
        },
        required: ["speaker", "text", "sentiment", "timestamp"],
      },
    },
    sentimentGraph: {
      type: Type.ARRAY,
      description: "Data points for a line graph showing engagement/sentiment over the duration of the call.",
      items: {
        type: Type.OBJECT,
        properties: {
          timeOffset: { type: Type.NUMBER, description: "Time offset in seconds or percentage of call." },
          score: { type: Type.NUMBER, description: "Sentiment/Engagement score from 0 to 100." },
          label: { type: Type.STRING, description: "Short label for this phase (e.g., Intro, Pitch, Objections)." },
        },
        required: ["timeOffset", "score", "label"],
      },
    },
    coaching: {
      type: Type.OBJECT,
      description: "Coaching insights based on the call.",
      properties: {
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3 things the salesperson did well.",
        },
        missedOpportunities: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 3 missed opportunities or areas for improvement.",
        },
        summary: { type: Type.STRING, description: "A brief 2-sentence summary of the call outcome." },
      },
      required: ["strengths", "missedOpportunities", "summary"],
    },
    competitors: {
      type: Type.ARRAY,
      description: "List of competitors mentioned during the call. Return empty array if none.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the competitor." },
          timestamp: { type: Type.STRING, description: "Timestamp when mentioned (e.g. '02:15')." },
          context: { type: Type.STRING, description: "Brief context of what was said about them." },
        },
        required: ["name", "timestamp", "context"],
      },
    },
  },
  required: ["transcript", "sentimentGraph", "coaching", "competitors"],
};

export const analyzeSalesCall = async (base64Audio: string, mimeType: string): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Analyze this sales call audio. 
            1. Transcribe the audio, identifying speakers as 'Sales Rep' and 'Prospect' (or similar roles) based on context.
            2. Analyze the sentiment flow of the conversation and provide data points for a graph (0-100 score).
            3. Provide a coaching card with 3 specific strengths and 3 missed opportunities.
            4. Identify any mentions of competitors. List the competitor name, the timestamp, and the context. If none are mentioned, return an empty array.
            
            Return the output strictly as JSON matching the schema provided.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual transcription
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from Gemini.");
    }

    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};