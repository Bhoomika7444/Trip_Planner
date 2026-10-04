import React from 'react';
import { Compass, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPromptInspector: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPromptInspector }) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900">
              Wander<span className="text-emerald-600">Wise</span>
            </span>
            <p className="text-[11px] text-slate-400">College GenAI Mini-Project • Prompt Engineering Demonstration</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
          <button
            onClick={onOpenPromptInspector}
            className="hover:text-emerald-600 transition-colors"
          >
            Prompt Engineering Architecture
          </button>
          <span>•</span>
          <span>Google Gemini API</span>
          <span>•</span>
          <span>Structured Output JSON</span>
          <span>•</span>
          <span>Vite + React + Express</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>for practical GenAI travel planning</span>
        </div>
      </div>
    </footer>
  );
};
