"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ConnectSensorsView from "./ConnectSensorsView";

export default function AnalyticsTab() {
  const [showConnectUI, setShowConnectUI] = useState(false);

  return (
    <main className="pt-24 pb-32 px-5 space-y-8 max-w-lg mx-auto w-full mb-24 animate-in fade-in duration-300">
      
      {/* Connect Sensors Card */}
      <div 
        onClick={() => setShowConnectUI(true)}
        className="bg-[#0b1f15] rounded-[2rem] p-4 flex items-center gap-4 cursor-pointer hover:bg-[#0f2b1d] transition-colors border border-[#18422d]/50 shadow-lg animate-sensor-glow"
      >
        <div className="w-16 h-16 rounded-[1.25rem] bg-[#143625] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#2ECC71] text-3xl">sensors</span>
        </div>
        <div className="flex-1 pr-2">
          <h3 className="text-white font-bold font-headline text-[1.15rem] tracking-tight">Connect Sensors</h3>
          <p className="text-[#a1a1a1] text-sm font-body mt-0.5 leading-tight">Pair IoT devices to<br/>see live feed</p>
        </div>
        <div className="pr-3">
          <span className="material-symbols-outlined text-[#2ECC71]" style={{ fontVariationSettings: "'wght' 600" }}>chevron_right</span>
        </div>
      </div>
      {/* Yield Forecast Hero Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Production Forecast</span>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white mt-1">Yield Forecast</h2>
          </div>
          <div className="text-right">
            <span className="font-label text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-md">+12.4%</span>
            <p className="text-[10px] text-on-surface-variant font-label uppercase mt-2">vs Last Season</p>
          </div>
        </div>
        
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden aspect-[4/3] flex flex-col justify-end border border-white/5">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="w-full h-full object-cover mix-blend-overlay" 
              alt="Background texture" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYzWe7MjnaH_ea8XSs7dTGVgavZAefPOjchNDriA9rruLMlFfIrAWfoqDvtRcT06VRxLrz09nIXrd34QKrDrSafyTALv8w4WuFkwROkQg_ihrLhHgmN0vWMrAgxVZfEpEqux6-UYTpdBUo4yjmy1pPrT-WPejU32bATLHraGFeS4Q2RpUEQnmR4ENlo8zh19qB-oxBB46vbc8YgOep82U_xDrd3WYOdUGgFgjVbtvPsA12dCZM44frMCGdRD3fmBDT4mXvCZ7LX3oS" 
            />
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="absolute inset-x-0 top-12 bottom-20 px-4">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.5"></stop>
                  <stop offset="100%" stopColor="#2ECC71" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              {/* Projected Yield (Neon Green) */}
              <path className="drop-shadow-[0_0_8px_rgba(46,204,113,0.6)]" d="M0 160 Q 50 140, 100 120 T 200 80 T 300 40 T 400 20" fill="none" stroke="#2ECC71" strokeLinecap="round" strokeWidth="4"></path>
              <path d="M0 160 Q 50 140, 100 120 T 200 80 T 300 40 T 400 20 V 200 H 0 Z" fill="url(#lineGrad)"></path>
              {/* Current Season (Dashed) */}
              <path d="M0 165 Q 50 155, 100 145 T 200 130 T 300 115 T 400 110" fill="none" stroke="#777575" strokeDasharray="8,8" strokeWidth="2"></path>
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
            <div>
              <p className="font-label text-[10px] uppercase text-on-surface-variant mb-1">Projected Yield</p>
              <p className="font-label text-2xl font-bold text-primary text-glow">84.2<span className="text-xs ml-1 text-primary/80">Tons</span></p>
            </div>
            <div className="text-right">
              <p className="font-label text-[10px] uppercase text-on-surface-variant mb-1">Confidence</p>
              <p className="font-label text-2xl font-bold text-white">94<span className="text-xs ml-1 text-on-surface-variant">%</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Efficiency Gauges */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-bold text-white">Resource Efficiency</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Water Usage */}
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center space-y-3 border border-white/5 hover:border-primary/20 transition-colors cursor-pointer">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                <circle className="stroke-primary drop-shadow-[0_0_4px_#2ECC71]" cx="18" cy="18" fill="none" r="16" strokeDasharray="65, 100" strokeLinecap="round" strokeWidth="3"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-label text-sm font-bold text-white">65%</span>
              </div>
            </div>
            <div>
              <p className="font-headline text-sm font-semibold text-white">Water Usage</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Efficiency</p>
            </div>
          </div>
          
          {/* Fertilizer Optimization */}
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center space-y-3 border border-white/5 hover:border-tertiary/20 transition-colors cursor-pointer">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-surface-container-highest" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                <circle className="stroke-tertiary drop-shadow-[0_0_4px_#7ee6ff]" cx="18" cy="18" fill="none" r="16" strokeDasharray="82, 100" strokeLinecap="round" strokeWidth="3"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-label text-sm font-bold text-white">82%</span>
              </div>
            </div>
            <div>
              <p className="font-headline text-sm font-semibold text-white">Fertilizer</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Anomalies Alerts */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-lg font-bold text-white">Data Anomalies</h3>
          <span className="bg-error-container/20 border border-error/20 text-error text-[10px] font-label px-2 py-0.5 rounded-full uppercase font-bold">2 Active</span>
        </div>
        
        <div className="space-y-3">
          <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-l-4 border-error/80 shadow-lg cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error">warning</span>
            </div>
            <div className="flex-1">
              <p className="font-headline text-sm font-bold text-white">Soil pH Spike in Sector B4</p>
              <p className="text-xs text-on-surface-variant mt-0.5 font-body">Detected 12m ago • 7.4 pH (+1.2)</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </div>
          
          <div className="glass-card rounded-xl p-4 flex items-center gap-4 border-l-4 border-primary/80 shadow-lg cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">humidity_mid</span>
            </div>
            <div className="flex-1">
              <p className="font-headline text-sm font-bold text-white">Micro-Climate Shift</p>
              <p className="text-xs text-on-surface-variant mt-0.5 font-body">Sector A2 humidity dropped &lt; 40%</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Historical Comparisons Segmented Bar Graph */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-bold text-white">Growth Comparison</h3>
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <div className="flex justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20"></div>
              <span className="font-label text-[10px] uppercase text-on-surface-variant font-bold">This Month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-surface-container-highest ring-2 ring-white/5"></div>
              <span className="font-label text-[10px] uppercase text-on-surface-variant font-bold">Last Year</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Week 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant uppercase font-bold">
                <span>Week 01</span>
                <span className="text-primary">+15%</span>
              </div>
              <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex gap-1">
                <div className="h-full bg-primary/90 rounded-full" style={{ width: '75%' }}></div>
                <div className="h-full bg-surface-container-highest rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            {/* Week 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant uppercase font-bold">
                <span>Week 02</span>
                <span className="text-primary">+22%</span>
              </div>
              <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex gap-1">
                <div className="h-full bg-primary/90 rounded-full" style={{ width: '85%' }}></div>
                <div className="h-full bg-surface-container-highest rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            
            {/* Week 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-label text-on-surface-variant uppercase font-bold">
                <span>Week 03</span>
                <span className="text-error-dim">-5%</span>
              </div>
              <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex gap-1">
                <div className="h-full bg-primary/90 rounded-full" style={{ width: '60%' }}></div>
                <div className="h-full bg-surface-container-highest rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showConnectUI && <ConnectSensorsView onClose={() => setShowConnectUI(false)} />}
      </AnimatePresence>
    </main>
  );
}
