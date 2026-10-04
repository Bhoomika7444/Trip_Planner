import React from 'react';
import { Compass, Sparkles, Code2 } from 'lucide-react';

interface NavbarProps {
  onOpenPromptInspector?: () => void;
  onPlanTripClick: () => void;
  hasItinerary: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPromptInspector,
  onPlanTripClick,
  hasItinerary,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div 
          onClick={onPlanTripClick}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                Wander<span className="text-emerald-600">Wise</span>
              </span>
              <span className="hidden xs:inline-block text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                AI
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium -mt-0.5">Constraint-Aware Travel AI</p>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onOpenPromptInspector && (
            <button
              onClick={onOpenPromptInspector}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="View the prompt engineering architecture and live schema"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Prompt Architecture</span>
              <span className="sm:hidden">Prompt</span>
            </button>
          )}

          <button
            onClick={onPlanTripClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-emerald-600 shadow-xs transition-all hover:shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{hasItinerary ? 'New Itinerary' : 'Plan My Trip'}</span>
            <span className="sm:hidden">{hasItinerary ? 'New' : 'Plan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
