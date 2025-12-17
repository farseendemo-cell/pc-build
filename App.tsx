import React, { useState, useEffect } from 'react';
import { BuildState, Category, CATEGORY_ORDER, Part } from './types';
import { PartSelector } from './components/PartSelector';
import { BuildVisualizer } from './components/BuildVisualizer';
import { getCompatibilityAdvice } from './services/geminiService';
import { ChevronRight, ChevronLeft, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [build, setBuild] = useState<BuildState>({});
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const currentCategory = CATEGORY_ORDER[currentStepIndex];
  
  const totalPrice = Object.values(build).reduce((sum, part) => sum + (part ? part.price : 0), 0);
  const isComplete = currentStepIndex === CATEGORY_ORDER.length;

  const handleSelectPart = (part: Part) => {
    setBuild(prev => ({ ...prev, [part.category]: part }));
  };

  const nextStep = () => {
    if (currentStepIndex < CATEGORY_ORDER.length) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const resetBuild = () => {
    setBuild({});
    setCurrentStepIndex(0);
    setAiAnalysis(null);
  };

  const runFinalCheck = async () => {
    setAnalyzing(true);
    const result = await getCompatibilityAdvice(build);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  // Run check automatically when reaching summary
  useEffect(() => {
    if (isComplete && !aiAnalysis) {
      runFinalCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">3D Build PC <span className="text-indigo-500">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1 text-sm text-slate-400">
                <span>Step {currentStepIndex + 1} of {CATEGORY_ORDER.length}</span>
             </div>
             <button onClick={resetBuild} className="text-slate-400 hover:text-white transition-colors" title="Reset">
                <RotateCcw className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Left Col: Wizard */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          {/* Progress Bar */}
          <div className="flex gap-1 mb-6">
            {CATEGORY_ORDER.map((cat, idx) => (
              <div 
                key={cat} 
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex ? (build[cat] ? 'bg-indigo-500' : 'bg-slate-700') : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {!isComplete ? (
            <>
              <div className="flex-grow overflow-hidden">
                <PartSelector 
                  category={currentCategory} 
                  currentBuild={build} 
                  onSelect={handleSelectPart}
                  onNext={nextStep}
                />
              </div>

              {/* Navigation Footer */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-950">
                <button 
                  onClick={prevStep} 
                  disabled={currentStepIndex === 0}
                  className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-4">
                  {build[currentCategory] ? (
                    <div className="text-sm text-slate-400 hidden sm:block">
                       Selected: <span className="text-indigo-400">{build[currentCategory]?.name}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-yellow-600 hidden sm:block">Selection required</div>
                  )}
                  
                  <button 
                    onClick={nextStep}
                    disabled={!build[currentCategory]}
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold shadow-lg shadow-indigo-900/20"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Summary View
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" /> Build Summary
                </h2>
                
                {analyzing ? (
                   <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 animate-pulse mb-6">
                      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
                      <div className="h-20 bg-slate-800 rounded mb-2"></div>
                      <p className="text-sm text-slate-400">Verifying compatibility with Gemini AI...</p>
                   </div>
                ) : aiAnalysis ? (
                   <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 mb-6">
                      <h3 className="font-bold text-indigo-400 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> AI Compatibility Report</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis}</p>
                   </div>
                ) : null}

                <div className="space-y-3">
                  {CATEGORY_ORDER.map(cat => {
                    const part = build[cat];
                    if(!part) return null;
                    return (
                      <div key={cat} className="flex justify-between items-center p-4 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-4">
                           <img src={part.image} alt={part.name} className="w-12 h-12 rounded bg-slate-800 object-cover" />
                           <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">{cat}</p>
                              <p className="font-medium text-slate-200">{part.name}</p>
                           </div>
                        </div>
                        <p className="font-mono text-indigo-400">₹{part.price.toLocaleString('en-IN')}</p>
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                   <span className="text-lg text-slate-400">Estimated Total Cost</span>
                   <span className="text-4xl font-bold text-green-400">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  onClick={() => window.print()}
                  className="mt-6 w-full py-4 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Save / Print Build
                </button>
            </div>
          )}
        </div>

        {/* Right Col: Visualizer */}
        <div className="hidden lg:block lg:col-span-5 h-full">
           <BuildVisualizer build={build} totalPrice={totalPrice} />
        </div>
      </main>
    </div>
  );
}