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
    callScore: {
      type: Type.NUMBER,
      description: "An overall score for the call from 0 to 100 based on sales best practices.",
    },
    objections: {
      type: Type.ARRAY,
      description: "List of objections raised by the prospect.",
      items: {
        type: Type.OBJECT,
        properties: {
          objection: { type: Type.STRING, description: "The objection raised." },
          timestamp: { type: Type.STRING, description: "Timestamp of the objection." },
          response: { type: Type.STRING, description: "How the sales rep responded to the objection." },
        },
        required: ["objection", "timestamp", "response"],
      },
    },
    redFlags: {
      type: Type.ARRAY,
      description: "Potential red flags or churn risks.",
      items: {
        type: Type.OBJECT,
        properties: {
          flag: { type: Type.STRING, description: "The red flag identifier (e.g., 'Budget Constraint')." },
          timestamp: { type: Type.STRING, description: "Timestamp." },
          riskLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"], description: "Severity of the risk." },
          context: { type: Type.STRING, description: "Context around the red flag." },
        },
        required: ["flag", "timestamp", "riskLevel", "context"],
      },
    },
    nextSteps: {
      type: Type.ARRAY,
      description: "Recommended next steps for the sales rep.",
      items: { type: Type.STRING },
    },
  },
  required: ["transcript", "sentimentGraph", "coaching", "competitors", "callScore", "objections", "redFlags", "nextSteps"],
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
            text: `Analyze this sales call audio extensively based on the following parameters:
            
            1. **Transcript**: Transcribe the audio, diarizing speakers (e.g., 'Sales Rep', 'Prospect').
            2. **Sentiment Timeline**: Analyze sentiment flow (0-100) for a graph.
            3. **Coaching**: Identify 3 strengths and 3 weaknesses (missed opportunities), plus a summary.
            4. **Objection Detection**: Identify specific objections raised by the prospect and how the rep handled them.
            5. **Red Flags/Churn Clues**: Identify risks (budget, authority, timeline, competitor lock-in). Assign High/Medium/Low risk.
            6. **Competitor Mentions**: List any competitors mentioned with context.
            7. **Next Steps**: Provide 3-5 concrete recommendations for what the rep should do next.
            8. **Call Score**: Assign a final score (0-100) based on engagement, objection handling, and closing skills.
            
            Return the output strictly as JSON matching the schema provided.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
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