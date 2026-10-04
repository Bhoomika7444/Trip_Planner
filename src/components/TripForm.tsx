import React from 'react';
import { 
  TripPreferences, 
  TravelPace, 
  TransportationPreference, 
  AccommodationPreference, 
  FoodPreference 
} from '../types/trip';
import { 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Compass, 
  Check, 
  HelpCircle,
  IndianRupee,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface TripFormProps {
  preferences: TripPreferences;
  onChange: (updated: TripPreferences) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadExample: () => void;
  onLoadPreset?: (presetKey: string) => void;
  isLoading: boolean;
}

const ALL_INTERESTS = [
  'Nature',
  'Beaches',
  'Adventure',
  'Food',
  'History',
  'Culture',
  'Shopping',
  'Nightlife',
  'Photography',
  'Relaxation',
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PACES: { value: TravelPace; label: string; desc: string }[] = [
  { value: 'Relaxed', label: 'Relaxed', desc: '1-2 spots/day, late mornings & free time' },
  { value: 'Balanced', label: 'Balanced', desc: '2-3 spots/day, steady rhythm & scenic breaks' },
  { value: 'Packed', label: 'Packed', desc: '3-4 spots/day, max sightseeing & high energy' },
];

const TRANSPORT_OPTIONS: TransportationPreference[] = [
  'Public Transport',
  'Rental Vehicle',
  'Taxi/Cab',
  'Walking',
  'Mixed',
];

const ACCOMMODATION_OPTIONS: AccommodationPreference[] = [
  'Budget',
  'Mid-range',
  'Luxury',
];

const FOOD_OPTIONS: FoodPreference[] = [
  'Local Food',
  'Vegetarian',
  'Non-Vegetarian',
  'Mixed',
  'Fine Dining',
];

export const TripForm: React.FC<TripFormProps> = ({
  preferences,
  onChange,
  onSubmit,
  onLoadExample,
  onLoadPreset,
  isLoading,
}) => {
  const toggleInterest = (interest: string) => {
    const current = preferences.interests;
    if (current.includes(interest)) {
      onChange({
        ...preferences,
        interests: current.filter((i) => i !== interest),
      });
    } else {
      onChange({
        ...preferences,
        interests: [...current, interest],
      });
    }
  };

  return (
    <div id="trip-planner-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pb-16">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Card 1: Destination & Core Logistics */}
        <div 
          id="destination-card"
          className="scroll-mt-20 sm:scroll-mt-24 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Destination & Timeline</h2>
              <p className="text-xs text-slate-500">Where are you heading and for how long?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Destination */}
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Destination *</span>
              </label>
              <input
                id="destination-input"
                type="text"
                required
                value={preferences.destination}
                onChange={(e) => onChange({ ...preferences, destination: e.target.value })}
                placeholder="e.g. Goa, Manali, Jaipur, Kyoto, Bali..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50/50"
              />
              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="text-[11px] font-medium text-slate-400">Popular:</span>
                {['Goa', 'Manali', 'Jaipur', 'Kerala', 'Kyoto', 'Udaipur'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => onChange({ ...preferences, destination: city })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Duration (Days) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={14}
                  required
                  value={preferences.days || ''}
                  onChange={(e) => onChange({ ...preferences, days: Math.max(1, Math.min(14, Number(e.target.value))) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 bg-slate-50/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Days
                </span>
              </div>
            </div>

            {/* Travelers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Travelers *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={preferences.travelers || ''}
                  onChange={(e) => onChange({ ...preferences, travelers: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 bg-slate-50/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Person(s)
                </span>
              </div>
            </div>

            {/* Travel Month */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Travel Month *</span>
              </label>
              <select
                value={preferences.travelMonth}
                onChange={(e) => onChange({ ...preferences, travelMonth: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 bg-slate-50/50"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Budgeting & Accommodation */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Budget & Stay Tier</h2>
              <p className="text-xs text-slate-500">Provide an approximate total budget in INR (₹)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Budget Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                <span>Approximate Total Budget *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={preferences.budget}
                  onChange={(e) => onChange({ ...preferences, budget: e.target.value })}
                  placeholder="e.g. ₹15,000 or 15000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>
              {/* Quick budget chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-400">Presets:</span>
                {['₹8,000', '₹15,000', '₹25,000', '₹45,000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => onChange({ ...preferences, budget: amt })}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Accommodation Preference *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ACCOMMODATION_OPTIONS.map((tier) => {
                  const isSelected = preferences.accommodation === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => onChange({ ...preferences, accommodation: tier })}
                      className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Interests & Travel Pace */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Interests & Travel Pace</h2>
              <p className="text-xs text-slate-500">Pick what you love and how fast you want to travel</p>
            </div>
          </div>

          {/* Interests Chips */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center justify-between">
              <span>Select Interests (Multi-select)</span>
              <span className="text-[11px] font-normal text-slate-400">
                {preferences.interests.length} selected
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map((interest) => {
                const isSelected = preferences.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Pace */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              Travel Pace *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PACES.map((p) => {
                const isSelected = preferences.pace === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => onChange({ ...preferences, pace: p.value })}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {p.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transportation & Food Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Transportation Preference *
              </label>
              <select
                value={preferences.transportation}
                onChange={(e) => onChange({ ...preferences, transportation: e.target.value as TransportationPreference })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 bg-slate-50/50"
              >
                {TRANSPORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Food Preference *
              </label>
              <select
                value={preferences.foodPreference}
                onChange={(e) => onChange({ ...preferences, foodPreference: e.target.value as FoodPreference })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 bg-slate-50/50"
              >
                {FOOD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Special Requirements / Free Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Special Requirements & Nuances</h2>
              <p className="text-xs text-slate-500">Any personal preferences or constraints Gemini should honor</p>
            </div>
          </div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Additional Preferences / Notes
          </label>
          <textarea
            rows={3}
            value={preferences.specialRequirements || ''}
            onChange={(e) => onChange({ ...preferences, specialRequirements: e.target.value })}
            placeholder="e.g. I don't want early mornings and I prefer peaceful places with scenic viewpoints."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/50 resize-y"
          />
        </div>

        {/* Form Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-8">
          <button
            type="button"
            onClick={onLoadExample}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>Try an Example (Goa, 3 Days)</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{isLoading ? 'Generating Plan...' : 'Generate AI Itinerary'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
