"use client";

export default function ProfileTab() {
  return (
    <main className="pt-24 pb-32 px-5 space-y-8 max-w-2xl mx-auto w-full mb-24 animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 p-1 bg-gradient-to-tr from-primary/50 to-transparent">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              alt="Arjun Mehta" 
              className="w-full h-full object-cover rounded-full neon-glow" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdBcQhZimPErShP17RK0lUTfX8d-ONb71WjSEKNFHscDIH-tWsW_2caXOV4zHhTsdumi7gK4BX7IKvEVOfP_ae7dy7Ul_BOSTvlB62bpy_vF-Tuuw1YKRZovzx4YF6yDDi0yFiGqwsBnJ5slj-LyxAQPx112SdKH5XYK8NvzSSfZfp_TBG6BnNsZZpI-CrKTonu_TgZyyyCgTZgEfV0EqgxlQmdcoROkCm3RLjxN5UN_LwcQoWWYFeAsb4qTOvcCpNqP87QHIYcX-1" 
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 gold-glass px-3 py-1 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#FFF8D6] font-bold">Pro</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-headline">Dr. Arjun Mehta</h1>
          <p className="font-label text-sm uppercase tracking-widest text-primary/80 mt-1">Senior Agronomist</p>
        </div>
      </section>

      {/* Farm Management Bento Card */}
      <section className="glass-card rounded-[2rem] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Farm Management</h2>
          <span className="material-symbols-outlined text-primary-dim">agriculture</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Managed Area</p>
            <p className="text-xl font-bold text-white font-headline">450 <span className="text-sm font-medium text-on-surface-variant">Acres</span></p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-lg font-bold text-white font-headline">Optimal</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-white/5">
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Primary Crops</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 font-label">Wheat</span>
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 font-label">Tomato</span>
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 font-label">Cotton</span>
          </div>
        </div>
      </section>

      {/* IoT Connectivity Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Sensor Network</h2>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="font-label text-[10px] uppercase font-bold text-primary">Online</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">sensors</span>
              </div>
              <div>
                <h3 className="font-bold text-sm font-body text-white">Soil Probes (V4)</h3>
                <p className="text-xs text-on-surface-variant font-label mt-0.5">12 Units Active</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
          
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">weather_mix</span>
              </div>
              <div>
                <h3 className="font-bold text-sm font-body text-white">Weather Station</h3>
                <p className="text-xs text-on-surface-variant font-label mt-0.5">Main Hub Connected</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Subscription & Billing */}
      <section className="relative overflow-hidden glass-card rounded-[2rem] p-6 group cursor-pointer hover:border-primary/30 transition-colors">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full transition-transform group-hover:scale-150 duration-700"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white font-headline">Kisan Saathi Pro</h2>
              <p className="text-sm text-on-surface-variant mt-1 font-label">Renewal Date: Jan 2026</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary font-bold">workspace_premium</span>
            </div>
          </div>
          <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-headline">
            <span>Manage Plan</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
      </section>

      {/* App Settings */}
      <section className="space-y-2">
        <h2 className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant px-2 mb-4">Settings &amp; Support</h2>
        <div className="glass-card rounded-[2rem] overflow-hidden divide-y divide-white/5">
          <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">notifications</span>
              <span className="text-sm font-medium font-body text-white">Notification Preferences</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">translate</span>
              <div className="text-left">
                <span className="text-sm font-medium block font-body text-white">Language</span>
                <span className="text-[10px] text-on-surface-variant font-label">English/Hindi</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">help</span>
              <span className="text-sm font-medium font-body text-white">Help &amp; Support</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
          </button>
        </div>
      </section>
    </main>
  );
}
