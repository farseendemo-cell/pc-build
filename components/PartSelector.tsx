import React, { useState, useEffect } from 'react';
import { Part, Category, BuildState } from '../types';
import { PARTS_DATABASE } from '../constants';
import { Info, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { getPartRecommendation } from '../services/geminiService';

interface Props {
  category: Category;
  currentBuild: BuildState;
  onSelect: (part: Part) => void;
  onNext: () => void;
}

export const PartSelector: React.FC<Props> = ({ category, currentBuild, onSelect, onNext }) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  
  // -- Filter Logic --
  let availableParts = PARTS_DATABASE.filter((p) => p.category === category);

  // Compatibility Filters
  if (category === Category.MOBO && currentBuild[Category.CPU]) {
     // Filter Mobo by CPU Socket
     availableParts = availableParts.filter(p => p.socket === currentBuild[Category.CPU]?.socket);
  }
  if (category === Category.CPU && currentBuild[Category.MOBO]) {
     // If user went back to change CPU, filter by Mobo Socket
     availableParts = availableParts.filter(p => p.socket === currentBuild[Category.MOBO]?.socket);
  }
  if (category === Category.RAM && currentBuild[Category.MOBO]) {
      // Filter RAM by Mobo support (DDR4/DDR5)
      availableParts = availableParts.filter(p => p.memoryType === currentBuild[Category.MOBO]?.memoryType);
  }
  if (category === Category.CASE && currentBuild[Category.MOBO]) {
      // Basic form factor check (ATX fits in ATX case, mATX fits in both usually, but strict mapping for simplicity)
      if (currentBuild[Category.MOBO]?.formFactor === 'ATX') {
          availableParts = availableParts.filter(p => p.formFactor === 'ATX');
      }
  }

  const handleAskAi = async () => {
    setLoadingAi(true);
    const advice = await getPartRecommendation(category, currentBuild);
    setRecommendation(advice);
    setLoadingAi(false);
  };

  const handleAmazonLink = (e: React.MouseEvent, partName: string) => {
    e.stopPropagation();
    window.open(`https://www.amazon.in/s?k=${encodeURIComponent(partName)}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2">Select {category}</h2>
           <p className="text-slate-400 text-sm">Choose the best component for your build.</p>
        </div>
        <button 
          onClick={handleAskAi}
          disabled={loadingAi}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loadingAi ? 'Thinking...' : 'AI Suggestions'} <Info className="w-3 h-3" />
        </button>
      </div>

      {recommendation && (
        <div className="mb-6 bg-indigo-900/30 border border-indigo-500/50 p-4 rounded-lg text-sm text-indigo-200 animate-in fade-in slide-in-from-top-2">
            <span className="font-bold block mb-1">Gemini Advisor:</span>
            {recommendation}
        </div>
      )}

      {availableParts.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-xl text-slate-500">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>No compatible parts found based on previous selections.</p>
            <p className="text-xs mt-2">Try changing your {category === Category.MOBO ? 'CPU' : 'Motherboard'}.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-20 custom-scrollbar">
            {availableParts.map((part) => {
                const isSelected = currentBuild[category]?.id === part.id;
                return (
                <div 
                    key={part.id}
                    onClick={() => onSelect(part)}
                    className={`group relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 
                        ${isSelected 
                            ? 'border-indigo-500 bg-indigo-900/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                            : 'border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                >
                    <div className="flex gap-4">
                        <div className="w-24 h-24 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0 relative">
                           <img src={part.image} alt={part.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded uppercase">{part.brand}</span>
                                <div className="flex text-yellow-500 text-xs">{'★'.repeat(Math.floor(part.rating))}</div>
                            </div>
                            <h3 className="font-bold text-slate-100 mt-1 leading-tight">{part.name}</h3>
                            
                            {/* Key Specs Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {part.socket && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{part.socket}</span>}
                                {part.memoryType && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{part.memoryType}</span>}
                                {part.wattage && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{part.wattage}W</span>}
                                {part.storageType && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{part.storageType}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-400">
                             {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(part.price)}
                        </span>
                        <div className="flex gap-2">
                             <button 
                                onClick={(e) => handleAmazonLink(e, part.name)}
                                className="p-2 rounded-full bg-slate-800 hover:bg-yellow-600 hover:text-white text-slate-400 transition-colors"
                                title="View on Amazon"
                             >
                                <ExternalLink className="w-4 h-4" />
                             </button>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'}`}>
                                <Check className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      )}
    </div>
  );
};