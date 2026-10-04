import React from 'react';
import { Compass, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onPlanTripClick: () => void;
  onSelectPreset?: (presetName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlanTripClick, onSelectPreset }) => {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-10 sm:py-16">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 -z-10 pointer-events-none opacity-35">
        <div className="absolute top-4 left-1/4 w-72 h-72 bg-emerald-300 rounded-full blur-3xl mix-blend-multiply filter" />
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-teal-200 rounded-full blur-3xl mix-blend-multiply filter" />
        <div className="absolute -top-6 left-1/2 w-80 h-72 bg-amber-100 rounded-full blur-3xl mix-blend-multiply filter" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]"
        >
          Your next adventure,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700">
            planned by AI.
          </span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal leading-relaxed px-2"
        >
          Tell us how you want to travel. WanderWise turns your preferences into a personalized itinerary.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto"
        >
          <button
            onClick={onPlanTripClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {onSelectPreset && (
            <button
              onClick={() => onSelectPreset('Goa')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Try an Example (Goa, 3 Days)</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt for mobile discovery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={onPlanTripClick}
        className="mt-auto pt-6 flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
      >
        <span className="text-[11px] font-semibold tracking-wider uppercase">Scroll to customize</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
};
