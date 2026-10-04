/**
 * WanderWise Backend Server
 * Express + Google Gemini API (@google/genai)
 */

import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { SYSTEM_INSTRUCTION, buildTripPrompt, buildRefinementPrompt } from './src/utils/prompts.ts';
import { TripPreferences, TripItinerary } from './src/types/trip.ts';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Determine Gemini Model (defaults to gemini-3.8-flash for speed and reliability)
const rawModel = (process.env.GEMINI_MODEL || '').trim();
const GEMINI_MODEL = (rawModel.startsWith('gemini-') && !rawModel.includes(' ') && !rawModel.includes(':'))
  ? rawModel
  : 'gemini-3.8-flash';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Output Schema for Gemini Structured Output
const activitySchema = {
  type: Type.OBJECT,
  properties: {
    activity: { type: Type.STRING, description: 'Name of the spot or activity' },
    description: { type: Type.STRING, description: '1-2 engaging sentences describing the activity' },
    estimatedCost: { type: Type.STRING, description: "Estimated cost e.g. '₹250' or 'Free'" },
    estimatedDuration: { type: Type.STRING, description: "Estimated duration e.g. '2 hours'" },
    bestTime: { type: Type.STRING, description: "Optimal time window e.g. '9:30 AM - 11:30 AM'" },
    reason: { type: Type.STRING, description: 'Why this was selected for this specific traveler' },
  },
  required: ['activity', 'description', 'estimatedCost', 'estimatedDuration', 'bestTime', 'reason'],
};

const daySchema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER, description: 'Day number index (1-based)' },
    title: { type: Type.STRING, description: 'Catchy day title e.g. Coastal Serenity & Sunset Cafe' },
    theme: { type: Type.STRING, description: 'Theme or geographical focus for the day' },
    morning: { type: Type.ARRAY, items: activitySchema, description: 'Morning activities' },
    afternoon: { type: Type.ARRAY, items: activitySchema, description: 'Afternoon activities' },
    evening: { type: Type.ARRAY, items: activitySchema, description: 'Evening activities' },
    estimatedDailyCost: { type: Type.STRING, description: 'Estimated expenditure for this day' },
    travelNotes: { type: Type.STRING, description: 'Transit tips, routing advice, or rest suggestions' },
  },
  required: ['dayNumber', 'title', 'morning', 'afternoon', 'evening', 'estimatedDailyCost', 'travelNotes'],
};

