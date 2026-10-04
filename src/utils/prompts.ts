/**
 * WanderWise Prompt Engineering Architecture
 * 
 * Demonstrates:
 * 1. Role Prompting (Specialized Senior Travel Strategist)
 * 2. Profile Grounding & Constraint Engineering (Budget, Pacing, Seasonality, Party Size)
 * 3. Handling Edge Cases & Impossible Constraints (Low budgets, tight pace, opposing interests)
 * 4. Structured Output Formulation (Strict Schema adherence)
 * 5. Iterative / Contextual Refinement (Delta modifications preserving original travel baseline)
 */

import { TripPreferences, TripItinerary } from '../types/trip';

/**
 * System Instruction for Gemini
 * Establishes the authoritative AI persona, operational rules, and behavioral boundaries.
 */
export const SYSTEM_INSTRUCTION = `
You are WanderWise AI, a world-class travel planner and logistics strategist specializing in personalized, realistic, constraint-aware travel itineraries.

YOUR CORE PRINCIPLES:
1. PRACTICAL FEASIBILITY OVER GENERIC TOURISM: Group geographically contiguous points of interest. Account for real-world travel effort, traffic, and opening hours.
2. RIGOROUS CONSTRAINT ADHERENCE: Strictly calibrate recommendations to the specified budget, selected travel pace, party size, transportation mode, and seasonal month.
3. AUTHENTIC PERSONALIZATION: Actively emphasize the user's selected interests (e.g. food, nature, photography) instead of filling the itinerary with generic checklists.
4. HONEST CONSTRAINT BALANCING: If the user provides a budget that is unusually tight or near-impossible for the destination, craft the best possible budget-conscious itinerary, explicitly highlight this constraint in the budget notes and important notes, and offer practical cost-saving alternatives without fabricating impossible prices.
5. NO HALLUCINATED CERTAINTY: Provide realistic price and duration estimates.
6. NO CHAIN-OF-THOUGHT EXPOSURE: Provide clear, concise reasons for each activity directly within the structured activity fields, but do not emit internal reasoning or thought traces.
`.trim();

/**
 * Builds the comprehensive prompt for initial trip generation.
 * 
 * Follows structured prompt engineering sections:
 * - [ROLE & OBJECTIVE]
 * - [USER PROFILE & SPECIFICATIONS]
 * - [PACING & TEMPO GUIDELINES]
 * - [CONSTRAINTS & LOGISTICAL RULES]
 * - [OUTPUT CONTRACT]
 */
export function buildTripPrompt(prefs: TripPreferences): string {
  // Format interest list
  const interestsList = prefs.interests.length > 0 
    ? prefs.interests.join(', ') 
    : 'General sightseeing, local culture, and relaxation';

  // Pace instruction refinement
  let paceSpecifics = '';
  if (prefs.pace === 'Relaxed') {
    paceSpecifics = `The user chose a RELAXED pace: Do NOT overcrowd days. Maximum 1-2 major activities per day with ample free time, scenic rests, and leisurely meals. No hectic transitions.`;
  } else if (prefs.pace === 'Packed') {
    paceSpecifics = `The user chose a PACKED pace: Maximize time efficiently with 3-4 engaging activities per day while maintaining geographical logic to prevent burnout.`;
  } else {
    paceSpecifics = `The user chose a BALANCED pace: Plan 2-3 well-spaced activities per day with comfortable rest intervals and relaxed dining.`;
  }

  return `
### OBJECTIVE
Create an exceptionally tailored, day-by-day travel itinerary for ${prefs.days} days in ${prefs.destination} based on the detailed traveler profile below.

### TRAVELER PROFILE
- Destination: ${prefs.destination}
- Duration: ${prefs.days} Day(s)
- Number of Travelers: ${prefs.travelers} person(s)
- Approximate Budget: ${prefs.budget} (Default currency: INR / specified local equivalent)
- Travel Month: ${prefs.travelMonth}
- Key Interests: ${interestsList}
- Travel Pace: ${prefs.pace} (${paceSpecifics})
- Preferred Transportation: ${prefs.transportation}
- Accommodation Tier: ${prefs.accommodation}
- Food Preference: ${prefs.foodPreference}
${prefs.specialRequirements ? `- Special Requirements / User Notes: "${prefs.specialRequirements}"` : '- Special Requirements: None specified'}

### CONSTRAINTS & PRACTICALITY GUIDELINES
1. BUDGET DISTRIBUTION: Allocate the budget realistically across accommodation, meals, transit, and entry fees. If the budget is tight (e.g. college student budget), recommend street food, self-guided walks, free heritage spots, and affordable local transit.
2. GEOGRAPHICAL CLUSTERING: Ensure morning, afternoon, and evening activities on any given day are in proximity to avoid spending hours traversing the city.
3. WEATHER & SEASONALITY: Reflect the seasonal reality of ${prefs.destination} in ${prefs.travelMonth} (e.g. monsoon precautions, peak season tips, pleasant evening weather).
4. SPECIAL REQUEST INTEGRATION: If the traveler has special notes (such as avoiding early mornings, prefer quiet places, dietary requirements), abide by them strictly. For example, if they avoid early mornings, schedule morning activities starting at 10:00 AM or 10:30 AM.
5. JUSTIFICATION PER ACTIVITY: For every single activity, include a concise "reason" explaining why it matches their stated interests (${interestsList}) or constraints.

Ensure all response fields are populated with engaging, concrete, and actionable advice.
`.trim();
}

/**
 * Builds the contextual refinement prompt for iterative updates.
 * 
 * Demonstrates:
 * - Contextual Prompting (passes baseline itinerary)
 * - Delta Modification (modifies only requested dimension while preserving intact schedule)
 * - Constraint Invariance (keeps destination, duration, and party size locked)
 */
export function buildRefinementPrompt(
  prefs: TripPreferences,
  currentItinerary: TripItinerary,
  refinementRequest: string
): string {
  return `
### REFINEMENT OBJECTIVE
You are modifying an existing ${prefs.days}-day itinerary for ${prefs.destination} based on a user's refinement request.

### TRAVELER BASELINE
- Destination: ${prefs.destination} (LOCKED - DO NOT CHANGE)
- Duration: ${prefs.days} Days (LOCKED - DO NOT CHANGE)
- Travelers: ${prefs.travelers} (LOCKED - DO NOT CHANGE)
- Original Budget: ${prefs.budget}
- Travel Month: ${prefs.travelMonth}
- Stated Interests: ${prefs.interests.join(', ')}

### USER REFINEMENT INSTRUCTION
"${refinementRequest}"

### REFINEMENT RULES:
1. TARGETED ADJUSTMENT: Update ONLY the activities, budget allocations, or pace affected by the user's request. Preserve whatever is already well-suited.
2. CONSISTENCY: Maintain the existing JSON structure and ensure day numbers remain 1 to ${prefs.days}.
3. REASON FIELD UPDATE: When you replace or tweak an activity, update its "reason" field to reflect how it honors the user's refinement ("${refinementRequest}").
4. BUDGET IMPACT: If the refinement is "Make it cheaper", recalculate the budget overview downwards with specific thrifty alternatives. If "Add more adventure", adjust activity allocations accordingly.

### CURRENT ITINERARY (FOR CONTEXT)
${JSON.stringify(currentItinerary, null, 2)}
`.trim();
}
