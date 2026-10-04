import React, { useState } from 'react';
import { X, Copy, Check, Code2, BookOpen, Cpu, ShieldAlert } from 'lucide-react';
import { SYSTEM_INSTRUCTION } from '../utils/prompts';

interface PromptInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  debugPrompt?: {
    systemInstruction: string;
    userPrompt: string;
    modelName: string;
  } | null;
  lastUserPrompt?: string;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  isOpen,
  onClose,
  debugPrompt,
  lastUserPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'system' | 'engineering'>('prompt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSystemInstruction = debugPrompt?.systemInstruction || SYSTEM_INSTRUCTION;
  const currentUserPrompt = debugPrompt?.userPrompt || lastUserPrompt || '(Generate an itinerary to view the live prompt payload)';

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Prompt Engineering Architecture
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {debugPrompt?.modelName || 'gemini-3.8-flash'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Live prompt payload & system instructions sent to Gemini</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Constructed User Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>System Instruction & Boundaries</span>
          </button>

          <button
            onClick={() => setActiveTab('engineering')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'engineering'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Prompt Strategy (Viva / Evaluation)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-sm">
          {activeTab === 'prompt' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Raw Injected User Prompt Payload
                </span>
                <button
                  onClick={() => handleCopy(currentUserPrompt)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500/30">
                {currentUserPrompt}
              </pre>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  System Persona & Guardrail Directives
                </span>
                <button
                  onClick={() => handleCopy(currentSystemInstruction)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {currentSystemInstruction}
              </pre>
            </div>
          )}

          {activeTab === 'engineering' && (
            <div className="space-y-4 text-slate-700 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-sm mb-1">
                  1. Role Prompting & Authority
                </h4>
                <p className="text-emerald-900 text-xs leading-relaxed">
                  Defines Gemini as an expert travel planner and logistics strategist rather than a generic text generator. Establishes core rules of realistic geography, budget discipline, and no hallucinated certainty.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200">
                <h4 className="font-bold text-teal-950 text-sm mb-1">
                  2. Constraint Engineering & Pacing Calibration
                </h4>
                <p className="text-teal-900 text-xs leading-relaxed">
                  Explicit rules prevent unrealistic schedules. If the traveler selects <strong>Relaxed</strong>, the prompt explicitly limits activities to 1-2 per day with leisurely mornings. If <strong>Packed</strong>, it groups activities geographically to avoid fatigue.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm mb-1">
                  3. Handling Impossible Constraints Gracefully
                </h4>
                <p className="text-amber-900 text-xs leading-relaxed">
                  When a user inputs a very low budget for an expensive spot, WanderWise instructs Gemini to provide the best possible budget-conscious plan, actively warn the user in the budget notes, and suggest money-saving alternatives rather than pretending the budget is sufficient.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                <h4 className="font-bold text-indigo-950 text-sm mb-1">
                  4. Structured Output Contract
                </h4>
                <p className="text-indigo-900 text-xs leading-relaxed">
                  Instead of uncontrolled freeform markdown, Gemini is locked into a strict JSON Schema using <code>responseMimeType: &quot;application/json&quot;</code> and <code>responseSchema</code>. This guarantees exact typed fields for daily morning/afternoon/evening slots and budget categories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200">
                <h4 className="font-bold text-purple-950 text-sm mb-1">
                  5. Contextual Delta Prompting (Refinement)
                </h4>
                <p className="text-purple-900 text-xs leading-relaxed">
                  When refining (e.g. &quot;Make it cheaper&quot;), the prompt passes the original user profile + existing generated JSON itinerary + the refinement delta. Gemini is instructed to preserve intact schedule portions while modifying only the targeted dimension.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Designed for evaluation and transparent GenAI demonstration.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