const tripSchema = {
  type: Type.OBJECT,
  properties: {
    tripSummary: {
      type: Type.OBJECT,
      properties: {
        destination: { type: Type.STRING },
        duration: { type: Type.STRING },
        travelers: { type: Type.STRING },
        budget: { type: Type.STRING },
        overview: { type: Type.STRING, description: '2-3 sentences summarizing the curated journey' },
        bestTimeToVisitNote: { type: Type.STRING, description: 'Seasonal insight for the travel month' },
        paceAdherence: { type: Type.STRING, description: 'How the pace constraint was respected' },
      },
      required: ['destination', 'duration', 'travelers', 'budget', 'overview'],
    },
    budgetOverview: {
      type: Type.OBJECT,
      properties: {
        estimatedTotal: { type: Type.STRING, description: 'Total projected cost' },
        accommodation: { type: Type.STRING, description: 'Cost for lodging' },
        food: { type: Type.STRING, description: 'Cost for meals & drinks' },
        transport: { type: Type.STRING, description: 'Cost for transit & rentals' },
        activities: { type: Type.STRING, description: 'Cost for attractions & entry passes' },
        notes: { type: Type.STRING, description: 'Budget analysis, constraint evaluation & saving tips' },
      },
      required: ['estimatedTotal', 'accommodation', 'food', 'transport', 'activities', 'notes'],
    },
    days: {
      type: Type.ARRAY,
      items: daySchema,
    },
    packingSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Useful packing essentials for this destination and climate',
    },
    travelTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Practical local insider tips',
    },
    importantNotes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Important warnings, season limitations, or budget reality checks',
    },
  },
  required: ['tripSummary', 'budgetOverview', 'days', 'packingSuggestions', 'travelTips', 'importantNotes'],
};

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    model: GEMINI_MODEL,
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Helper to call Gemini with retry and fallback
async function generateWithGemini(userPrompt: string, temperature = 0.7) {
  const modelsToTry = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[WanderWise] Attempting Gemini call with ${model} (attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: tripSchema,
            temperature: temperature,
          },
        });

        const responseText = response.text;
        if (responseText) {
          return {
            text: responseText,
            usedModel: model,
          };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[WanderWise] Model ${model} attempt ${attempt} error:`, err?.message || err);
        // If it's a 503 or transient rate limit, wait briefly
        await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
      }
    }
  }

  throw lastError || new Error('Failed to generate response after trying available models.');
}

// Generate Trip Itinerary
app.post('/api/trips/generate', async (req: Request, res: Response) => {
  try {
    const preferences: TripPreferences = req.body;

    // Validation
    if (!preferences.destination || typeof preferences.destination !== 'string' || !preferences.destination.trim()) {
      res.status(400).json({ error: 'Please provide a valid destination.' });
      return;
    }

    const daysNum = Number(preferences.days);
    if (!daysNum || daysNum < 1 || daysNum > 14) {
      res.status(400).json({ error: 'Number of days must be between 1 and 14 days.' });
      return;
    }

    if (!preferences.budget || !preferences.budget.trim()) {
      res.status(400).json({ error: 'Please specify an approximate budget.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please check your environment variables.',
      });
      return;
    }

    // Build Structured Prompt
    const userPrompt = buildTripPrompt(preferences);

    // Call Gemini with resilient fallback
    const { text: responseText, usedModel } = await generateWithGemini(userPrompt, 0.7);

    let parsedItinerary: TripItinerary;
    try {
      parsedItinerary = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      throw new Error('Failed to parse AI itinerary response. Please retry.');
    }

    // Return structured payload along with prompt debug context for academic evaluation
    res.json({
      itinerary: parsedItinerary,
      debugPrompt: {
        systemInstruction: SYSTEM_INSTRUCTION,
        userPrompt: userPrompt,
        modelName: usedModel,
      },
    });
  } catch (error: any) {
    console.error('Error generating trip itinerary:', error);
    res.status(500).json({
      error: error.message || 'An unexpected error occurred while generating your itinerary. Please try again.',
    });
  }
});

// Refine Trip Itinerary (Contextual Delta Prompting)
app.post('/api/trips/refine', async (req: Request, res: Response) => {
  try {
    const { preferences, currentItinerary, refinementRequest } = req.body;

    if (!preferences || !currentItinerary) {
      res.status(400).json({ error: 'Missing baseline preferences or current itinerary.' });
      return;
    }

    if (!refinementRequest || typeof refinementRequest !== 'string' || !refinementRequest.trim()) {
      res.status(400).json({ error: 'Please provide a refinement request instruction.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured on the server.',
      });
      return;
    }

    // Build Contextual Refinement Prompt
    const userPrompt = buildRefinementPrompt(preferences, currentItinerary, refinementRequest.trim());

    // Call Gemini with current state preservation
    const { text: responseText, usedModel } = await generateWithGemini(userPrompt, 0.65);

    let refinedItinerary: TripItinerary;
    try {
      refinedItinerary = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse refinement JSON:', responseText);
      throw new Error('Failed to parse refined itinerary. Please retry.');
    }

    res.json({
      itinerary: refinedItinerary,
      debugPrompt: {
        systemInstruction: SYSTEM_INSTRUCTION,
        userPrompt: userPrompt,
        modelName: usedModel,
      },
    });
  } catch (error: any) {
    console.error('Error refining trip itinerary:', error);
    res.status(500).json({
      error: error.message || 'Failed to refine trip itinerary. Please try again.',
    });
  }
});

// Server boot with Vite middleware integration
async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[WanderWise] Server running on http://0.0.0.0:${port} using ${GEMINI_MODEL}`);
  });
}

bootstrap();
