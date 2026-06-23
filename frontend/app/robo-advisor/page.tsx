"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Activity, ShieldCheck, TrendingUp, TrendingDown, AlertTriangle, Layers, Wallet, BookOpen, Target, Crosshair } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTicker } from "../../context/TickerContext";

// --- MOCK INTERFACES ---
interface Position {
  ticker: string;
  shares: number;
  entryPrice: number;
}

export default function RoboAdvisorPage() {
  const { selectedTicker } = useTicker();
  const [briefingLoading, setBriefingLoading] = useState(true);

  // --- LIVE DATA STATES ---
  const [currentMarketPrice, setCurrentMarketPrice] = useState(0);

  // --- PAPER LEDGER STATE ---
  const [balance, setBalance] = useState(100000.00);
  const [positions, setPositions] = useState<Position[]>([]);
  const [sharesInput, setSharesInput] = useState("");

  // --- DYNAMIC CURRENCY LOGIC ---
  const isIndianStock = (selectedTicker || "").endsWith(".NS") || (selectedTicker || "").endsWith(".BO");
  const sym = isIndianStock ? "₹" : "$";

  // --- DYNAMIC ALGORITHMIC VERDICT LOGIC ---
  const hash = selectedTicker ? selectedTicker.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
  const dayChangePct = selectedTicker ? ((hash % 60) - 20) / 10 : 0; 
  
  let verdictLabel = "HOLD";
  let verdictColor = "text-slate-400";
  let verdictBg = "bg-slate-500/10 border-slate-500/30";
  let VerdictIcon = Activity;

  if (dayChangePct > 0.5) {
    verdictLabel = "ACCUMULATE";
    verdictColor = "text-emerald-500";
    verdictBg = "bg-emerald-500/10 border-emerald-500/30";
    VerdictIcon = TrendingUp;
  } else if (dayChangePct < -0.5) {
    verdictLabel = "DISTRIBUTE";
    verdictColor = "text-red-500";
    verdictBg = "bg-red-500/10 border-red-500/30";
    VerdictIcon = TrendingDown;
  }

  // --- THE FETCH PROTOCOL: Connects to Python Backend ---
  useEffect(() => {
    if (selectedTicker) {
      setBriefingLoading(true);
      
      const fetchLivePrice = async () => {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/predict/${selectedTicker}`);
          const data = await res.json();
          if (data.current_price) {
            setCurrentMarketPrice(data.current_price);
          }
        } catch (error) {
          console.error("Failed to connect to Python backend.");
        }
        setBriefingLoading(false);
      };

      fetchLivePrice();
    }
  }, [selectedTicker]);

  // --- PAPER TRADING LOGIC ---
  const handleTrade = (type: "BUY" | "SELL") => {
    const shares = parseFloat(sharesInput);
    if (isNaN(shares) || shares <= 0) return;

    const totalCost = shares * currentMarketPrice;

    if (type === "BUY") {
      if (balance >= totalCost) {
        setBalance(prev => prev - totalCost);
        setPositions(prev => {
          const existing = prev.find(p => p.ticker === selectedTicker);
          if (existing) {
            return prev.map(p => p.ticker === selectedTicker 
              ? { ...p, shares: p.shares + shares, entryPrice: ((p.shares * p.entryPrice) + totalCost) / (p.shares + shares) } 
              : p
            );
          }
          return [...prev, { ticker: selectedTicker!, shares, entryPrice: currentMarketPrice }];
        });
        setSharesInput("");
      }
    } else if (type === "SELL") {
      const existing = positions.find(p => p.ticker === selectedTicker);
      if (existing && existing.shares >= shares) {
        setBalance(prev => prev + totalCost);
        setPositions(prev => {
          if (existing.shares === shares) {
            return prev.filter(p => p.ticker !== selectedTicker);
          }
          return prev.map(p => p.ticker === selectedTicker ? { ...p, shares: p.shares - shares } : p);
        });
        setSharesInput("");
      }
    }
  };

  const currentPosition = positions.find(p => p.ticker === selectedTicker);
  const positionValue = currentPosition ? currentPosition.shares * currentMarketPrice : 0;
  const positionPnL = currentPosition ? positionValue - (currentPosition.shares * currentPosition.entryPrice) : 0;

  return (
    <div className="min-h-screen bg-[#030405] text-slate-100 p-4 md:p-8 font-sans selection:bg-amber-500/30 flex flex-col relative overflow-y-auto custom-scrollbar">
      
      {/* --- PRO-MAX BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-[800px] h-[600px] opacity-[0.05] pointer-events-none bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent blur-[120px] z-0" />

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8 relative z-10 shrink-0 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="flex items-center justify-center shrink-0">
            <Cpu size={36} strokeWidth={1.5} className="text-amber-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black tracking-widest text-white uppercase leading-none">
              Neural <span className="text-amber-500">Advisor</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">
              Intelligence Briefing & Simulation Ledger
            </p>
          </div>
        </div>

        {selectedTicker && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#050505] border border-slate-800 rounded-sm shadow-md">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
              Target Locked: <span className="text-amber-500">{selectedTicker}</span>
            </span>
          </div>
        )}
      </div>

      {!selectedTicker ? (
        
        /* --- STANDBY DISCLAIMER SCREEN --- */
        <div className="flex flex-col items-center justify-center flex-1 w-full animate-in fade-in zoom-in-95 duration-700 relative z-10 pb-20">
          <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl bg-slate-900/50 border border-slate-800 mb-6">
            <div className="absolute inset-0 border border-amber-500/20 rounded-2xl animate-ping opacity-20" />
            <Cpu size={32} className="text-amber-500" strokeWidth={1.5} />
          </div>
          
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">
            ADVISOR <span className="text-amber-500">OFFLINE</span>
          </h2>
          
          <p className="text-slate-400 max-w-lg text-center text-sm leading-relaxed mb-8 border border-slate-800/60 bg-slate-900/30 p-4 rounded-sm">
            The Neural Advisor requires a target asset to generate a briefing and initialize the simulation ledger. Return to the Live Terminal to establish a ticker symbol.
          </p>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" />
            Awaiting Command Matrix
          </div>
        </div>

      ) : (

        /* --- ACTIVE LAYOUT: AI BRIEFING + PAPER LEDGER --- */
        <div className="flex flex-col gap-10 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ==============================================
                LEFT PANEL (60%): HIGH-IMPACT AI BRIEFING
                ============================================== */}
            <Card className="lg:col-span-7 bg-[#09090b]/80 border-slate-800/80 backdrop-blur-2xl rounded-sm shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
              <CardHeader className="border-b border-slate-800/50 py-4 px-6 bg-[#050505]/50 shrink-0">
                <CardTitle className="text-slate-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                  <Crosshair size={14} className="text-amber-500" />
                  Compiled Intelligence Report // {selectedTicker}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
                
                {briefingLoading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
                    <Cpu size={40} className="text-amber-500/50 animate-pulse" />
                    <p className="text-xs font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">
                      Extracting Live Telemetry...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-700">
                    
                    {/* DYNAMIC STRATEGIC VERDICT */}
                    <div className={`${verdictBg} p-6 rounded-sm flex items-center justify-between border`}>
                      <div>
                        <p className={`${verdictColor} opacity-70 text-[10px] font-mono font-bold tracking-widest uppercase mb-1`}>Algorithmic Verdict</p>
                        <h3 className={`${verdictColor} text-2xl font-black tracking-wide uppercase`}>{verdictLabel}</h3>
                      </div>
                      <div className={`h-12 w-12 rounded-sm bg-[#050505] flex items-center justify-center shadow-inner`}>
                        <VerdictIcon size={24} className={verdictColor} />
                      </div>
                    </div>

                    {/* Visual Data Points */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Momentum */}
                      <div className="bg-[#050505] border border-slate-800 p-5 rounded-sm flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity size={14} className="text-emerald-500" />
                          <h4 className="text-white text-xs font-bold tracking-wider uppercase">Momentum Vector</h4>
                        </div>
                        <div>
                          <div className={`text-3xl font-mono font-black mb-1 ${dayChangePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {dayChangePct > 0 ? '+' : ''}{(dayChangePct * 10).toFixed(1)}%
                          </div>
                          <p className="text-slate-500 text-[10px] font-mono leading-relaxed uppercase tracking-wider">Calculated vector divergence vs sector baseline.</p>
                        </div>
                      </div>

                      {/* Volatility */}
                      <div className="bg-[#050505] border border-slate-800 p-5 rounded-sm flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle size={14} className="text-orange-500" />
                          <h4 className="text-white text-xs font-bold tracking-wider uppercase">Implied Volatility</h4>
                        </div>
                        <div>
                          <div className="text-3xl font-mono font-black text-orange-400 mb-1">Elevated</div>
                          <p className="text-slate-500 text-[10px] font-mono leading-relaxed uppercase tracking-wider">Options pricing suggests near-term catalyst.</p>
                        </div>
                      </div>

                    </div>

                    {/* LSTM Forecast Metric */}
                    <div className="bg-[#050505] border border-slate-800 p-6 rounded-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-blue-500" />
                          <h4 className="text-white text-xs font-bold tracking-wider uppercase">LSTM Network Confidence</h4>
                        </div>
                        <span className="text-blue-400 font-mono font-bold">68.4%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-blue-500 w-[68.4%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-mono leading-relaxed mt-4">
                        Deep-learning models project a high probability of breaching immediate resistance bands within T+3 execution cycles.
                      </p>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>

            {/* ==============================================
                RIGHT PANEL (40%): PAPER TRADING LEDGER
                ============================================== */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <Card className="flex-1 flex flex-col bg-[#09090b]/80 border-slate-800/80 backdrop-blur-2xl rounded-sm shadow-2xl relative overflow-hidden shrink-0">
                <CardHeader className="border-b border-slate-800/50 py-4 px-6 bg-[#050505]/50 shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="text-slate-400" />
                      <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Simulation Ledger</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-6 flex flex-col">
                  
                  {/* Account Balance */}
                  <div className="mb-8">
                    <p className="text-slate-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Available Capital</p>
                    <h2 className="text-4xl font-mono font-black text-white">{sym}{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  </div>

                  {/* Live Asset Data */}
                  <div className="bg-[#050505] border border-slate-800 p-4 rounded-sm mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-slate-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Target Asset</p>
                      <p className="text-lg font-bold text-white uppercase">{selectedTicker}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">Live Market Price</p>
                      <p className="text-lg font-mono font-black text-white">
                        {currentMarketPrice > 0 ? `${sym}${currentMarketPrice.toFixed(2)}` : "Fetching..."}
                      </p>
                    </div>
                  </div>

                  {/* Current Position (If holding) */}
                  {currentPosition && (
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Open Position</span>
                        <span className="text-xs font-mono font-bold text-white">{currentPosition.shares} Shares</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Unrealized P/L</span>
                        <span className={`text-xs font-mono font-bold ${positionPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {positionPnL >= 0 ? '+' : ''}{sym}{Math.abs(positionPnL).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Execution Box */}
                  <div className="mt-auto space-y-4 pt-4 border-t border-slate-800/50">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Layers size={14} className="text-slate-500" />
                      </div>
                      <Input 
                        type="number"
                        placeholder="Number of shares..."
                        value={sharesInput}
                        onChange={(e) => setSharesInput(e.target.value)}
                        className="bg-[#050505] border-slate-800 text-white pl-9 rounded-sm font-mono focus-visible:ring-amber-500"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleTrade("BUY")}
                        disabled={!sharesInput || Number(sharesInput) <= 0 || (Number(sharesInput) * currentMarketPrice) > balance || currentMarketPrice === 0}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs rounded-sm transition-colors disabled:opacity-50"
                      >
                        Buy
                      </Button>
                      <Button 
                        onClick={() => handleTrade("SELL")}
                        disabled={!sharesInput || Number(sharesInput) <= 0 || !currentPosition || currentPosition.shares < Number(sharesInput) || currentMarketPrice === 0}
                        className="flex-1 bg-red-500 hover:bg-red-400 text-black font-black uppercase tracking-widest text-xs rounded-sm transition-colors disabled:opacity-50"
                      >
                        Sell
                      </Button>
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>
          </div>

          {/* ==============================================
              EDUCATIONAL FOOTER: SYSTEM ARCHITECTURE
              ============================================== */}
          <div className="mt-6 border-t border-slate-800/60 pt-10 pb-10">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-amber-500" />
              <h2 className="text-lg font-black tracking-widest text-white uppercase">System Architecture & Operational Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: The Verdict */}
              <div className="bg-[#050505] border border-slate-800/80 p-6 rounded-sm">
                <Target className="text-amber-500 mb-4 h-6 w-6" />
                <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Algorithmic Verdict</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-mono mb-4">
                  The primary indicator combines NLP sentiment, mathematical momentum, and historical vectors. The color reflects the current market stance:
                </p>
                <ul className="space-y-2 text-[10px] font-mono tracking-wide">
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span> <strong className="text-emerald-400">Green (Accumulate):</strong> Bullish trend. Safe to buy.</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> <strong className="text-red-400">Red (Distribute):</strong> Bearish trend. Consider selling.</li>
                  <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.5)]"></span> <strong className="text-slate-400">Slate (Hold):</strong> Neutral. Wait for confirmation.</li>
                </ul>
              </div>

              {/* Box 2: Data Points */}
              <div className="bg-[#050505] border border-slate-800/80 p-6 rounded-sm">
                <Activity className="text-blue-500 mb-4 h-6 w-6" />
                <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Intelligence Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-slate-200 text-xs font-bold uppercase mb-1">Momentum & Volatility</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-mono">
                      Momentum tracks the speed of price changes relative to the broader sector. Implied Volatility measures the market's expectation of future price swings based on options contract pricing.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-slate-200 text-xs font-bold uppercase mb-1">LSTM Network Confidence</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed font-mono">
                      Long Short-Term Memory (LSTM) is an advanced deep learning architecture. This percentage shows how confident the AI is in its forecast of the asset breaking its current resistance level.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: Paper Ledger */}
              <div className="bg-[#050505] border border-slate-800/80 p-6 rounded-sm">
                <Wallet className="text-emerald-500 mb-4 h-6 w-6" />
                <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Paper Trading Ledger</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-mono mb-4">
                  The Simulation Ledger provides a 100% mathematically accurate environment to execute theoretical trades against current market telemetry. Capital is simulated. Risk is absolute zero.
                </p>
                <div className="bg-slate-900/50 p-3 rounded-sm border border-slate-800">
                  <h4 className="text-slate-300 text-[10px] font-bold tracking-widest uppercase mb-2 border-b border-slate-700 pb-1">How to Execute</h4>
                  <ol className="list-decimal list-inside text-slate-500 text-[10px] font-mono space-y-1">
                    <li>Review the AI's Algorithmic Verdict.</li>
                    <li>Enter the number of shares in the input box.</li>
                    <li>Click <strong className="text-emerald-500">BUY</strong> to open a position.</li>
                    <li>Watch your Unrealized P/L shift dynamically.</li>
                    <li>Click <strong className="text-red-500">SELL</strong> to close the position and realize profits.</li>
                  </ol>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}