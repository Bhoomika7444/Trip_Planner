import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, IndianRupee, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  destination: string;
  isRefining?: boolean;
}

const LOADING_MESSAGES = [
  { text: 'Mapping your adventure...', icon: Compass },
  { text: 'Balancing your budget...', icon: IndianRupee },
  { text: 'Matching your interests...', icon: Heart },
  { text: 'Optimizing geographic routes...', icon: MapPin },
  { text: 'Building your itinerary...', icon: Sparkles },
];

const REFINING_MESSAGES = [
  { text: 'Applying your custom refinements...', icon: Sparkles },
  { text: 'Preserving core constraints...', icon: Compass },
  { text: 'Recalculating pacing & budget...', icon: IndianRupee },
  { text: 'Polishing your updated schedule...', icon: MapPin },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ destination, isRefining }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const messages = isRefining ? REFINING_MESSAGES : LOADING_MESSAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [messages.length]);

  const CurrentIcon = messages[currentIdx].icon;

  return (
    <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
      {/* Animated Orb / Compass */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-1 shadow-xl shadow-emerald-500/25 animate-[spin_8s_linear_infinite]">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <Compass className="w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
        </div>

        {/* Ambient Ring */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full border-2 border-emerald-400 -z-10"
        />
      </div>

      {/* Target Destination Indicator */}
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        {isRefining ? 'Refining Itinerary' : `Designing Your Trip to ${destination || 'Your Destination'}`}
      </h3>

      {/* Rotating Message Container */}
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-2 text-emerald-700 font-semibold text-sm sm:text-base bg-emerald-50/80 border border-emerald-200/80 px-4 py-1.5 rounded-full shadow-xs"
          >
            <CurrentIcon className="w-4 h-4 text-emerald-600" />
            <span>{messages[currentIdx].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 text-xs text-slate-400 max-w-sm">
        Gemini is evaluating real-world geography, travel times, and your specific constraints to prevent generic tourist filler.
      </p>
    </div>
  );
};
