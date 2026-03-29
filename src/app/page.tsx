"use client";

import { useState, useRef, useEffect } from "react";
import BYOKModal from "@/components/BYOKModal";
import CameraCapture from "@/components/CameraCapture";
import DiagnosisChat from "@/components/DiagnosisChat";
import HomeTab from "@/components/HomeTab";
import ProfileTab from "@/components/ProfileTab";
import AnalyticsTab from "@/components/AnalyticsTab";
import CropHistoryView from "@/components/CropHistoryView";
import { AnimatePresence, motion } from "framer-motion";
import { saveScan, getScans, deleteScan, SavedScan, DiagnosisData } from "@/utils/storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "camera" | "analytics" | "profile">("home");
  const [showSettings, setShowSettings] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [savedScans, setSavedScans] = useState<SavedScan[]>([]);
  const [selectedCropHistory, setSelectedCropHistory] = useState<string | null>(null);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  useEffect(() => {
    getScans().then(setSavedScans).catch(console.error);
  }, []);

  // Auto-dismiss the error notification cleanly
  useEffect(() => {
    if (errorNotification) {
      const timer = setTimeout(() => setErrorNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setCapturedImage(e.target.result);
          setDiagnosis(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDiagnosis(null);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    const provider = localStorage.getItem("kisan_saathi_ai_provider") || "gemini";
    let apiKey = "";

    if (provider === "groq") {
      apiKey = localStorage.getItem("kisan_saathi_groq_key") || "";
      if (!apiKey) {
        setErrorNotification("Please enter a Groq API Key in the System Settings (gear icon) first.");
        setShowSettings(true);
        return;
      }
    } else {
      apiKey = localStorage.getItem("kisan_saathi_gemini_key") || "";
      if (!apiKey) {
        setErrorNotification("Please enter a Gemini API Key in the System Settings (gear icon) first.");
        setShowSettings(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setDiagnosis(null);

    let weatherContext = "Weather data unavailable.";
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=2`);
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        const maxRainProb = weatherData.daily?.precipitation_probability_max?.[0] ?? 0;
        const maxWindSpeed = weatherData.daily?.wind_speed_10m_max?.[0] ?? 0;
        weatherContext = `Today's max rain prob: ${maxRainProb}%, Wind: ${maxWindSpeed}km/h.`;
      }
    } catch (e) {
      console.log("Could not fetch weather data", e);
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: capturedImage, apiKey, provider, weatherContext })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze");

      // Verify AI semantic understanding of the image context
      if (data.is_crop === false) {
        setErrorNotification("It looks like the image is not a crop image. Please retry with a clear picture of a plant.");
        setCapturedImage(null);
        setIsCameraActive(true);
        return;
      }

      setDiagnosis(data);

      try {
        const newScan: SavedScan = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          image: capturedImage,
          diagnosis: data
        };
        await saveScan(newScan);
        setSavedScans(prev => [newScan, ...prev]);
      } catch (err) {
        console.error("Failed to save scan locally:", err);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Prevent strictly ugly JSON validation arrays from rendering directly to the user
        if (err.message.includes("invalid_type")) {
          setErrorNotification("It looks like the image is not a crop image. Please retry.");
        } else {
          setErrorNotification(err.message);
        }
      } else {
        setErrorNotification("An unknown error occurred during analysis.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteScan(id);
      setSavedScans(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete scan:", err);
    }
  };

  const handleOpenHistory = (cropName: string) => {
    setSelectedCropHistory(cropName);
  };

  return (
    <>
      <AnimatePresence>
        {errorNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-error-container/20 backdrop-blur-xl border border-error/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(255,84,73,0.2)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error">error</span>
              </div>
              <div className="flex-1">
                <h3 className="text-error font-headline font-bold text-sm">Action Failed</h3>
                <p className="text-error/90 text-xs font-body leading-relaxed mt-1">{errorNotification}</p>
              </div>
              <button onClick={() => setErrorNotification(null)} className="shrink-0 group p-1">
                <span className="material-symbols-outlined text-error/60 group-hover:text-error transition-colors text-lg">close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input for Gallery Uploads */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
      <div className="bg-background text-on-background font-body min-h-screen flex flex-col overflow-x-hidden">
        {/* TopAppBar Shell */}
        {activeTab === 'camera' && (
          <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-xl flex justify-between items-center px-6 h-16">
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-[#2ECC71] scale-95" data-icon="energy_savings_leaf">energy_savings_leaf</span>
              <h1 className="font-headline font-extrabold text-xl tracking-tight text-[#2ECC71]">Kisan Saathi AI</h1>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="hover:bg-white/5 transition-colors p-2 rounded-full flex items-center justify-center cursor-pointer text-white"
            >
              <span className="material-symbols-outlined text-on-surface" data-icon="settings">settings</span>
            </button>
          </header>
        )}

        {activeTab === 'home' && (
          <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-xl border-none bg-gradient-to-b from-[#0a0a0a] to-transparent h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-[#2ECC71] scale-95" data-icon="energy_savings_leaf">energy_savings_leaf</span>
              <h1 className="font-headline font-extrabold text-xl tracking-tight text-[#2ECC71]">Kisan Saathi AI</h1>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button 
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 text-[10px] font-label font-bold uppercase tracking-widest text-[#2ECC71] bg-[#2ECC71]/10 hover:bg-[#2ECC71]/20 border border-[#2ECC71]/20 px-3 py-2 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">vpn_key</span>
                Configure Key
              </button>
            </div>
          </header>
        )}

        {activeTab === 'profile' && (
          <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-xl border-none bg-gradient-to-b from-[#0a0a0a] to-transparent h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-[#2ECC71] scale-95" data-icon="energy_savings_leaf">energy_savings_leaf</span>
              <h1 className="font-headline font-extrabold text-xl tracking-tight text-[#2ECC71]">Kisan Saathi</h1>
            </div>
            <div className="flex items-center gap-4 text-white">
              <button className="material-symbols-outlined text-gray-400 hover:bg-white/10 transition-colors p-2 rounded-full cursor-pointer" data-icon="logout">
                logout
              </button>
            </div>
          </header>
        )}

        {activeTab === 'analytics' && (
          <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/60 backdrop-blur-xl flex items-center justify-between px-6 h-16 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#2ECC71]" data-icon="monitoring">monitoring</span>
              <h1 className="font-headline font-bold text-xl tracking-tight text-white">Farm Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#2ECC71] font-label uppercase tracking-widest text-[10px] font-bold bg-[#2ECC71]/10 px-2 py-1 rounded-md">KS-AI V2</div>
              <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-white/10 shrink-0">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  alt="Profile" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCJX1ILOpmaL9kxnlLuzfgIetLXJLuTCxDNi2HOQBJYoPPgqIP5CONwe75H-Ogbk2q3o7-BQTYsGnocWNVQHagxq_fYqnBY4e-jeyByYeD5jXSFY5ERlX3o_508qwohb_lZdiyUHdGxXyBZ-ISQQ7WFBIryzh_5XZ_CPeLkV5KmQMuMsq_8bkZLmBVNDXgrOMmcMV61d-RD_2JECMbPUQD8rkEMZ7prZaqSs-b8IAOCV47Cq39fTVI87ECixHfYTOWWTH_Hiikua3w"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </header>
        )}

        {/* Main Content Canvas */}
        <div className={activeTab === 'camera' ? 'block' : 'hidden'}>
          <main className="flex-1 pt-24 pb-32 px-6 flex flex-col items-center justify-center relative">
          {/* Ambient Decorative Glow */}
          <div className="absolute inset-0 organic-glow pointer-events-none"></div>

          {/* Tech Label Metadata */}
          <div className="mb-8 self-start w-full max-w-sm mx-auto">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-fixed opacity-80">System: Active</span>
            <h2 className="font-headline text-3xl font-extrabold mt-1 tracking-tight">Crop Diagnostics</h2>
          </div>

          {/* Central Glassmorphism Viewfinder */}
          <div className="w-full max-w-sm aspect-[4/5] glass-viewfinder rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden animate-pulse-soft group">
            {/* Viewfinder Corners */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg z-10 pointer-events-none"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg z-10 pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg z-10 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg z-10 pointer-events-none"></div>

            {isCameraActive ? (
              <CameraCapture onCapture={(img) => { setCapturedImage(img); setDiagnosis(null); setIsCameraActive(false); }} />
            ) : capturedImage ? (
              <div className="relative w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedImage} alt="Captured Crop" className="w-full h-full object-cover" />
                <button 
                  onClick={handleRetake}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold font-headline text-white border border-white/10 hover:bg-black/80 transition-colors flex items-center gap-1 z-20"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span> Retake
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full z-20">
                {/* Background Click Layer for Camera */}
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className="absolute inset-0 w-full h-full cursor-pointer hover:bg-white/5 transition-colors outline-none z-10"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  <div className="absolute inset-4 rounded-[2rem] overflow-hidden opacity-20 transition-opacity group-hover:opacity-30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      alt="close-up of vibrant green vegetable leaves with detailed vein patterns under soft natural light" 
                      className="w-full h-full object-cover grayscale" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTGNYt9rMArENfGKWJqW8SJWRMfIK1I4lQu1zlS2WTcBS60sggApYyIt9f9kwm1WSZcuoK94MNSqJks-HMYV-VJHuvJ4ETCOv7XH0puF656NMBuY9Od6l1e9QRmZih1Spk1Asz2HibMXqgb3OMX7bEn6nX1XOapeE0ypjzVJNNW-_y-6TcifG8HtUDZBPbU5mZOqTUP-h6rocwdKMQxnXqhLP9vE_mSpsm0MiodimL8VDbTclGgGoxyv00XKgsHVajmucN5l2vWMgm"
                    />
                  </div>

                  {/* Interaction Prompt */}
                  <div className="relative flex flex-col items-center text-center px-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20">
                      <span className="material-symbols-outlined text-primary text-4xl" data-icon="photo_camera">photo_camera</span>
                    </div>
                    <p className="font-headline text-xl font-bold text-on-surface">Tap to Activate Camera</p>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-3">AI Vision Ready</p>
                  </div>

                  {/* Secondary Interaction Prompt (Upload) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="pointer-events-auto relative mt-6 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-wider bg-[#121212]/80 px-5 py-2.5 rounded-full border border-white/5 hover:border-primary/30 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="upload_file">upload_file</span>
                    or Upload Gallery
                  </button>
                </div>
              </div>
            )}

            {/* Scanning Line Effect (only visible if camera is active or mock is shown) */}
            {!capturedImage && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm transform translate-y-24 opacity-40 pointer-events-none"></div>
            )}
          </div>

          {/* Secondary Info Bento */}
          {!diagnosis && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8 pb-32">
              <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Field Status</span>
                <p className="font-headline font-bold text-lg mt-1 text-secondary">Optimal</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 border border-white/5">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Last Scan</span>
                <p className="font-headline font-bold text-lg mt-1 text-on-surface">2h ago</p>
              </div>
            </div>
          )}

          {diagnosis && (
            <div className="space-y-6 w-full max-w-sm mt-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-2">
                <span className="uppercase tracking-widest text-[10px] font-label text-on-surface-variant">Diagnosis Results</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-error mt-1" data-icon="warning">warning</span>
                    <h1 className="text-xl font-extrabold font-headline tracking-tight text-error leading-tight">
                      Disease Detected: <br/>{diagnosis.disease}
                    </h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="bg-error-container/20 text-error border border-error/30 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-label">
                      Severity: {diagnosis.severity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather Advisory Banner */}
              {diagnosis.weather_advisory && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 backdrop-blur-md flex items-start gap-3 w-full">
                  <span className="material-symbols-outlined text-blue-400 mt-0.5" data-icon="partly_cloudy_day">partly_cloudy_day</span>
                  <div className="flex flex-col">
                    <h3 className="font-headline font-bold text-sm text-blue-400 mb-1">Weather Advisory</h3>
                    <p className="text-sm text-blue-200/90 leading-relaxed font-body">
                      {diagnosis.weather_advisory}
                    </p>
                  </div>
                </div>
              )}

              {/* Remediation Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 hover:bg-primary/10 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]" data-icon="forest">forest</span>
                    </div>
                    <h3 className="font-headline font-bold text-base text-primary">Organic Remediation</h3>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-dim text-sm mt-1" data-icon="check_circle">check_circle</span>
                    <p className="text-sm text-on-surface/80 leading-relaxed font-body">
                      {diagnosis.organic_solution}
                    </p>
                  </div>
                </div>
                
                <div className="bg-tertiary/5 rounded-2xl p-5 border border-tertiary/10 hover:bg-tertiary/10 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-tertiary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="science">science</span>
                    </div>
                    <h3 className="font-headline font-bold text-base text-tertiary">Chemical Remediation</h3>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-tertiary text-sm mt-1" data-icon="check_circle">check_circle</span>
                    <p className="text-sm text-on-surface/80 leading-relaxed font-body">
                      {diagnosis.chemical_solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discuss With AI Button */}
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full mt-4 py-4 rounded-2xl bg-primary/10 text-primary border border-primary/30 font-headline font-bold text-lg hover:bg-primary/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(46,205,113,0.1)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
                <span className="material-symbols-outlined relative z-10 animate-bounce" data-icon="forum">forum</span>
                <span className="relative z-10">Discuss with AI</span>
              </button>
            </div>
          )}
          </main>
        </div>

        {activeTab === 'home' && (
          <HomeTab 
            savedScans={savedScans} 
            onDeleteScan={handleDeleteScan} 
            onOpenHistory={handleOpenHistory} 
          />
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'profile' && <ProfileTab />}

        {/* Bottom Action Area */}
        <div className={`fixed bottom-0 left-0 w-full z-40 px-8 pb-28 pt-6 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none ${activeTab === 'camera' ? 'block' : 'hidden'}`}>
          <button 
            onClick={handleAnalyze}
            className={`pointer-events-auto w-full max-w-sm mx-auto py-5 rounded-full font-headline font-bold text-lg tracking-tight flex items-center justify-center gap-2 border border-white/5 transition-all
              ${capturedImage && !isAnalyzing
                ? "bg-surface-tint/10 text-primary cursor-pointer hover:bg-surface-tint/20 shadow-[0_0_15px_rgba(107,254,156,0.15)]" 
                : "bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed"}`}
            disabled={!capturedImage || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                 <span className="material-symbols-outlined animate-spin" data-icon="sync">sync</span>
                 Analyzing via AI...
              </>
            ) : (
              <>
                 <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
                 Analyze Crop
              </>
            )}
          </button>
        </div>

        {/* BottomNavBar Shell */}
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#080808] border-t border-white/5 pb-5 pt-3 px-6 flex justify-between items-center select-none shadow-[0_-10px_40px_rgba(0,0,0,0.8)] rounded-t-3xl">
          {/* Home */}
          <div onClick={() => setActiveTab('home')} className={`flex flex-col items-center justify-center cursor-pointer w-[64px] h-[64px] rounded-2xl transition-all duration-300 ${activeTab === 'home' ? 'bg-[#0f2a1e] text-[#2ECC71]' : 'text-[#888888] hover:text-white'}`}>
            <span className="material-symbols-outlined text-[24px] mb-1" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="font-label uppercase text-[9px] tracking-[0.15em] font-semibold">Home</span>
          </div>

          {/* Camera */}
          <div onClick={() => {
            setActiveTab('camera');
            setDiagnosis(null);
            setCapturedImage(null);
            setIsCameraActive(false);
          }} className={`flex flex-col items-center justify-center cursor-pointer w-[64px] h-[64px] rounded-2xl transition-all duration-300 ${activeTab === 'camera' ? 'bg-[#0f2a1e] text-[#2ECC71]' : 'text-[#888888] hover:text-white'}`}>
            <span className="material-symbols-outlined text-[24px] mb-1" style={{ fontVariationSettings: activeTab === 'camera' ? "'FILL' 1" : "'FILL' 0" }}>photo_camera</span>
            <span className="font-label uppercase text-[9px] tracking-[0.15em] font-semibold">Camera</span>
          </div>

          {/* AI Chat (Global) */}
          <div onClick={() => {
            setDiagnosis(null);
            setCapturedImage(null);
            setIsChatOpen(true);
          }} className="flex flex-col items-center justify-center cursor-pointer w-[64px] h-[64px] rounded-2xl transition-all duration-300 text-[#888888] hover:text-[#2ECC71]">
            <span className="material-symbols-outlined text-[24px] mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>psychology</span>
            <span className="font-label uppercase text-[9px] tracking-[0.15em] font-semibold">AI Chat</span>
          </div>

          {/* Analytics */}
          <div onClick={() => setActiveTab('analytics')} className={`flex flex-col items-center justify-center cursor-pointer w-[64px] h-[64px] rounded-2xl transition-all duration-300 ${activeTab === 'analytics' ? 'bg-[#0f2a1e] text-[#2ECC71]' : 'text-[#888888] hover:text-white'}`}>
            <span className="material-symbols-outlined text-[24px] mb-1" style={{ fontVariationSettings: activeTab === 'analytics' ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
            <span className="font-label uppercase text-[9px] tracking-[0.15em] font-semibold">Analytics</span>
          </div>

          {/* Profile */}
          <div onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-center cursor-pointer w-[64px] h-[64px] rounded-2xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-[#0f2a1e] text-[#2ECC71]' : 'text-[#888888] hover:text-white'}`}>
            <span className="material-symbols-outlined text-[24px] mb-1" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
            <span className="font-label uppercase text-[9px] tracking-[0.15em] font-semibold">Profile</span>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {showSettings && <BYOKModal onClose={() => setShowSettings(false)} />}
        {isChatOpen && (
          <DiagnosisChat 
            diagnosis={diagnosis} 
            capturedImage={capturedImage}
            onClose={() => setIsChatOpen(false)} 
          />
        )}
        {selectedCropHistory && (
          <CropHistoryView 
            cropName={selectedCropHistory} 
            savedScans={savedScans}
            onClose={() => setSelectedCropHistory(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
