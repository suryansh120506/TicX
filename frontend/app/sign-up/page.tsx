"use client";

import React, { useState, useEffect } from "react";
import { SignUp } from "@clerk/nextjs";
import { SparklesCore } from "@/components/ui/sparkles";

export default function SignUpPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const quotes = [
    {
      text: "The institutional-grade algorithmic trading suite driven by automated yFinance extraction pipelines.",
      author: "Core Architecture"
    },
    {
      text: "Deep-learning prediction terminal forecasting next-day volatility trajectories via Stacked LSTM networks.",
      author: "Predictive Engine"
    },
    {
      text: "Real-time Natural Language Processing aggregating macroeconomic market sentiment continuously.",
      author: "Market Pulse NLP"
    }
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="flex min-h-screen w-full bg-black overflow-hidden fixed inset-0 z-[100]">
      
      {/* --- INJECTED CSS FOR FLOATING & FLAWLESS TRACER LINE --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes sweep {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .clerk-tracer-wrapper {
          position: relative;
          overflow: hidden;
          padding: 1px; 
          border-radius: 0.75rem; 
        }
        .clerk-tracer-wrapper::before {
          content: '';
          position: absolute;
          top: 50%; 
          left: 50%;
          width: 200vmax; 
          height: 200vmax;
          background: conic-gradient(from 0deg, transparent 75%, rgba(245, 158, 11, 1) 100%);
          transform-origin: center center;
          animation: sweep 4s linear infinite;
          z-index: 0;
        }
        .clerk-inner {
          position: relative;
          background: #000000;
          border-radius: calc(0.75rem - 1px);
          z-index: 10;
          width: 100%;
          height: 100%;
        }
      `}} />

      {/* =========================================
          LEFT PANEL: 70% FULL SCREEN INTEGRATION 
          ========================================= */}
      <div className="hidden lg:flex lg:w-[70%] relative flex-col items-center bg-black">
        
        {/* --- PURE BLACK AMBIENT BACKGROUND --- */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-[#000000] to-[#000000] z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* --- BOTTOM LEFT: SLIM TELEMETRY TEXT --- */}
        <div className="absolute bottom-10 left-10 z-30">
          <span className="text-[10px] font-mono font-light tracking-[0.4em] text-slate-600 uppercase">
            Quantitative Telemetry Engine
          </span>
        </div>

        {/* MAIN CONTAINER */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-12">
          
          {/* --- BRANDING & SPARKLES --- */}
          <div className="flex flex-col items-center justify-start shrink-0 w-full relative pt-8">
            
            {/* Naked Floating Shard Logo */}
            <div 
              className="mb-6 flex items-center justify-center relative z-20" 
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <path d="M12 2L3 14l9 8 9-8-9-10z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
                <path d="M3 14l9-4 9 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
              </svg>
            </div>

            {/* UPGRADED BRUTALIST TYPOGRAPHY */}
            <h1 className="text-[6rem] lg:text-[8rem] font-mono font-black tracking-tighter leading-none text-white drop-shadow-2xl relative z-20 select-none">
              TIC<span className="text-amber-500">X</span>
            </h1>
            
            {/* --- SEAMLESS ACETERNITY SPARKLES CORE --- */}
            <div className="w-[40rem] h-40 relative mt-2">
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px w-1/4" />

              <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,white,transparent)]">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1.2}
                  particleDensity={1200}
                  className="w-full h-full"
                  particleColor="#f59e0b"
                />
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* --- ROTATING SYSTEM INFO --- */}
          <div className="flex flex-col justify-end w-full max-w-4xl px-10 pb-8 z-20">
            <div className="relative min-h-[120px] w-full flex items-center justify-center text-center">
              {mounted && quotes.map((quote, idx) => (
                <div 
                  key={idx}
                  className={`absolute w-full transition-all duration-1000 transform flex flex-col items-center ${
                    idx === quoteIndex 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <p className="text-xl font-bold tracking-wide text-slate-300 leading-snug mb-4 max-w-2xl">
                    "{quote.text}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-8 h-[1px] bg-amber-500/30"></span>
                    <span className="text-xs font-mono tracking-widest text-amber-500 uppercase font-bold">
                      {quote.author}
                    </span>
                    <span className="w-8 h-[1px] bg-amber-500/30"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================
          RIGHT PANEL: 30% DEEP BLACK CLERK AUTH 
          ========================================= */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-black border-l border-slate-900 relative z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-[#000000] to-[#000000] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-md animate-in slide-in-from-right-12 fade-in duration-700">
          
          <div className="clerk-tracer-wrapper">
            <div className="clerk-inner p-6">
              
              <SignUp 
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent border-none shadow-none w-full", 
                    headerTitle: "text-white font-black tracking-wider text-2xl uppercase",
                    headerSubtitle: "text-slate-500 font-mono text-xs mt-2",
                    socialButtonsBlockButton: "border border-slate-800 hover:bg-slate-900 bg-black text-white rounded-sm transition-all duration-300",
                    socialButtonsBlockButtonText: "font-bold text-xs tracking-wider",
                    dividerLine: "bg-slate-800",
                    dividerText: "text-slate-600 text-[10px] font-mono tracking-widest uppercase",
                    formFieldLabel: "text-slate-400 font-bold text-[10px] uppercase tracking-widest",
                    formFieldInput: "bg-black border border-slate-800 text-white rounded-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 h-10 transition-all",
                    formButtonPrimary: "bg-amber-500 hover:bg-amber-400 text-black font-black tracking-widest uppercase text-xs rounded-sm h-10 transition-colors",
                    footerActionText: "text-slate-500 text-xs",
                    footerActionLink: "text-amber-500 hover:text-amber-400 font-bold text-xs",
                    identityPreviewText: "text-white font-mono text-sm",
                    identityPreviewEditButtonIcon: "text-amber-500"
                  }
                }}
              />
              
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}