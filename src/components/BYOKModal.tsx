"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BYOKModalProps {
  onClose: () => void;
}

export default function BYOKModal({ onClose }: BYOKModalProps) {
  const [provider, setProvider] = useState<"gemini" | "groq">(
    () => (localStorage.getItem("kisan_saathi_ai_provider") as "gemini" | "groq" | null) ?? "gemini"
  );
  const [geminiKey, setGeminiKey] = useState(
    () => localStorage.getItem("kisan_saathi_gemini_key") ?? ""
  );
  const [groqKey, setGroqKey] = useState(
    () => localStorage.getItem("kisan_saathi_groq_key") ?? ""
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Kept for potential future side-effects; not used for localStorage reads.
  useEffect(() => {}, []);

  const handleSave = () => {
    localStorage.setItem("kisan_saathi_ai_provider", provider);
    localStorage.setItem("kisan_saathi_gemini_key", geminiKey);
    localStorage.setItem("kisan_saathi_groq_key", groqKey);
    
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-[#121212]/95 backdrop-blur-md border border-primary/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(107,254,156,0.1)] relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-2xl" data-icon="api">api</span>
          <h2 className="font-headline text-xl font-bold text-on-surface">System Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Provider Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1919] rounded-xl border border-white/10 mb-2">
            <button
              onClick={() => setProvider("gemini")}
              className={`py-2 px-3 rounded-lg text-sm font-headline font-bold transition-all ${
                provider === "gemini" 
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(107,254,156,0.3)]" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Google Gemini
            </button>
            <button
              onClick={() => setProvider("groq")}
              className={`py-2 px-3 rounded-lg text-sm font-headline font-bold transition-all ${
                provider === "groq" 
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(107,254,156,0.3)]" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Groq (Recommended)
            </button>
          </div>

          <div>
            <label className="block font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2">
              {provider === "gemini" ? "Gemini API Key" : "Groq API Key"}
            </label>
            <input 
              type="password" 
              value={provider === "gemini" ? geminiKey : groqKey}
              onChange={(e) => provider === "gemini" ? setGeminiKey(e.target.value) : setGroqKey(e.target.value)}
              placeholder={provider === "gemini" ? "Enter Gemini API Key" : "Enter Groq API Key"} 
              className="w-full bg-[#1a1919] border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-body font-bold"
            />
            <p className="text-[10px] text-on-surface-variant mt-2 font-label">
              Keys are stored locally. Zero server-side persistence.
            </p>
            <a 
              href="/api-keys-guide.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 text-xs text-primary hover:underline font-body flex items-center gap-1 w-fit"
            >
              <span className="material-symbols-outlined text-[14px]">help</span>
              How to get free API keys?
            </a>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-3.5 rounded-xl bg-primary text-background font-headline font-bold text-base tracking-tight hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {showSuccess ? (
              <span className="material-symbols-outlined">check_circle</span>
            ) : (
              <span className="material-symbols-outlined">save</span>
            )}
            {showSuccess ? "Config Saved!" : "Save Configuration"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
