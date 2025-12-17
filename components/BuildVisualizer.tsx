import React, { useState, useRef, useEffect } from 'react';
import { BuildState, Category } from '../types';
import { Box, Zap, Move, Palette, Cpu, Fan, Monitor, Disc, Grid, Layers, Wind } from 'lucide-react';

interface Props {
  build: BuildState;
  totalPrice: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const BuildVisualizer: React.FC<Props> = ({ build, totalPrice }) => {
  const [rotation, setRotation] = useState({ x: -5, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [rgbColor, setRgbColor] = useState('#818cf8'); // Indigo-400
  const [rgbMode, setRgbMode] = useState<'static' | 'breathing' | 'rainbow'>('rainbow');
  const [viewMode, setViewMode] = useState<'shaded' | 'wireframe'>('shaded');
  const [turboMode, setTurboMode] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);

  const has = (cat: Category) => !!build[cat];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    hasDragged.current = true;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCaseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only toggle if it wasn't a drag operation and case exists
    if (!hasDragged.current && has(Category.CASE)) {
      setTurboMode(prev => !prev);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // RGB Styles
  const getGlowStyle = (intensity = 0.5) => {
    if (viewMode === 'wireframe') return {}; // No glow in wireframe
    
    if (rgbMode === 'rainbow') {
      return {
        animation: 'rainbow-glow 4s linear infinite',
        boxShadow: `0 0 ${20 * intensity}px ${5 * intensity}px rgba(255,255,255,0.2)`
      };
    }
    const color = rgbColor;
    return {
      boxShadow: `0 0 ${20 * intensity}px ${5 * intensity}px ${color}`,
      borderColor: color,
      backgroundColor: rgbMode === 'breathing' ? undefined : undefined
    };
  };

  // Helper for dynamic fan styling
  const getFanClass = (isFront: boolean) => {
    const size = isFront ? "w-16 h-16" : "w-12 h-12";
    if (turboMode) {
        // Fast, blurry, and cyan for "Cooling" effect
        return `${size} text-cyan-400 animate-[fan-spin_0.1s_linear_infinite] blur-[0.5px] transition-all duration-300`;
    }
    // Standard visual
    return `${size} ${isFront ? 'text-slate-500/50 animate-[fan-spin_2s_linear_infinite]' : 'text-slate-600 animate-[fan-spin_4s_linear_infinite]'} transition-all duration-300`;
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl flex flex-col h-full overflow-hidden">
       <style>{`
        @keyframes rainbow-glow {
          0% { box-shadow: 0 0 15px 2px #ff0000; border-color: #ff0000; }
          20% { box-shadow: 0 0 15px 2px #ffff00; border-color: #ffff00; }
          40% { box-shadow: 0 0 15px 2px #00ff00; border-color: #00ff00; }
          60% { box-shadow: 0 0 15px 2px #00ffff; border-color: #00ffff; }
          80% { box-shadow: 0 0 15px 2px #0000ff; border-color: #0000ff; }
          100% { box-shadow: 0 0 15px 2px #ff00ff; border-color: #ff00ff; }
        }
        @keyframes fan-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .preserve-3d { transform-style: preserve-3d; }
        
        /* Wireframe Mode Styles */
        .wireframe-mode .preserve-3d,
        .wireframe-mode .preserve-3d div {
           background-color: rgba(15, 23, 42, 0.2) !important;
           background-image: none !important;
           border: 1px solid rgba(56, 189, 248, 0.6) !important; /* Sky Blue 400 */
           box-shadow: none !important;
           color: rgba(56, 189, 248, 0.9) !important;
           backface-visibility: visible !important;
        }
        .wireframe-mode svg {
           color: rgba(56, 189, 248, 1) !important;
           filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.8));
        }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex justify-between items-center border-b border-slate-700 pb-4 z-10 relative bg-slate-900/80 backdrop-blur">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
           <Box className="w-5 h-5 text-indigo-400" /> 3D Assembly
        </h2>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
          <p className="text-xl font-bold text-green-400">{formatCurrency(totalPrice)}</p>
        </div>
      </div>

      {/* 3D Viewport */}
      <div 
        ref={containerRef}
        className="flex-grow relative cursor-move bg-slate-950 rounded-lg border border-slate-800 overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div className="absolute top-4 left-4 z-10 pointer-events-none select-none flex flex-col gap-2">
           <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded backdrop-blur border border-slate-700">
             <Move className="w-3 h-3" /> Drag to rotate
           </div>
           
           {/* Turbo Mode Indicator */}
           {turboMode && (
             <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-1 rounded backdrop-blur animate-in slide-in-from-left-2 fade-in duration-300">
               <Wind className="w-3 h-3 animate-pulse" /> TURBO COOLING
             </div>
           )}
        </div>

        <div className={`w-full h-full flex items-center justify-center perspective-[1500px] ${viewMode === 'wireframe' ? 'wireframe-mode' : ''}`}>
           {/* MAIN CASE CONTAINER */}
           {/* Width 288px (w-72), Height 384px (h-96), Depth 120px (assumed) */}
           <div 
             className="relative w-72 h-96 preserve-3d transition-transform duration-75 ease-out"
             style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
           >
              
              {/* --- 1. BACK FACE (Motherboard Tray & Right Side Panel) --- */}
              {/* Z = -60px */}
              <div className="absolute inset-0 bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-xl backface-hidden" style={{ transform: 'translateZ(-60px)' }}>
                 
                 {/* Motherboard PCB */}
                 {has(Category.MOBO) ? (
                   <div className="w-[90%] h-[85%] bg-slate-900 border border-slate-600 relative preserve-3d shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      {/* PCB Texture */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#475569_1px,_transparent_1px)]" style={{ backgroundSize: '8px 8px' }}></div>
                      
                      {/* --- COMPONENT: VRM Heatsinks --- */}
                      {/* Top Block */}
                      <div className="absolute top-6 left-8 w-24 h-6 bg-slate-400 border-b-2 border-slate-500 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
                         <div className="absolute inset-0 bg-gradient-to-b from-slate-300 to-slate-500"></div>
                         {/* Fins */}
                         <div className="absolute top-0 left-0 h-full w-full flex justify-between px-1">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-full bg-slate-600/20"></div>)}
                         </div>
                      </div>
                      {/* Left Block */}
                      <div className="absolute top-6 left-2 w-6 h-20 bg-slate-400 border-r-2 border-slate-500 preserve-3d" style={{ transform: 'translateZ(10px)' }}>
                         <div className="absolute inset-0 bg-gradient-to-r from-slate-300 to-slate-500"></div>
                      </div>

                      {/* --- COMPONENT: CPU Socket --- */}
                      <div className="absolute top-12 left-12 w-20 h-20 bg-slate-800 border border-slate-500 flex items-center justify-center preserve-3d shadow-inner">
                         {/* Socket Pin Texture */}
                         <div className="w-16 h-16 bg-slate-200 opacity-10 grid grid-cols-4 grid-rows-4 gap-px">
                            {[...Array(16)].map((_,i) => <div key={i} className="bg-slate-900 rounded-full"></div>)}
                         </div>
                         
                         {/* CPU Installed */}
                         {has(Category.CPU) && (
                            <div className="absolute inset-1 bg-slate-300 shadow-sm flex items-center justify-center border border-slate-400" style={{ transform: 'translateZ(2px)' }}>
                               <div className="w-14 h-14 border border-slate-400/50 flex items-center justify-center">
                                  <Cpu className="w-8 h-8 text-slate-600" />
                                  <span className="absolute bottom-1 text-[6px] font-bold text-slate-500">{build[Category.CPU]?.brand}</span>
                               </div>
                            </div>
                         )}

                         {/* Cooler Installed */}
                         {has(Category.COOLER) && (
                            <div className="absolute w-24 h-24 bg-slate-800/90 border border-slate-600 rounded-lg flex items-center justify-center shadow-xl" 
                                 style={{ transform: 'translateZ(30px)', ...getGlowStyle(0.6) }}>
                               <Fan className="w-20 h-20 text-slate-400 animate-[fan-spin_1s_linear_infinite]" />
                               {/* Heatsink Body */}
                               <div className="absolute inset-0 border-4 border-slate-700 bg-slate-800 rounded-lg -z-10" style={{ transform: 'translateZ(-15px)' }}></div>
                               {/* Logo */}
                               <div className="absolute z-10 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full bg-indigo-500/50 animate-pulse"></div>
                               </div>
                            </div>
                         )}
                      </div>

                      {/* --- COMPONENT: RAM Slots --- */}
                      <div className="absolute top-12 right-6 flex gap-1.5 preserve-3d" style={{ transform: 'translateZ(2px)' }}>
                         {[1,2,3,4].map(i => (
                            <div key={i} className="w-2 h-24 bg-slate-800 border border-slate-600 relative flex flex-col justify-between py-1">
                               {/* Clips */}
                               <div className="w-full h-1 bg-slate-500"></div>
                               <div className="w-full h-1 bg-slate-500"></div>
                               
                               {/* Stick Installed */}
                               {has(Category.RAM) && (
                                  <div className="absolute inset-0 border-x border-slate-500" 
                                       style={{ 
                                          transform: 'translateZ(6px)', 
                                          background: rgbMode === 'rainbow' ? 'linear-gradient(to top, #1a1a1a, #444)' : `linear-gradient(to top, #1a1a1a, ${rgbColor})`,
                                       }}>
                                      {/* RGB Bar Top */}
                                      <div className="absolute top-0 left-0 w-full h-full opacity-80 mix-blend-screen" style={getGlowStyle(0.8)}></div>
                                      {/* Heatsink Lines */}
                                      <div className="absolute inset-0 flex flex-col gap-1 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#000_2px,#000_3px)]"></div>
                                  </div>
                               )}
                            </div>
                         ))}
                      </div>

                      {/* --- COMPONENT: Chipset Heatsink --- */}
                      <div className="absolute bottom-20 right-8 w-16 h-12 bg-slate-700 border border-slate-600 preserve-3d flex items-center justify-center" style={{ transform: 'translateZ(8px)' }}>
                          <span className="text-[8px] font-bold text-slate-400 rotate-90">{build[Category.MOBO]?.brand || 'CHIPSET'}</span>
                      </div>

                      {/* --- COMPONENT: CMOS Battery --- */}
                      <div className="absolute bottom-36 right-20 w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 border border-slate-500 shadow-sm flex items-center justify-center">
                         <div className="text-[4px] text-slate-600 font-bold">CR2032</div>
                      </div>

                      {/* --- COMPONENT: PCIe Slots --- */}
                      <div className="absolute top-44 left-6 right-6 flex flex-col gap-4">
                          {/* x16 Slot (Main) */}
                          <div className="h-3 bg-slate-800 border-y border-slate-500 flex items-center">
                             <div className="w-full h-1 bg-black mx-1"></div>
                          </div>
                          {/* x1 Slot */}
                          <div className="w-12 h-2 bg-slate-800 border border-slate-600 ml-1"></div>
                          {/* x16 Slot (Secondary) */}
                          <div className="h-3 bg-slate-800 border-y border-slate-600 flex items-center mt-4">
                             <div className="w-full h-1 bg-black mx-1"></div>
                          </div>
                      </div>

                      {/* --- COMPONENT: GPU --- */}
                      {has(Category.GPU) && (
                          <div className="absolute top-44 left-4 preserve-3d z-20" style={{ transform: 'translateZ(10px)' }}>
                             
                             {/* 1. BACKPLATE (Top Surface) */}
                             <div className="w-64 h-14 bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-lg backface-hidden relative overflow-hidden"
                                  style={{ transform: 'rotateX(-90deg) translateZ(0px)', transformOrigin: 'top left' }}>
                                {/* Texture - Brushed Metal */}
                                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]"></div>
                                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_4px)]"></div>
                                
                                {/* Screws */}
                                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-slate-400 rounded-full shadow-sm"></div>
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-400 rounded-full shadow-sm"></div>
                                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-slate-400 rounded-full shadow-sm"></div>
                                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-slate-400 rounded-full shadow-sm"></div>

                                {/* GPU Core Cutout Area */}
                                <div className="w-10 h-10 border border-slate-600 bg-slate-900 rounded flex items-center justify-center relative z-10 shadow-inner">
                                    <div className="w-8 h-8 border border-slate-600 rotate-45"></div>
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[5px] text-slate-500 font-bold tracking-[0.2em] rotate-180">
                                   PERFORMANCE
                                </div>
                             </div>

                             {/* 2. SIDE PROFILE (Attached to Backplate Edge) */}
                             <div className="absolute bottom-0 left-0 w-full h-4 bg-slate-800 border-x border-b border-slate-600 flex items-center pl-4 shadow-lg backface-hidden"
                                  style={{ transformOrigin: 'bottom', transform: 'rotateX(90deg)' }}>
                                   <span className="text-[6px] font-bold text-white tracking-[0.2em] drop-shadow-md">GEFORCE RTX</span>
                                   <div className="ml-auto mr-2 h-1 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-80" style={getGlowStyle(0.8)}></div>
                             </div>

                             {/* 3. FAN SHROUD (Bottom Surface) */}
                             <div className="absolute top-0 left-0 w-64 h-14 bg-gradient-to-r from-slate-800 to-slate-700 border-2 border-slate-600 rounded-r-lg flex items-center justify-end gap-6 pr-4 shadow-xl"
                                  style={{ transform: 'rotateX(-90deg) translateZ(16px)', transformOrigin: 'top left' }}>
                                {/* Fans */}
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 border border-slate-600 rounded-full flex items-center justify-center bg-slate-900">
                                        <Fan className="w-8 h-8 text-slate-500 animate-[fan-spin_0.5s_linear_infinite]" />
                                    </div>
                                ))}
                                {/* RGB Strip */}
                                <div className="absolute bottom-0 left-0 w-full h-1" style={getGlowStyle(1)}></div>
                             </div>

                          </div>
                      )}
                      
                      {/* --- COMPONENT: NVMe --- */}
                      <div className="absolute bottom-24 left-16 w-20 h-6 border border-slate-600 bg-slate-800 flex items-center justify-center">
                         {has(Category.STORAGE) && build[Category.STORAGE]?.storageType === 'NVMe' && (
                            <div className="w-[94%] h-[80%] bg-slate-900 border border-green-700 relative overflow-hidden flex items-center">
                                <div className="ml-1 w-2 h-3 bg-green-600/50"></div>
                                <div className="ml-1 w-2 h-3 bg-black border border-slate-500"></div>
                                <span className="text-[4px] text-slate-400 ml-2">NVMe M.2</span>
                            </div>
                         )}
                         {!has(Category.STORAGE) && <span className="text-[5px] text-slate-600">M.2_1</span>}
                      </div>

                   </div>
                 ) : (
                    <div className="text-slate-600 text-xs font-mono rotate-90">MOTHERBOARD TRAY</div>
                 )}
              </div>

              {/* --- 2. FRONT FACE (Glass Panel) --- */}
              {/* Z = 60px */}
              {has(Category.CASE) && (
                <div className={`absolute inset-0 border-[6px] border-slate-800 bg-indigo-500/5 shadow-[0_0_30px_rgba(0,0,0,0.1)] flex flex-col justify-between p-2 ${has(Category.CASE) ? 'cursor-pointer hover:border-indigo-500/50 transition-colors' : ''} backdrop-blur-[1px]`} 
                     style={{ transform: 'translateZ(60px)' }}
                     onClick={handleCaseClick}
                     title="Click case to toggle Turbo Fans"
                >
                   
                   {/* Reflection Gradient - Main Glare */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent pointer-events-none opacity-40 mix-blend-overlay"></div>
                   
                   {/* Reflection Gradient - Sharp Streak */}
                   <div className="absolute -inset-[100%] bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] pointer-events-none animate-pulse opacity-30"></div>

                   {/* Corner Screws */}
                   <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-300 border border-slate-500 shadow-sm opacity-90"></div>
                   <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-300 border border-slate-500 shadow-sm opacity-90"></div>
                   <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-300 border border-slate-500 shadow-sm opacity-90"></div>
                   <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-300 border border-slate-500 shadow-sm opacity-90"></div>

                   <div className="absolute bottom-10 right-0 text-[8px] text-slate-400/50 font-mono rotate-180 writing-mode-vertical tracking-widest drop-shadow-md">TEMPERED GLASS</div>
                </div>
              )}

              {/* --- 3. LEFT FACE (Rear of Case - IO / PCIe) --- */}
              {/* Width 120px, Height 384px (h-96) */}
              <div className="absolute bg-slate-900 border-r border-slate-800" 
                   style={{ 
                       transform: 'rotateY(-90deg) translateZ(60px)', 
                       width: '120px', 
                       height: '384px',
                       left: 0
                   }}>
                   
                   {/* IO Shield Cutout */}
                   <div className="absolute top-12 left-4 w-10 h-32 bg-slate-400/20 border-2 border-slate-500 flex flex-col gap-1 p-1">
                      {/* Fake ports */}
                      <div className="w-3 h-3 bg-slate-800 rounded-full border border-slate-600"></div>
                      <div className="w-3 h-3 bg-slate-800 rounded-full border border-slate-600"></div>
                      <div className="w-6 h-4 bg-blue-900/50 border border-slate-600 mt-2"></div>
                      <div className="w-6 h-4 bg-red-900/50 border border-slate-600"></div>
                   </div>

                   {/* Rear Fan Mesh */}
                   <div className="absolute top-6 right-4 w-16 h-16 border border-slate-700 bg-[radial-gradient(circle,_#333_1px,_transparent_1px)] bg-[length:4px_4px] flex items-center justify-center">
                       {/* Exhaust Fan */}
                       <Fan className={getFanClass(false)} />
                   </div>

                   {/* Expansion Slots (Vented) */}
                   <div className="absolute top-48 left-4 w-20 flex flex-col gap-2">
                       {[1,2,3,4,5,6,7].map(i => (
                           <div key={i} className="w-full h-3 bg-slate-800 border border-slate-600 flex items-center px-1">
                               {/* Vents */}
                               <div className="w-full h-[1px] bg-slate-950"></div>
                           </div>
                       ))}
                   </div>
                   
                   {/* PSU Rear */}
                   <div className="absolute bottom-4 left-4 w-20 h-16 border-2 border-slate-600 bg-slate-800 flex items-col justify-center items-center">
                       <div className="w-12 h-8 border border-slate-500 mb-1 flex items-center justify-center">
                           <div className="w-3 h-2 bg-black"></div>
                       </div>
                       <div className="w-2 h-2 bg-red-600 rounded-sm absolute top-2 right-2"></div>
                   </div>
              </div>

              {/* --- 4. RIGHT FACE (Front of Case - Fans) --- */}
              {/* Width 120px, Height 384px */}
              <div 
                   className={`absolute bg-slate-900 border-l border-slate-800 flex flex-col items-center py-6 gap-6 overflow-hidden ${has(Category.CASE) ? 'cursor-pointer' : ''}`}
                   style={{ 
                       transform: 'rotateY(90deg) translateZ(228px)', // 288 (width) - 60 (Z offset) = 228
                       width: '120px', 
                       height: '384px',
                       right: 0
                   }}
                   onClick={handleCaseClick}
              >
                   
                   {/* Front Mesh Pattern */}
                   <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,_#1e293b_25%,_transparent_25%,_transparent_50%,_#1e293b_50%,_#1e293b_75%,_transparent_75%,_transparent)] bg-[length:4px_4px]"></div>

                   {[1,2,3].map(i => (
                      <div key={i} className="w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative shadow-lg">
                         <Fan className={getFanClass(true)} />
                         {/* RGB Ring */}
                         <div className="absolute inset-0 rounded-full border-4 border-transparent opacity-60 mix-blend-screen" style={getGlowStyle(0.6)}></div>
                      </div>
                   ))}

                   {/* Front Panel Connector Cables (Internal view) */}
                   <div className="absolute top-0 left-0 bottom-0 w-4 bg-black/50 border-r border-slate-800 z-10"></div>
              </div>

              {/* --- 5. TOP FACE --- */}
              {/* Width 288px, Depth 120px */}
              <div className="absolute bg-slate-800 border-2 border-slate-700/50 flex items-center justify-center gap-8" 
                   style={{ 
                       transform: 'rotateX(90deg) translateZ(60px)', 
                       width: '288px', 
                       height: '120px',
                       top: 0
                   }}>
                 {/* Top Vents */}
                 <div className="w-20 h-20 border border-slate-600 rounded-full opacity-30 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:3px_3px]"></div>
                 <div className="w-20 h-20 border border-slate-600 rounded-full opacity-30 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:3px_3px]"></div>
                 
                 {/* Top IO */}
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                     <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                     <div className="w-4 h-4 rounded-full border border-slate-400"></div>
                 </div>
              </div>
              
              {/* --- 6. BOTTOM FACE (PSU Shroud / Feet) --- */}
              <div className="absolute bg-slate-900 border-2 border-slate-700" 
                   style={{ 
                       transform: 'rotateX(-90deg) translateZ(324px)', // 384 (height) - 60 = 324
                       width: '288px', 
                       height: '120px',
                       bottom: 0
                   }}>
                 {has(Category.PSU) && (
                    <div className="relative left-4 top-4 w-40 h-[90px] bg-slate-800 border border-slate-600 flex items-center justify-center gap-2 shadow-lg">
                       <Zap className="w-5 h-5 text-yellow-500" />
                       <div className="flex flex-col">
                           <span className="text-[10px] text-slate-300 font-bold uppercase">{build[Category.PSU]?.brand}</span>
                           <span className="text-[12px] text-yellow-500 font-bold">{build[Category.PSU]?.wattage}W</span>
                       </div>
                       {/* Fan Grill for PSU */}
                       <div className="absolute inset-0 bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:3px_3px] opacity-20"></div>
                    </div>
                 )}
                 {/* Case Feet */}
                 <div className="absolute -bottom-2 left-4 w-8 h-2 bg-slate-800"></div>
                 <div className="absolute -bottom-2 right-4 w-8 h-2 bg-slate-800"></div>
              </div>

           </div>
        </div>
      </div>

      {/* Monitor Preview (if selected) */}
      {has(Category.MONITOR) && (
         <div className="absolute bottom-20 right-6 w-32 opacity-90 pointer-events-none transition-all duration-500">
             <div className="relative">
                <Monitor className="w-full h-full text-slate-700 drop-shadow-lg" />
                {/* Screen Glow */}
                <div className="absolute inset-x-1 top-1 bottom-3 bg-indigo-500/20 animate-pulse rounded-sm overflow-hidden flex items-center justify-center">
                    <span className="text-[8px] text-indigo-300 font-mono">NO SIGNAL</span>
                </div>
             </div>
         </div>
      )}

      {/* Controls Footer */}
      <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col xl:flex-row items-center justify-between gap-4">
         
         {/* View Mode Toggle */}
         <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">View Mode</span>
            </div>
            <div className="flex bg-slate-900 rounded-md border border-slate-800 p-1">
               <button 
                  onClick={() => setViewMode('shaded')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'shaded' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
               >
                   <Box className="w-3 h-3" /> Shaded
               </button>
               <button 
                  onClick={() => setViewMode('wireframe')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'wireframe' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
               >
                   <Grid className="w-3 h-3" /> Wireframe
               </button>
            </div>
         </div>

         <div className="h-px w-full xl:h-6 xl:w-px bg-slate-800"></div>

         {/* RGB Controls */}
         <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
            <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-300">RGB Controller</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                onClick={() => setRgbMode('rainbow')}
                className={`w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 border-2 shadow-lg transition-all ${rgbMode === 'rainbow' ? 'border-white scale-110' : 'border-transparent opacity-70'}`}
                title="Rainbow Mode"
                />
                <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
                <div className="flex gap-2">
                    {['#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ffffff'].map(c => (
                    <button
                        key={c}
                        onClick={() => { setRgbColor(c); setRgbMode('static'); }}
                        className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${rgbColor === c && rgbMode !== 'rainbow' ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-transparent opacity-70'}`}
                        style={{ backgroundColor: c, color: c }}
                    />
                    ))}
                </div>
            </div>
         </div>
      </div>
      
    </div>
  );
};
