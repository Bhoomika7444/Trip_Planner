import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

interface RefineSectionProps {
  onRefine: (refinementRequest: string) => void;
  isLoading: boolean;
}

const PREDEFINED_REFINEMENTS = [
  { label: 'Make it cheaper', icon: '💸', desc: 'Optimize for low-cost spots & budget transit' },
  { label: 'Make it more relaxed', icon: '🧘', desc: 'Add late mornings & leisurely free time' },
  { label: 'Add more food experiences', icon: '🍲', desc: 'Prioritize street food & authentic local eateries' },
  { label: 'Add more adventure', icon: '🧗', desc: 'Swap quiet spots for treks, water sports or thrills' },
  { label: 'Add more nature', icon: '🌿', desc: 'Include waterfalls, scenic viewpoints & parks' },
  { label: 'Reduce travel time', icon: '⏱️', desc: 'Tighter cluster of nearby destinations' },
  { label: 'Remove shopping', icon: '🚫', desc: 'Focus strictly on sights and dining' },
  { label: 'Add hidden gems', icon: '💎', desc: 'Lesser-known local spots away from tourist crowds' },
];

export const RefineSection: React.FC<RefineSectionProps> = ({ onRefine, isLoading }) => {
  const [customText, setCustomText] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || isLoading) return;
    onRefine(customText.trim());
    setCustomText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-1">
              <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Iterative Prompt Refinement</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Refine My Trip
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Want adjustments? WanderWise sends your existing itinerary back to Gemini with targeted delta constraints.
            </p>
          </div>
        </div>

        {/* Quick Predefined Refinements */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Quick One-Click Refinements:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PREDEFINED_REFINEMENTS.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={isLoading}
                onClick={() => onRefine(item.label)}
                className="p-3 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left transition-all hover:shadow-xs group disabled:opacity-50"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-500 leading-tight">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Refinement Input */}
        <form onSubmit={handleCustomSubmit} className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Or Provide Custom Refinement Instructions:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customText}
              disabled={isLoading}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Swap Day 2 afternoon beach for a heritage spice plantation tour..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm text-slate-900 bg-white placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !customText.trim()}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Apply Refinement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
