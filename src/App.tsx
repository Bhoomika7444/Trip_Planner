/**
 * WanderWise — AI Trip Planner
 * Main Application Component
 */

import React, { useState } from 'react';
import { TripPreferences, TripItinerary, GenerateTripResponse } from './types/trip';
import { buildTripPrompt } from './utils/prompts';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripForm } from './components/TripForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ItineraryView } from './components/ItineraryView';
import { RefineSection } from './components/RefineSection';
import { PromptInspectorModal } from './components/PromptInspectorModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

const DEFAULT_PREFERENCES: TripPreferences = {
  destination: 'Goa',
  days: 3,
  travelers: 2,
  budget: '₹15,000',
  travelMonth: 'November',
  interests: ['Beaches', 'Food', 'Nature'],
  pace: 'Relaxed',
  transportation: 'Mixed',
  accommodation: 'Mid-range',
  foodPreference: 'Local Food',
  specialRequirements: 'Avoid very early mornings and I prefer peaceful places with scenic sunsets.',
};

export default function App() {
  const [preferences, setPreferences] = useState<TripPreferences>(DEFAULT_PREFERENCES);
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationCount, setIterationCount] = useState<number>(1);
  const [debugPrompt, setDebugPrompt] = useState<{
    systemInstruction: string;
    userPrompt: string;
    modelName: string;
  } | null>(null);
  const [isPromptInspectorOpen, setIsPromptInspectorOpen] = useState<boolean>(false);

  // Load requested default test example
  const handleLoadExample = () => {
    setPreferences({
      destination: 'Goa',
      days: 3,
      travelers: 2,
      budget: '₹15,000',
      travelMonth: 'November',
      interests: ['Beaches', 'Food', 'Nature'],
      pace: 'Relaxed',
      transportation: 'Mixed',
      accommodation: 'Mid-range',
      foodPreference: 'Local Food',
      specialRequirements: 'Avoid very early mornings and I prefer peaceful places.',
    });
    scrollToForm();
  };

  // Evaluator presets for immediate test scenario evaluation
  const handleLoadPreset = (presetKey: string) => {
    if (presetKey === 'manali') {
      // Test: Low budget constraint + expensive destination
      setPreferences({
        destination: 'Manali',
        days: 4,
        travelers: 2,
        budget: '₹6,000',
        travelMonth: 'December',
        interests: ['Nature', 'Adventure', 'Photography'],
        pace: 'Balanced',
        transportation: 'Public Transport',
        accommodation: 'Budget',
        foodPreference: 'Vegetarian',
        specialRequirements: 'Shoestring student budget. Prefer free mountain walks and budget local dhabas.',
      });
    } else if (presetKey === 'kyoto') {
      // Test: Food + culture focused trip
      setPreferences({
        destination: 'Kyoto',
        days: 4,
        travelers: 2,
        budget: '₹80,000',
        travelMonth: 'April',
        interests: ['Culture', 'History', 'Food', 'Photography'],
        pace: 'Balanced',
        transportation: 'Public Transport',
        accommodation: 'Mid-range',
        foodPreference: 'Local Food',
        specialRequirements: 'Focus on authentic matcha tea ceremonies, peaceful shrines, and culinary markets.',
      });
    } else if (presetKey === 'jaipur') {
      // Test: Packed itinerary with specific heritage & shopping
      setPreferences({
        destination: 'Jaipur',
        days: 2,
        travelers: 3,
        budget: '₹18,000',
        travelMonth: 'February',
        interests: ['History', 'Culture', 'Shopping', 'Food'],
        pace: 'Packed',
        transportation: 'Taxi/Cab',
        accommodation: 'Mid-range',
        foodPreference: 'Vegetarian',
        specialRequirements: 'Cover the major forts and traditional bazaars without missing authentic Rajasthani thali.',
      });
    } else {
      handleLoadExample();
    }
    scrollToForm();
  };

  const scrollToForm = () => {
    const el = document.getElementById('destination-card') || document.getElementById('trip-planner-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = document.getElementById('destination-input');
        if (input) {
          input.focus({ preventScroll: true });
        }
      }, 350);
    }
  };

  // Handle Form Submission -> Initial Generation
  const handleGenerateTrip = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIterationCount(1);

    try {
      const res = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      const data: GenerateTripResponse & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate itinerary. Please try again.');
      }

      setItinerary(data.itinerary);
      if (data.debugPrompt) {
        setDebugPrompt(data.debugPrompt);
      }

      // Smooth scroll down to generated itinerary
      setTimeout(() => {
        const el = document.getElementById('itinerary-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Error generating trip:', err);
      setError(err.message || 'An error occurred while generating your itinerary.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Iterative Prompt Refinement
  const handleRefineTrip = async (refinementRequest: string) => {
    if (!itinerary) return;
    setError(null);
    setIsRefining(true);

    try {
      const res = await fetch('/api/trips/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences,
          currentItinerary: itinerary,
          refinementRequest,
        }),
      });

      const data: GenerateTripResponse & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to refine itinerary. Please try again.');
      }

      setItinerary(data.itinerary);
      setIterationCount((prev) => prev + 1);
      if (data.debugPrompt) {
        setDebugPrompt(data.debugPrompt);
      }

      // Scroll slightly up to see changes
      const el = document.getElementById('itinerary-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Error refining trip:', err);
      setError(err.message || 'An error occurred while refining your itinerary.');
    } finally {
      setIsRefining(false);
    }
  };

  const handlePlanAnother = () => {
    setItinerary(null);
    setError(null);
    scrollToForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
        onPlanTripClick={scrollToForm}
        hasItinerary={!!itinerary}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onPlanTripClick={scrollToForm}
          onSelectPreset={() => handleLoadExample()}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-bold mb-0.5">Could not generate itinerary</p>
                <p className="text-rose-700 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Form Section */}
        <TripForm
          preferences={preferences}
          onChange={setPreferences}
          onSubmit={handleGenerateTrip}
          onLoadExample={handleLoadExample}
          onLoadPreset={handleLoadPreset}
          isLoading={isLoading || isRefining}
        />

        {/* Live Loading Overlay / Screen */}
        {(isLoading || isRefining) && (
          <div className="my-10">
            <LoadingScreen
              destination={preferences.destination}
              isRefining={isRefining}
            />
          </div>
        )}

        {/* Itinerary Results Section */}
        {itinerary && !isLoading && (
          <div id="itinerary-results" className="pt-6">
            <ItineraryView
              itinerary={itinerary}
              onOpenPromptInspector={() => setIsPromptInspectorOpen(true)}
              onPlanAnother={handlePlanAnother}
              iterationCount={iterationCount}
            />

            {/* Refinement Section */}
            <RefineSection
              onRefine={handleRefineTrip}
              isLoading={isRefining}
            />
          </div>
        )}
      </main>

      {/* Prompt Inspector Modal (for College Evaluator) */}
      <PromptInspectorModal
        isOpen={isPromptInspectorOpen}
        onClose={() => setIsPromptInspectorOpen(false)}
        debugPrompt={debugPrompt}
        lastUserPrompt={buildTripPrompt(preferences)}
      />
    </div>
  );
}
