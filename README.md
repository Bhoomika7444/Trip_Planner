# WanderWise — AI Trip Planner

> A College GenAI Mini-Project demonstrating effective prompt engineering, structured Generative AI output, and practical constraint-aware travel planning using the **Google Gemini API**.

---

## 1. Project Overview

**WanderWise** is a full-stack AI-powered personalized travel itinerary planner. Rather than operating as an unconstrained open-ended chatbot, WanderWise captures structured traveler preferences—such as destination, duration, budget in INR (₹), travel pace, party size, transportation mode, accommodation tier, and nuanced personal constraints—and constructs an engineered prompt that guides **Google Gemini (`gemini-3.8-flash`)** to produce a realistic, geographically cohesive, and budget-validated itinerary formatted in strict JSON.

---

## 2. Problem Statement

Traditional travel planning is either:
- **Fragmented & Time-Consuming:** Travelers spend hours searching blogs, maps, and review forums, struggling to cluster sights geographically or estimate realistic day-to-day costs.
- **Generic Tourist Filler:** Off-the-shelf chatbots or standard tour packages recommend the same clichéd checklist sights regardless of traveler interests, leading to rushed schedules, excessive transit fatigue, and budget overruns.

WanderWise solves this by translating specific traveler constraints and tastes into an intelligent, structured itinerary that balances time, budget, geography, and personal pace.

---

## 3. Why GenAI is Useful Here

1. **Context Synthesis Across Dimensions:** A human planner must juggle weather, local transit modes, dining styles, budget caps, and daily energy levels simultaneously. Large language models (LLMs) excel at multidimensional constraint balancing.
2. **True Personalization:** A traveler requesting *Food + History* receives an itinerary centered around authentic culinary walks and historic monuments, whereas another requesting *Relaxation + Nature* receives scenic viewpoints, peaceful sunset spots, and leisurely mornings.
3. **Conversational Refinement without Starting Over:** Using contextual delta prompting, travelers can modify a specific parameter (e.g., *"Make it cheaper"* or *"Add more adventure"*) while keeping intact the rest of their trip schedule.

---

## 4. Main Features

- 🧭 **Structured Travel Intake:** Captures destination, days (1–14), party size, budget in INR (₹), travel month, 10 selectable interest chips, travel pace (Relaxed, Balanced, Packed), transit, stay tier, and custom notes.
- ⚡ **"Try an Example" (Instant Evaluator Test):** Pre-populates the form with the default evaluation case: Goa, 3 Days, 2 Travelers, ₹15,000 budget, November, Beaches/Food/Nature, Relaxed pace, Mixed transport, Mid-range stay, Local Food, and *"Avoid very early mornings."*
- 🎯 **Evaluator Presets:** 1-click test scenarios for testing prompt edge-cases:
  - *Test 1 (Tight Budget):* Manali, 4 days, ₹6,000 for 2 students.
  - *Test 2 (Culture & Food):* Kyoto, 4 days, tea houses & historic shrines.
  - *Test 3 (Packed Pace):* Jaipur, 2 days, intensive forts & bazaar shopping.
- 📊 **Budget & Logistics Breakdown:** Estimates total expenditure vs. user target, categorized into Stay, Food, Transit, and Activities with feasibility commentary.
- 🗓️ **Day-by-Day Visual Timeline:** Clear Morning, Afternoon, and Evening activity cards with best times, durations, costs, and an explicit **"Why selected"** reason badge demonstrating prompt personalization.
- 🔄 **Iterative "Refine My Trip":** Predefined refinement buttons (*Make it cheaper, Make it more relaxed, Add more food experiences, Add more adventure, Add more nature, Reduce travel time, Remove shopping, Add hidden gems*) + custom instructions.
- 🔬 **Built-In Prompt Inspector:** An evaluator-friendly modal displaying the live user prompt, system instructions, and schema passed to Gemini.
- 🎒 **Packing & Travel Tips:** Interactive checklist of destination-specific packing items and local insider tips.
- 🖨️ **Print & Export:** Clean print stylesheet to save or print the final itinerary.

---

## 5. Tech Stack

- **Frontend:**
  - React 19 (TypeScript)
  - Vite 8
  - Tailwind CSS 4
  - Framer Motion / Motion
  - Lucide React Icons
- **Backend:**
  - Node.js & Express.js
  - `@google/genai` TypeScript SDK (v2.4.0)
- **AI Model:**
  - Google Gemini API (`gemini-3.8-flash`)
  - Server-side only (API key never exposed to browser)
  - Strict JSON Schema output (`responseMimeType: "application/json"`)

---

## 6. Architecture & Workflow

