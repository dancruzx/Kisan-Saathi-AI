"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedScan } from "@/utils/storage";
import ConnectSensorsView from "./ConnectSensorsView";

interface CropHistoryViewProps {
  cropName: string;
  savedScans?: SavedScan[];
  onClose: () => void;
}

export default function CropHistoryView({ cropName, savedScans = [], onClose }: CropHistoryViewProps) {
  const [showConnectUI, setShowConnectUI] = useState(false);

  // Constrain the global history array to only show scans matching the active crop context.
  const filteredScans = savedScans.filter((scan) => {
    const disease = (scan.diagnosis.disease || "").toLowerCase();
    const query = cropName.toLowerCase();
    return disease.includes(query) || query.includes(disease);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto overflow-x-hidden font-body text-white selection:bg-primary selection:text-on-primary"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center px-6 h-16 w-full max-w-screen-xl mx-auto justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="text-[#2ECC71] hover:opacity-80 transition-opacity active:scale-95 duration-200 outline-none flex items-center justify-center p-2 rounded-full hover:bg-white/5"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline font-bold text-xl tracking-tight text-white">{cropName} History</h1>
          </div>
          <div className="font-label uppercase tracking-widest text-[#2ECC71] text-xs font-bold hidden sm:block">
            CROP DIAGNOSIS
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-screen-xl mx-auto min-h-screen">
        {/* Hero Summary Section */}
        <section className="mb-12">
          <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden group border border-white/5 bg-white/[0.02]">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <span className="font-label text-primary uppercase tracking-widest text-xs mb-2 block font-bold">Performance Overview</span>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Crop Health Trend</h2>
                <p className="text-on-surface-variant max-w-md text-sm md:text-base leading-relaxed">
                  Your {cropName.toLowerCase()} plantation is showing high resilience. Health stability has increased by <span className="text-primary font-bold">12.4%</span> since last month.
                </p>
              </div>
              
              <div className="w-full md:w-1/2 h-32 flex items-end gap-2 px-1">
                {/* Mock Glowing Line Chart */}
                <div className="flex-1 bg-surface-container-highest/50 rounded-t-xl h-[40%] group-hover:h-[60%] transition-all duration-700 delay-100"></div>
                <div className="flex-1 bg-surface-container-highest/50 rounded-t-xl h-[55%] group-hover:h-[45%] transition-all duration-700 delay-200"></div>
                <div className="flex-1 bg-surface-container-highest/50 rounded-t-xl h-[70%] group-hover:h-[85%] transition-all duration-700 delay-300"></div>
                <div className="flex-1 bg-primary/20 rounded-t-xl h-[65%] group-hover:h-[75%] transition-all duration-700 delay-400 border-t-2 border-primary/50 shadow-[0_-4px_20px_rgba(107,254,156,0.2)]"></div>
                <div className="flex-1 bg-primary/40 rounded-t-xl h-[85%] group-hover:h-[95%] transition-all duration-700 delay-500 border-t-2 border-primary shadow-[0_-4px_20px_rgba(107,254,156,0.3)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12">
          
          {/* Timeline of Diagnoses */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline text-2xl font-bold text-white">Timeline</h3>
              <div className="h-[1px] flex-1 mx-6 bg-white/10"></div>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Sort: Recent</span>
            </div>
            
            <div className="space-y-6 relative">
              {/* Vertical Track */}
              <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-white/5"></div>
              
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => {
                  const isSevere = (scan.diagnosis.severity || "").toLowerCase().includes('high') || (scan.diagnosis.severity || "").toLowerCase().includes('severe');
                  const bgColor = isSevere ? "bg-error" : "bg-primary";
                  const shadowColor = isSevere ? "shadow-[0_0_15px_rgba(255,113,108,0.5)]" : "shadow-[0_0_15px_rgba(107,254,156,0.5)]";
                  const cardBorder = isSevere ? "border-error/20 bg-error/5 hover:bg-error/10" : "border-primary/20 bg-primary/5 hover:bg-white/5";
                  const titleColor = isSevere ? "text-error drop-shadow-[0_0_8px_rgba(255,113,108,0.4)]" : "text-primary drop-shadow-[0_0_8px_rgba(107,254,156,0.4)]";
                  
                  return (
                    <div key={scan.id} className="relative pl-14 group">
                      <div className={`absolute left-4 top-6 w-6 h-6 rounded-full ${bgColor} border-4 border-[#0a0a0a] z-10 ${shadowColor}`}></div>
                      <div className={`glass-card rounded-2xl p-6 transition-all duration-300 border ${cardBorder} cursor-default`}>
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 hidden sm:block bg-black/50">
                            <img alt={scan.diagnosis.disease} className="w-full h-full object-cover" src={scan.image} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className={`font-headline font-bold text-lg sm:text-lg ${titleColor}`}>{scan.diagnosis.disease || "Unknown Issue"}</h4>
                              <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded hidden sm:block whitespace-nowrap">
                                {new Date(scan.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`${isSevere ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'} text-[9px] font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest border`}>
                                Severity: {scan.diagnosis.severity || "Unknown"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-3 mb-5 mt-2">
                              {/* Weather */}
                              {scan.diagnosis.weather_advisory && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                                  <span className="material-symbols-outlined text-blue-400 text-sm mt-0.5">partly_cloudy_day</span>
                                  <p className="text-xs text-blue-200/90 leading-relaxed font-body">
                                    {scan.diagnosis.weather_advisory}
                                  </p>
                                </div>
                              )}
                              
                              {/* Organic */}
                              <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="material-symbols-outlined text-primary text-[14px]">forest</span>
                                  <h3 className="font-headline font-bold text-xs text-primary uppercase tracking-widest font-label">Organic Solution</h3>
                                </div>
                                <p className="text-xs text-on-surface/80 leading-relaxed font-body">
                                  {scan.diagnosis.organic_solution || "None required."}
                                </p>
                              </div>

                              {/* Chemical */}
                              {scan.diagnosis.chemical_solution && scan.diagnosis.chemical_solution.trim() !== "" && scan.diagnosis.chemical_solution.toLowerCase() !== "none" && (
                                <div className="bg-tertiary/5 rounded-xl p-3 border border-tertiary/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-tertiary text-[14px]">science</span>
                                    <h3 className="font-headline font-bold text-xs text-tertiary uppercase tracking-widest font-label">Chemical Solution</h3>
                                  </div>
                                  <p className="text-xs text-on-surface/80 leading-relaxed font-body">
                                    {scan.diagnosis.chemical_solution}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-label uppercase text-primary/80 font-bold">
                              <span className="material-symbols-outlined text-sm">psychology</span>
                              AI Diagnosis Captured
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Card 1: Most Recent */}
                  <div className="relative pl-14 group">
                    <div className="absolute left-4 top-6 w-6 h-6 rounded-full bg-primary border-4 border-[#0a0a0a] z-10 shadow-[0_0_15px_rgba(107,254,156,0.5)]"></div>
                    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:bg-white/5 border border-primary/20 bg-primary/5 cursor-pointer">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 hidden sm:block">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            alt="Ultra close-up of a vibrant healthy green leaf" 
                            className="w-full h-full object-cover" 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwTVnY0fIsXbvjPRS5NObonrqWkSFN63utiHfaEOK8CpHpxeI_GabRU4aKPtPncHWrTtmaRED1BR3I8om2oj9-b4_CEnUJ2GmuHkaJz1lLWW65Qf2SsYbePLVebVwL4-r8YNjjGuUerrPne-d-eTeDqRU3VpcXSgnMo_PbNGCfmnvdAjnywGaEF8xWFxgXFSHaoVvKbzHKJ72unWIwW4j5xeJ_d6Jj_4JbAzVRUvsYvqPZwln8FLWXjDqavsmVzfaUMne7O6nDCRn5"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-headline font-bold text-lg sm:text-xl text-primary drop-shadow-[0_0_8px_rgba(107,254,156,0.4)]">Healthy - Status Stable</h4>
                            <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded hidden sm:block">Today, 09:42 AM</span>
                          </div>
                          <p className="text-on-surface-variant text-xs sm:text-sm mb-4 leading-relaxed font-body">
                            No anomalies detected in the leaf structure or pigmentation. Keep current irrigation cycle.
                          </p>
                          <div className="flex items-center gap-1 text-[10px] font-label uppercase text-primary/80 font-bold">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            AI Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Alert */}
                  <div className="relative pl-14 group">
                    <div className="absolute left-4 top-6 w-6 h-6 rounded-full bg-error border-4 border-[#0a0a0a] z-10"></div>
                    <div className="glass-card rounded-2xl p-6 border border-error/20 bg-error/5 hover:bg-error/10 transition-all duration-300 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-headline font-bold text-lg sm:text-xl text-error drop-shadow-[0_0_8px_rgba(255,113,108,0.4)]">Early Blight Detected</h4>
                        <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded hidden sm:block">Oct 24, 02:15 PM</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-error/10 text-error text-[9px] font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-error/20">High Severity</span>
                      </div>
                      <p className="text-on-surface-variant text-xs sm:text-sm mb-6 leading-relaxed font-body">
                        Targeted spotting identified on lower foliage. Spreading risk is medium. Immediate fungicide application recommended.
                      </p>
                      <button className="w-full py-3 rounded-xl bg-error/10 text-error font-label text-[10px] uppercase tracking-widest font-bold hover:bg-error/20 transition-colors border border-error/20">
                        View Treatment
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Resolved */}
                  <div className="relative pl-14 group">
                    <div className="absolute left-4 top-6 w-6 h-6 rounded-full bg-outline-variant border-4 border-[#0a0a0a] z-10"></div>
                    <div className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all cursor-pointer opacity-80 hover:opacity-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-headline font-bold text-lg sm:text-xl text-white">Nutrient Deficiency</h4>
                        <span className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded hidden sm:block">Oct 15, 11:30 AM</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-primary/10 text-primary text-[9px] font-label font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">Resolved</span>
                      </div>
                      <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed font-body">
                        Magnesium levels restored following liquid fertilizer intervention. Leaves returned to dark green status.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Stats & Meta Panel */}
          <aside className="space-y-6">
            {/* IoT Connect Card */}
            <div onClick={() => setShowConnectUI(true)} className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 group cursor-pointer hover:border-secondary/50 transition-all shadow-[0_0_30px_rgba(114,251,189,0.05)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] group-hover:bg-secondary/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(114,251,189,0.3)]">
                  <span className="material-symbols-outlined text-[24px] animate-pulse">settings_input_antenna</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-white">Connect Sensors</h4>
                  <span className="text-[10px] font-label uppercase tracking-widest text-secondary">IoT Network</span>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body relative z-10">
                Pair your {cropName.toLowerCase()} IoT sensors to see live metrics.
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-2xl font-bold text-white">Metrics</h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 font-bold">Total Diagnoses</span>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold text-white">12</div>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-2 font-bold">Average Health</span>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold text-primary drop-shadow-[0_0_8px_rgba(107,254,156,0.5)]">88%</div>
                <div className="mt-4 flex items-center gap-2 text-primary/90 text-[10px] font-label uppercase font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +4% from last scan
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5 col-span-2 lg:col-span-1">
                <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1 font-bold">Last Alert</span>
                <div className="text-3xl sm:text-4xl font-headline font-extrabold text-white">5 <span className="text-xl font-normal text-on-surface-variant font-body">Days</span></div>
                <p className="mt-4 text-xs text-on-surface-variant font-body">Since "Early Blight" was flagged</p>
              </div>
            </div>

            {/* AI Quick Action */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 mt-4 group cursor-pointer hover:border-primary/50 transition-all shadow-[0_0_30px_rgba(46,204,113,0.05)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-white">AI Assistant</h4>
              </div>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed font-body">
                Ask me anything about your {cropName} crop's history or predicting future growth patterns.
              </p>
              <div className="bg-black/30 rounded-xl p-4 text-sm text-primary/80 font-label italic border border-white/5">
                "What caused the blight on Oct 24?"
              </div>
            </div>
          </aside>
          
        </div>
      </main>

      <AnimatePresence>
        {showConnectUI && <ConnectSensorsView onClose={() => setShowConnectUI(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}
