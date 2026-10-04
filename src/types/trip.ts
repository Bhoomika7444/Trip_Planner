/**
 * Trip Planner Types & Schemas
 * WanderWise — AI Trip Planner
 */

export type TravelPace = 'Relaxed' | 'Balanced' | 'Packed';

export type TransportationPreference = 
  | 'Public Transport' 
  | 'Rental Vehicle' 
  | 'Taxi/Cab' 
  | 'Walking' 
  | 'Mixed';

export type AccommodationPreference = 
  | 'Budget' 
  | 'Mid-range' 
  | 'Luxury';

export type FoodPreference = 
  | 'Local Food' 
  | 'Vegetarian' 
  | 'Non-Vegetarian' 
  | 'Mixed' 
  | 'Fine Dining';

export interface TripPreferences {
  destination: string;
  days: number;
  travelers: number;
  budget: string;
  travelMonth: string;
  interests: string[];
  pace: TravelPace;
  transportation: TransportationPreference;
  accommodation: AccommodationPreference;
  foodPreference: FoodPreference;
  specialRequirements?: string;
}

export interface TripActivity {
  activity: string;
  description: string;
  estimatedCost: string;
  estimatedDuration: string;
  bestTime: string;
  reason: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  theme?: string;
  morning: TripActivity[];
  afternoon: TripActivity[];
  evening: TripActivity[];
  estimatedDailyCost: string;
  travelNotes: string;
}

export interface TripItinerary {
  tripSummary: {
    destination: string;
    duration: string;
    travelers: string;
    budget: string;
    overview: string;
    bestTimeToVisitNote?: string;
    paceAdherence?: string;
  };
  budgetOverview: {
    estimatedTotal: string;
    accommodation: string;
    food: string;
    transport: string;
    activities: string;
    notes: string;
  };
  days: DayItinerary[];
  packingSuggestions: string[];
  travelTips: string[];
  importantNotes: string[];
}

export interface GenerateTripResponse {
  itinerary: TripItinerary;
  debugPrompt?: {
    systemInstruction: string;
    userPrompt: string;
    modelName: string;
  };
}
