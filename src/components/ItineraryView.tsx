import React, { useState } from 'react';
import { 
  TripItinerary, 
  TripActivity 
} from '../types/trip';
import { 
  Calendar, 
  Users, 
  IndianRupee, 
  Clock, 
  Sunrise, 
  Sun, 
  Sunset, 
  MapPin, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle, 
  Briefcase, 
  Printer, 
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItineraryViewProps {
  itinerary: TripItinerary;
  onOpenPromptInspector: () => void;
  onPlanAnother: () => void;
  iterationCount?: number;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onOpenPromptInspector,
  onPlanAnother,
  iterationCount = 1,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [checkedPacking, setCheckedPacking] = useState<Record<number, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const togglePackingItem = (idx: number) => {
    setCheckedPacking((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const daysToRender = selectedDay === 'all' 
    ? itinerary.days 
    : itinerary.days.filter((d) => d.dayNumber === selectedDay);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              AI-Generated Plan {iterationCount > 1 ? `(Revision v${iterationCount})` : ''}
            </span>
            <span className="text-xs text-slate-400 font-medium">Structured Gemini Output</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {itinerary.tripSummary.destination} Expedition
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={onOpenPromptInspector}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prompt Inspector</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onPlanAnother}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs"
          >
            New Trip
          </button>
        </div>
      </div>

      {/* 1. Trip Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Destination</span>
            </div>
            <p className="font-bold text-base sm:text-lg text-white">{itinerary.tripSummary.destination}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Duration</span>
            </div>
            <p className="font-bold text-base sm:text-lg text-white">{itinerary.tripSummary.duration}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Travelers</span>
            </div>
            <p className="font-bold text-base sm:text-lg text-white">{itinerary.tripSummary.travelers}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Budget</span>
            </div>
            <p className="font-bold text-base sm:text-lg text-emerald-400">{itinerary.tripSummary.budget}</p>
          </div>
        </div>

        {/* Overview Narrative */}
        <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-4">
          {itinerary.tripSummary.overview}
        </p>

        {/* Contextual Weather / Pace Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {itinerary.tripSummary.bestTimeToVisitNote && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-medium text-slate-200 border border-white/10">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{itinerary.tripSummary.bestTimeToVisitNote}</span>
            </div>
          )}

          {itinerary.tripSummary.paceAdherence && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-xs font-medium text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{itinerary.tripSummary.paceAdherence}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Budget Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              <span>Estimated Budget Allocation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Constraint-checked expenditure breakdown</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-extrabold text-base flex items-center gap-1.5 w-fit">
            <span className="text-xs font-semibold text-emerald-700">Projected Total:</span>
            <span>{itinerary.budgetOverview.estimatedTotal}</span>
          </div>
        </div>

        {/* 4 Pillars of Spend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Stay / Lodging
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              {itinerary.budgetOverview.accommodation}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Food & Drinks
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              {itinerary.budgetOverview.food}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Local Transit
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              {itinerary.budgetOverview.transport}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Activities & Fees
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              {itinerary.budgetOverview.activities}
            </span>
          </div>
        </div>

        {/* Feasibility Notes */}
        {itinerary.budgetOverview.notes && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
              <span className="font-bold">AI Budget Feasibility Note:</span> {itinerary.budgetOverview.notes}
            </p>
          </div>
        )}
      </motion.div>

      {/* 3. Day-by-Day Timeline */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Day-by-Day Itinerary
            </h2>
            <p className="text-xs text-slate-500">Geographically optimized schedule and dining</p>
          </div>

          {/* Day Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Days ({itinerary.days.length})
            </button>
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDay(day.dayNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day.dayNumber
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Day Cards List */}
        <div className="space-y-8">
          {daysToRender.map((day) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden"
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                    D{day.dayNumber}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{day.title}</h3>
                    {day.theme && (
                      <p className="text-xs font-semibold text-emerald-700">{day.theme}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                    Est. Daily Cost: {day.estimatedDailyCost}
                  </span>
                </div>
              </div>

              {/* Day Logistics / Travel Note */}
              {day.travelNotes && (
                <div className="mb-6 px-4 py-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs font-medium text-amber-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{day.travelNotes}</span>
                </div>
              )}

              {/* Time Slots: Morning, Afternoon, Evening */}
              <div className="space-y-6">
                {/* Morning */}
                {day.morning && day.morning.length > 0 && (
                  <TimeSlotSection 
                    title="Morning" 
                    icon={<Sunrise className="w-4 h-4 text-amber-500" />}
                    activities={day.morning}
                    badgeColor="bg-amber-50 text-amber-800 border-amber-200"
                  />
                )}

                {/* Afternoon */}
                {day.afternoon && day.afternoon.length > 0 && (
                  <TimeSlotSection 
                    title="Afternoon" 
                    icon={<Sun className="w-4 h-4 text-orange-500" />}
                    activities={day.afternoon}
                    badgeColor="bg-orange-50 text-orange-800 border-orange-200"
                  />
                )}

                {/* Evening */}
                {day.evening && day.evening.length > 0 && (
                  <TimeSlotSection 
                    title="Evening" 
                    icon={<Sunset className="w-4 h-4 text-indigo-500" />}
                    activities={day.evening}
                    badgeColor="bg-indigo-50 text-indigo-800 border-indigo-200"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. Smart Extras: Packing, Travel Tips, Important Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Packing Checklist */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Packing Suggestions</h3>
              <p className="text-[11px] text-slate-400">Tailored to season & climate</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            {itinerary.packingSuggestions.map((item, idx) => {
              const isChecked = !!checkedPacking[idx];
              return (
                <li
                  key={idx}
                  onClick={() => togglePackingItem(idx)}
                  className={`flex items-start gap-2 p-2 rounded-xl cursor-pointer transition-colors ${
                    isChecked ? 'bg-slate-50 text-slate-400 line-through' : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="leading-snug">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Local Travel Tips */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Local Travel Tips</h3>
              <p className="text-[11px] text-slate-400">Insider advice & smart navigation</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {itinerary.travelTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="font-bold text-emerald-600 shrink-0">•</span>
                <span className="leading-snug">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Notes / Real-World Reality Checks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Important Notes</h3>
              <p className="text-[11px] text-slate-400">Timings, permits & cautions</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {itinerary.importantNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-rose-50/40 border border-rose-100 text-rose-950">
                <span className="font-bold text-rose-500 shrink-0">!</span>
                <span className="leading-snug">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Morning / Afternoon / Evening activities
interface TimeSlotProps {
  title: string;
  icon: React.ReactNode;
  activities: TripActivity[];
  badgeColor: string;
}

const TimeSlotSection: React.FC<TimeSlotProps> = ({ title, icon, activities, badgeColor }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeColor}`}>
          {icon}
          <span>{title}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5 pl-2 border-l-2 border-slate-100">
        {activities.map((act, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {act.activity}
              </h4>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {act.bestTime && (
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{act.bestTime}</span>
                  </span>
                )}
                {act.estimatedDuration && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-semibold text-[11px]">
                    {act.estimatedDuration}
                  </span>
                )}
                {act.estimatedCost && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    {act.estimatedCost}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2.5">
              {act.description}
            </p>

            {/* Prompt Personalization Justification Badge */}
            {act.reason && (
              <div className="inline-flex items-start gap-1.5 text-xs text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">
                  <strong className="font-semibold text-emerald-950">Why selected:</strong> {act.reason}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
