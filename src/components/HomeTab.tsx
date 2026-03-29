"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ConnectSensorsView from "./ConnectSensorsView";
import { SavedScan } from "@/utils/storage";

interface HomeTabProps {
  savedScans?: SavedScan[];
  onDeleteScan?: (id: string, e: React.MouseEvent) => void;
  onOpenHistory?: (cropName: string) => void;
}

export default function HomeTab({ savedScans = [], onDeleteScan, onOpenHistory }: HomeTabProps) {
  const [showConnectUI, setShowConnectUI] = useState(false);

  return (
    <main className="pt-24 px-6 space-y-8 max-w-2xl mx-auto w-full mb-24">
      {/* Hero Section: Farm Health Score */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass-card rounded-[2rem] p-8 flex items-center justify-between overflow-hidden border border-white/5">
          <div className="space-y-2">
            <span className="font-label text-[10px] tracking-widest text-primary uppercase opacity-80">Ecosystem Health</span>
            <h2 className="text-3xl font-extrabold tracking-tighter text-white font-headline">Farm Health Score</h2>
            <p className="text-on-surface-variant text-sm max-w-[180px] leading-relaxed font-body">Your crops are performing significantly above average today.</p>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle className="text-surface-container-highest" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-[#2ECC71] stroke-cap-round" cx="56" cy="56" fill="transparent" r="48" stroke="currentColor" strokeDasharray="301.59" strokeDashoffset="18" strokeWidth="8"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-[#2ECC71] font-headline">94</span>
              <span className="text-[10px] font-label opacity-60 text-white">/ 100</span>
            </div>
          </div>
        </div>
      </section>

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

      {/* Live Stats Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase font-bold">Live Telemetry</h3>
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Soil Moisture */}
          <div className="bg-surface-container-low rounded-3xl p-5 flex flex-col justify-between h-36 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <span className="material-symbols-outlined text-blue-400 text-xl" data-icon="water_drop">water_drop</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold font-label text-white">65%</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Soil Moisture</p>
            </div>
          </div>
          
          {/* Temperature */}
          <div className="bg-surface-container-low rounded-3xl p-5 flex flex-col justify-between h-36 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <span className="material-symbols-outlined text-orange-400 text-xl" data-icon="thermostat">thermostat</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold font-label text-white">28°C</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Temperature</p>
            </div>
          </div>
          
          {/* Humidity */}
          <div className="bg-surface-container-low rounded-3xl p-5 flex flex-col justify-between h-36 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-tertiary/10 rounded-xl">
                <span className="material-symbols-outlined text-tertiary text-xl" data-icon="cloud">cloud</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold font-label text-white">42%</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Air Humidity</p>
            </div>
          </div>
          
          {/* Sunlight */}
          <div className="bg-surface-container-low rounded-3xl p-5 flex flex-col justify-between h-36 border border-white/5">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-yellow-500/10 rounded-xl">
                <span className="material-symbols-outlined text-yellow-400 text-xl" data-icon="light_mode">light_mode</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold font-label text-white mt-1">Optimal</p>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Sun Exposure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Scans/Activity */}
      <section className="space-y-4">
        <h3 className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase font-bold px-2">Visual Diagnostics</h3>
        <div className="space-y-3">
          
          {/* Dynamic Scanned History */}
          {savedScans.map((scan) => (
            <div 
              key={scan.id}
              onClick={() => onOpenHistory && onOpenHistory(scan.diagnosis.disease || "Unknown Crop")}
              className="bg-surface-container-high rounded-[20px] p-4 flex items-center gap-4 group hover:bg-[#1f2622] transition-colors cursor-pointer border border-[#2ECC71]/20 shadow-md"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black/50">
                <img alt={scan.diagnosis.disease} className="w-full h-full object-cover" src={scan.image} />
                <div className="absolute inset-0 bg-[#2ECC71]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-sm" data-icon="forum">forum</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-start mb-1 text-white">
                  <h4 className="font-bold text-[13px] truncate font-body pr-2">{scan.diagnosis.disease || "Unknown Issue"}</h4>
                  <span className={`text-[9px] font-label font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ${(scan.diagnosis.severity || "").toLowerCase().includes('high') || (scan.diagnosis.severity || "").toLowerCase().includes('severe') ? 'text-error bg-error/10 border border-error/20' : 'text-primary bg-primary/10 border border-primary/20'}`}>
                    {scan.diagnosis.severity || "Unknown"}
                  </span>
                </div>
                <p className="text-[11px] text-[#888] font-label font-medium">
                  {new Date(scan.timestamp).toLocaleDateString()} • {new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              {/* Delete Button */}
              {onDeleteScan && (
                <button 
                  onClick={(e) => onDeleteScan(scan.id, e)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors shrink-0"
                  aria-label="Delete scan"
                >
                  <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                </button>
              )}
            </div>
          ))}

          {/* Scan 1 (Mock) */}
          <div 
            onClick={() => onOpenHistory && onOpenHistory("Tomato")}
            className="bg-surface-container-high rounded-2xl p-4 flex items-center gap-4 group hover:bg-surface-container-highest transition-colors cursor-pointer border border-white/5"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Tomato crop" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCRLkBbDV79-v102Ql2Es94pFh9NRKbOROTNlI4g2Y_vPrgBu9FDOMWF2t3TQ9y6B7E4wjQZcgugjvcX4LUHqi06PIZunsCoiKxeTVpZQSjmvnQ2Ym-B7XXKumeWuV2hKHsABCubsBUGRsr3HvXClnNNF5NSK6V7fN0vJX1RN1X4WZJNXE91L144AydejcEKPU8680_-LLOl7m1DQYqeQ0CMsRWVNwMJU89quu0548_c6mdhKMupWKzzf0MfFA3CgR7jqczcgXOR9t" />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-sm" data-icon="visibility">visibility</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1 text-white">
                <h4 className="font-bold text-sm truncate font-body">Tomato Crop - Healthy</h4>
                <span className="text-[10px] font-label text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Stable</span>
              </div>
              <p className="text-xs text-on-surface-variant font-label">Today, 09:42 AM</p>
            </div>
          </div>
          
          {/* Scan 2 (Mock) */}
          <div 
            onClick={() => onOpenHistory && onOpenHistory("Wheat")}
            className="bg-surface-container-high rounded-2xl p-4 flex items-center gap-4 group hover:bg-surface-container-highest transition-colors cursor-pointer border border-error/20"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Wheat field" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8jco4YgYUUJ18MTmLUTpzNhOmMd217QY9_aTgZ2rtfJ5P68Hnx8nzWU5yKq1H8iJk8gM_Qixc55IBqDwZQ3GEfKkze-QhD2vVoZXCRRThx3MJwdNUvhhWBjMp9OTZAlZos5qCbKG8ROE1P9MMbSnUD0ykaLE2eycn09sIsbulrQcExp5XL4h8cAfSWJogetD_SXVNyPmLHVGxmVN1UMg6j6fAmA8mvbH4CM1Hnb8BCCxKE7y3wEcP4RwJsawv2wp6IYzX9C6xaQOu" />
              <div className="absolute inset-0 bg-error/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-sm" data-icon="warning">warning</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1 text-white">
                <h4 className="font-bold text-sm truncate font-body">Wheat - Early Blight Detected</h4>
                <span className="text-[10px] font-label text-error bg-error/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Alert</span>
              </div>
              <p className="text-xs text-on-surface-variant font-label">Yesterday, 04:15 PM</p>
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