```
┌─────────────────────────┐
│     USER INTERACTION    │  (Selects destination, budget, pace, interests)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   PROMPT CONSTRUCTION   │  (buildTripPrompt / buildRefinementPrompt)
│   - Role Prompting      │  - Constraint Enforcement
│   - Geo-Clustering      │  - Pace Calibration
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   EXPRESS API SERVER    │  (POST /api/trips/generate or /api/trips/refine)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    GOOGLE GEMINI API    │  (Model: gemini-3.8-flash with JSON Schema)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  TYPED JSON ITINERARY   │  (Validated against TripItinerary interface)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    POLISHED UI CARDS    │  (Timeline, Budget Breakdown, Packing Checklist)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ ITERATIVE REFINEMENT    │  (Sends existing itinerary + refinement delta)
└─────────────────────────┘
```

---

## 7. Gemini Integration

All Gemini SDK operations are isolated on the server (`server.ts`):
- Initializes `@google/genai` with `{ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } }`.
- Configurable model via `GEMINI_MODEL` (defaults to `gemini-3.8-flash`).
- Enforces structured JSON output via `responseMimeType: "application/json"` and `responseSchema` with typed fields for activities, days, budget categories, and tips.

---

## 8. Prompt Engineering Approach

The prompt architecture is the core intelligence of WanderWise. It is implemented in `src/utils/prompts.ts` with dedicated modular functions:

### 1. Role Prompting
Gemini is grounded in a specialized persona:
> *"You are WanderWise AI, a world-class travel planner and logistics strategist specializing in personalized, realistic, constraint-aware travel itineraries."*

This prevents conversational pleasantries and forces direct, actionable travel logistics.

### 2. Constraint Prompting
The model is constrained by strict logistical rules:
- **Budget Calibration:** Realistically distributes funds across lodging, food, transit, and entry tickets.
- **Geographical Clustering:** Morning, afternoon, and evening activities on any day must be in geographical proximity to avoid long travel times.
- **Seasonality & Climate:** Considers the user's travel month (e.g., weather in Goa in November vs. Manali in December).
- **Party Size & Dining:** Adapts recommendations based on solo, couple, or group travel.

### 3. Handling Impossible & Extreme Constraints
If a user specifies an extremely low budget (e.g. ₹6,000 for 4 days in Manali):
- The AI does not hallucinate free luxury or pretend the budget is lavish.
- It actively designs the highest-value budget route (dhaba meals, state transport, scenic walking trails).
- It explicitly notes the limitation in `budgetOverview.notes` and `importantNotes`.

### 4. Pacing Rules
- **Relaxed:** Max 1–2 activities per day, scheduled after 10:00 AM, with generous rest and free time.
- **Balanced:** 2–3 activities per day with steady rhythm and comfortable meal intervals.
- **Packed:** 3–4 high-energy activities per day, tightly geographically clustered to prevent fatigue.

### 5. Personalization Grounding
Every activity in the schema includes a `reason` field:
> *"Why WanderWise chose this: Matches your selected interests in Beaches & Local Food while honoring the request to avoid early mornings."*

This allows evaluators to directly verify that the AI is not providing boilerplate results.

### 6. Structured Output Contract
Using Gemini's `responseSchema` ensures that the output is always parseable JSON matching the `TripItinerary` TypeScript type, eliminating UI rendering failures.

---

## 9. How Refinement Prompting Works

When the user selects **Refine My Trip**:
1. WanderWise packages:
   - **Original Profile Baseline** (destination, days, budget, interests)
   - **Existing Generated Itinerary** (full JSON representation)
   - **Refinement Instruction** (e.g., *"Make it cheaper"* or *"Add more food experiences"*)
2. The refinement prompt instructs Gemini:
   - Destination, duration, and party size are **LOCKED** (cannot be changed).
   - Apply a **targeted delta**: update only the activities or budget line items affected by the instruction.
   - Maintain the identical JSON schema.
   - Update the `reason` field for modified activities explaining how the new spot addresses the refinement request.

---

## 10. Environment Variable Setup

Create a `.env` file in the project root:

```env
# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key-here"

# Model name (default: gemini-3.8-flash)
GEMINI_MODEL="gemini-3.8-flash"

# Port (optional, defaults to 3000)
PORT=3000
```

---

## 11. How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your API key in `.env`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 12. Limitations

- **Live Inventory / Real-Time Pricing:** Gemini provides accurate estimates based on historical knowledge, but does not query live hotel or flight booking availability engines.
- **Dynamic Weather Fluctuations:** Estimates are based on seasonal climate norms for the selected month rather than live 24-hour meteorological forecasts.

---

## 13. Future Scope

- Direct PDF downloadable export with custom offline maps.
- Multi-city sequential road trip itineraries (e.g. Golden Triangle: Delhi → Agra → Jaipur).
- Multi-currency conversion (USD, EUR, GBP, AED, etc.).
- Audio itinerary briefing using Gemini Text-to-Speech (`gemini-3.8-flash-lite-tts`).
