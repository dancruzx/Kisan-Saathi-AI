"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DiagnosisData {
  disease: string;
  severity: string;
  organic_solution: string;
  chemical_solution: string;
  weather_advisory: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DiagnosisChat({ diagnosis, onClose, capturedImage }: { diagnosis?: DiagnosisData | null; onClose: () => void; capturedImage?: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with the AI's opening statement contextually
    if (diagnosis && capturedImage) {
      setMessages([
        {
          role: "assistant",
          content: `I've detected ${diagnosis.disease} with ${diagnosis.severity} severity on your crop.\n\nI also see that ${diagnosis.weather_advisory || "the weather conditions are noted"}. How can I help you refine this treatment plan?`
        }
      ]);
    } else {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I am your AI Farm Assistant. You can ask me anything about crop management, soil health, weather forecasts, or generalized agronomy practices today."
        }
      ]);
    }
  }, [diagnosis, capturedImage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMicClick = () => {
    if (isRecording) {
      return; 
    }
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice interface is not supported on this browser. Try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Defaulting to Hindi/English hybrid processing
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onspeechend = () => recognition.stop();
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      console.error("Speech Error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const provider = localStorage.getItem("kisan_saathi_ai_provider") || "gemini";
    const apiKey = provider === "groq" 
      ? localStorage.getItem("kisan_saathi_groq_key") 
      : localStorage.getItem("kisan_saathi_gemini_key");

    if (!apiKey) {
      alert(`Missing API key for ${provider}. Please enter it in Settings.`);
      setIsLoading(false);
      return;
    }

    // Add an empty placeholder message for the assistant
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          provider,
          apiKey,
          diagnosisContext: diagnosis ? JSON.stringify(diagnosis) : undefined
        })
      });

      if (!res.ok) throw new Error("Failed to contact the Agronomist AI.");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream unsupported!");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      // Stream processing loop
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        
        // Update the last message directly in the array view
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMessage;
          return updated;
        });
      }
    } catch (e: any) {
      console.error(e);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = e.message || "I'm sorry, an error occurred while connecting.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    // Hide incomplete tags during streaming to prevent visual jitter
    const displayText = text.replace(/<IMAGE>[^<]*$/, ''); 

    const parts = displayText.split(/(<IMAGE>[^<]+<\/IMAGE>)/g);
    return parts.map((part, index) => {
      if (part.startsWith("<IMAGE>") && part.endsWith("</IMAGE>")) {
        const query = part.slice(7, -8).trim();
        return (
          <span key={index} className="block w-full h-40 rounded-[1.25rem] overflow-hidden relative group mt-3 mb-3 shadow-lg border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
              alt={query} 
              src={`https://loremflickr.com/400/300/${encodeURIComponent(query)}?lock=${index}`} 
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6bfe9c] text-sm" data-icon="image">image</span>
                <span className="font-label text-[10px] uppercase tracking-tighter text-white font-bold">{query}</span>
              </span>
            </span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[100] bg-[#0e0e0e] flex flex-col h-screen overflow-hidden text-white font-body"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/60 backdrop-blur-xl flex justify-between items-center px-6 h-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-highest text-[#6bfe9c]">
            <span className="material-symbols-outlined" data-icon="sensors">sensors</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight font-headline">Chat with my Farm</h1>
              <div className="w-2 h-2 rounded-full bg-[#6bfe9c] animate-pulse shadow-[0_0_8px_#6bfe9c]"></div>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-[#a0a0a0]">AI Agronomist Online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border-2 border-[#6bfe9c]/20">
            <span className="material-symbols-outlined text-[20px] text-white" data-icon="close">close</span>
          </button>
        </div>
      </header>

      {/* Chat Canvas */}
      <main className="flex-1 overflow-y-auto px-6 pt-24 pb-32 space-y-8 scroll-smooth no-scrollbar">
        {/* Date Stamp */}
        <div className="flex justify-center">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0] bg-surface-container-low px-3 py-1 rounded-full">
            Today • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {messages.map((msg, i) => {
          if (msg.role === "assistant") {
            const isFirst = i === 0;
            return (
              <div key={i} className="flex flex-col items-start max-w-[85%] space-y-2">
                <div className={`glass-ai p-4 rounded-2xl rounded-tl-none text-on-surface leading-relaxed shadow-sm relative overflow-hidden ${isFirst ? 'space-y-3' : ''}`}>
                  {isFirst && <div className="absolute top-0 left-0 w-1 h-full bg-[#6bfe9c]"></div>}
                  {renderMessageContent(msg.content)}
                  {msg.content === "" && (
                     <span className="flex gap-1.5 h-4 items-center">
                       <span className="w-1.5 h-1.5 bg-[#6bfe9c] rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-[#6bfe9c] rounded-full animate-bounce [animation-delay:-.15s]"></span>
                       <span className="w-1.5 h-1.5 bg-[#6bfe9c] rounded-full animate-bounce [animation-delay:-.3s]"></span>
                     </span>
                  )}
                </div>
                
                {/* Special Bento for the first context message */}
                {isFirst && diagnosis && capturedImage && (
                  <>
                    <div className="glass-ai w-full p-4 rounded-2xl flex items-center gap-4 mt-2">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <span className="material-symbols-outlined text-primary" data-icon="potted_plant">potted_plant</span>
                      </div>
                      <div>
                        <div className="font-label text-[10px] uppercase tracking-wider text-[#6bfe9c]">Diagnosis Profile</div>
                        <div className="text-sm font-bold">{diagnosis.disease}</div>
                      </div>
                    </div>
                    {/* Dynamic Visual Data Bleed referencing captured image */}
                    <div className="w-full h-32 rounded-3xl overflow-hidden relative group mt-2">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt="Plant visual" src={capturedImage} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#6bfe9c] text-sm" data-icon="monitoring">monitoring</span>
                          <span className="font-label text-[10px] uppercase tracking-tighter text-white">Analysis Source</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <span className="text-[9px] font-label text-on-surface-variant ml-1">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                </span>
              </div>
            );
          } else {
            return (
              <div key={i} className="flex flex-col items-end max-w-[85%] ml-auto space-y-2">
                <div className="glass-user p-4 rounded-2xl rounded-tr-none text-white leading-relaxed shadow-lg">
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 mr-1">
                  <span className="text-[9px] font-label text-on-surface-variant">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}
                  </span>
                  <span className="material-symbols-outlined text-[12px] text-[#6bfe9c]" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-[#0e0e0e] to-transparent pointer-events-none z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3 pointer-events-auto">
          {/* Voice Input */}
          <button 
            onClick={handleMicClick}
            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 shadow-2xl
              ${isRecording 
                ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse text-white' 
                : 'bg-gradient-to-br from-[#6bfe9c] to-[#1fc46a] text-black shadow-[0_0_20px_rgba(107,254,156,0.4)] active:scale-95 hover:scale-105'}`}
          >
            <span className="material-symbols-outlined text-2xl" data-icon="mic" style={{ fontVariationSettings: "'FILL' 1" }}>
              mic
            </span>
          </button>
          
          {/* Text Input Wrapper */}
          <div className="flex-1 glass-input h-14 rounded-full px-6 flex items-center gap-3 border border-white/5 shadow-2xl backdrop-blur-3xl bg-[#1f1f1f]/80">
            <input 
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-white/40 font-body text-sm" 
              placeholder={isRecording ? "Listening..." : "Ask about treatment..."} 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`transition-colors p-1 ${(!input.trim() || isLoading) ? 'text-white/30 cursor-not-allowed' : 'text-[#6bfe9c] hover:text-white cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-2xl" data-icon="send">send</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
