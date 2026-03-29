"use client";

import { motion } from "framer-motion";

interface ConnectSensorsViewProps {
  onClose: () => void;
}

export default function ConnectSensorsView({ onClose }: ConnectSensorsViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-[#080b09] flex flex-col font-body"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-transparent">
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#2ECC71]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-[#2ECC71] font-headline">Connect Sensors</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-24 relative">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Abstract Hardware Illustration */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-6">
          {/* Subtle Background Circle Ring */}
          <div className="absolute w-56 h-56 rounded-full border border-white/[0.02] bg-white/[0.01]"></div>
          
          {/* Core Hardware Block */}
          <div className="w-44 h-44 bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-2xl">
            <span 
              className="material-symbols-outlined text-6xl text-[#2ECC71]" 
              style={{ filter: "drop-shadow(0 0 15px rgba(46,204,113,0.5))", fontVariationSettings: "'wght' 500" }}
            >
              sensors
            </span>

            {/* Floating Top Right: Bluetooth */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center z-20 shadow-lg">
              <span className="material-symbols-outlined text-sm text-[#2ECC71]/80">bluetooth</span>
            </div>

            {/* Floating Bottom Left: Signal */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center z-20 shadow-lg">
              <span className="material-symbols-outlined text-lg text-gray-500">signal_cellular_alt</span>
            </div>
          </div>
        </div>

        {/* Informational Text */}
        <h2 className="text-2xl font-extrabold font-headline mt-6 mb-3 text-white text-center">No Sensors Connected</h2>
        <p className="text-center text-on-surface-variant text-sm font-body leading-relaxed mb-12 max-w-xs">
          Link your IoT devices to Kisan Saathi to start receiving real-time data from your fields.
        </p>

        {/* Call to Action Wrapper */}
        <div className="w-full max-w-xs flex flex-col items-center">
          <button className="w-full bg-[#2ECC71] rounded-2xl py-4 flex items-center justify-center gap-3 text-black shadow-[0_0_40px_rgba(46,204,113,0.25)] hover:scale-105 active:scale-95 transition-all outline-none">
            <span className="material-symbols-outlined text-lg font-extrabold" style={{ fontVariationSettings: "'wght' 700" }}>search</span>
            <span className="font-label font-bold text-[11px] uppercase tracking-widest">Search for nearby devices</span>
          </button>
          
          <p className="text-center text-[#555] text-[9px] uppercase tracking-[0.1em] mt-8 max-w-[200px] leading-relaxed font-label font-bold">
            Make sure your bluetooth is on and your sensors are in pairing mode.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
