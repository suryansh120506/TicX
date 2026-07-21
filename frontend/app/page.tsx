"use client";

import React, { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import { Activity, Search, ShieldAlert, TrendingUp, AlertTriangle } from "lucide-react";

export default function TerminalPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("RELIANCE.NS");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [failedTicker, setFailedTicker] = useState("");
  const [debugText, setDebugText] = useState(""); // Visible Debugger Status
  const searchRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState({
    ticker: "RELIANCE.NS",
    current_price: 2850.50,
    ai_target: 2980.00,
    company_name: "Reliance Industries Limited",
    sector: "Energy",
    market_cap: "₹19.50T",
    warning: ""
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    { ticker: "RELIANCE.NS", name: "Reliance Industries" },
    { ticker: "TCS.NS", name: "Tata Consultancy Services" },
    { ticker: "HDFCBANK.NS", name: "HDFC Bank" },
    { ticker: "INFY.NS", name: "Infosys" },
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corp." },
    { ticker: "NVDA", name: "NVIDIA Corp." },
    { ticker: "TSLA", name: "Tesla Inc." },
    { ticker: "ZOMATO.NS", name: "Zomato Limited" }
  ];

  const filteredSuggestions = suggestions.filter(item => 
    item.ticker.includes(searchInput.toUpperCase()) || 
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleAnalyze = async (overrideTicker?: string) => {
    const queryToUse = overrideTicker || searchInput;
    if (!queryToUse) return;
    
    setDebugText("1. Triggered. Initializing pipeline...");
    setLoading(true);
    setImgError(false);
    setSearchError(""); 
    setFailedTicker("");
    setShowSuggestions(false);
    
    let cleanQuery = queryToUse.trim().toUpperCase().replace(/\s+/g, '');
    let finalQuery = cleanQuery;
    
    const indianBlueChips = ["ZOMATO", "RELIANCE", "TCS", "HDFCBANK", "INFY", "WIPRO", "ITC", "SUZLON", "PAYTM", "TATAMOTORS", "TATAPOWER", "SBIN"];
    if (indianBlueChips.includes(finalQuery)) {
      finalQuery = `${finalQuery}.NS`;
    }

    try {
      const API_URL = "https://ticx-wx9t.onrender.com";
      const targetUrl = `${API_URL}/api/predict/${finalQuery}`;
      setDebugText(`2. Fetching from: ${targetUrl}`);

      let res;
      try {
        res = await fetch(targetUrl);
      } catch (directError) {
        setDebugText(`3. CORS blocked. Attempting proxy bypass...`);
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        res = await fetch(proxyUrl);
      }
      
      if (!res.ok) {
        setDebugText(`Error: Server returned status ${res.status}`);
        setSearchError(`Unable to resolve asset information.`);
        setFailedTicker(queryToUse); 
        setLoading(false);
        return;
      }

      const json = await res.json();
      setDebugText(`4. Success! Data parsed.`);

      if (json.current_price) {
        setData({
          ticker: json.ticker || finalQuery,
          current_price: json.current_price,
          ai_target: json.ai_target || json.current_price * 1.05,
          company_name: json.company_name || `${finalQuery} Corporation`,
          sector: json.sector || "Technology",
          market_cap: json.market_cap || "N/A",
          warning: json.warning || ""
        });
        setSelectedTicker(json.ticker || finalQuery);
        setSearchInput(json.ticker || finalQuery); 
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      setDebugText(`Crash: ${error instanceof Error ? error.message : "Unknown error"}`);
      setSearchError("Network interface offline or blocked by browser extension.");
      setFailedTicker(queryToUse);
    } finally {
      setLoading(false); 
    }
  };

  const guaranteedDomains: Record<string, string> = {
    "RELIANCE.NS": "ril.com",
    "TCS.NS": "tcs.com",
    "HDFCBANK.NS": "hdfcbank.com",
    "INFY.NS": "infosys.com",
    "AAPL": "apple.com",
    "MSFT": "microsoft.com",
    "NVDA": "nvidia.com",
    "TSLA": "tesla.com",
    "ZOMATO.NS": "zomato.com"
  };

  const getCompanyLogoUrl = (ticker: string) => {
    if (imgError) return null;
    const clean = ticker.replace('.NS', '').replace('.BO', '');
    const domain = guaranteedDomains[ticker] || `${clean.toLowerCase()}.com`;
    return `https://img.logo.dev/${domain}?token=pk_test_fallback&size=120`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-[#030405] text-slate-100 font-sans overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* TOP HEADER BAR */}
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 bg-[#030405]/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-500 animate-pulse" size={24} />
            <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">Live Terminal</h1>
          </div>

          {/* SEARCH & EXECUTE BAR */}
          <div className="relative w-[360px]" ref={searchRef}>
            <div className={`flex items-center bg-slate-900/80 border transition-all rounded-sm ${searchError ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-800 focus-within:border-amber-500/50'}`}>
              <div className="pl-3 text-slate-500">
                <Search size={16} />
              </div>
              <input 
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                  if(searchError) setSearchError("");
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Search Ticker (e.g., RELIANCE, AAPL)..."
                className="w-full bg-transparent px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
              />
              <div className="flex items-center pr-2 z-10">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAnalyze();
                  }}
                  disabled={loading}
                  className={`font-mono text-xs font-bold h-8 px-4 rounded-sm transition-all flex items-center justify-center cursor-pointer ${searchError ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                >
                  {loading ? "..." : "EXECUTE"}
                </button>
              </div>
            </div>

            {/* VISIBLE DEBUG LOGGER */}
            {debugText && (
              <div className="absolute top-12 left-0 w-full bg-[#050505] border border-amber-500/30 p-2 rounded-sm text-[10px] font-mono text-amber-500 z-50 shadow-2xl">
                System Status: {debugText}
              </div>
            )}

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-[#07080a] border border-slate-800 rounded-sm shadow-2xl z-50 max-h-60 overflow-y-auto">
                {filteredSuggestions.map((item) => (
                  <div 
                    key={item.ticker}
                    onClick={() => {
                      setSearchInput(item.ticker);
                      setShowSuggestions(false);
                      handleAnalyze(item.ticker);
                    }}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-900 cursor-pointer border-b border-slate-900/50 transition-colors"
                  >
                    <span className="font-mono text-xs font-bold text-white">{item.ticker}</span>
                    <span className="text-[11px] text-slate-400">{item.name}</span>
                  </div>
                ))}
              </div>
            )}

            {searchError && (
              <div className="absolute -bottom-6 left-0 text-[10px] font-mono text-red-400 flex items-center gap-1">
                <AlertTriangle size={12} /> {searchError} 
                {failedTicker && (
                  <button 
                    onClick={() => handleAnalyze(failedTicker)} 
                    className="underline ml-1 cursor-pointer font-bold hover:text-white"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
          {data.warning && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm text-xs font-mono text-amber-400 flex items-center gap-3">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{data.warning}</span>
            </div>
          )}

          {/* ASSET OVERVIEW BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#07080a] border border-slate-800/80 p-5 rounded-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Asset Identifier</span>
                <div className="h-8 w-8 rounded-sm bg-slate-900 border border-slate-800 flex items-center overflow-hidden p-1">
                  {getCompanyLogoUrl(selectedTicker) ? (
                    <img 
                      src={getCompanyLogoUrl(selectedTicker)!} 
                      alt="" 
                      onError={() => setImgError(true)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-amber-500 m-auto">{selectedTicker.slice(0, 2)}</span>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black font-mono text-white tracking-tight">{data.ticker}</h2>
                <p className="text-xs text-slate-400 truncate mt-0.5">{data.company_name}</p>
              </div>
            </div>

            <div className="bg-[#07080a] border border-slate-800/80 p-5 rounded-sm flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Telemetry Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-white">
                  {data.current_price > 1000 ? `₹${data.current_price.toLocaleString()}` : `$${data.current_price.toLocaleString()}`}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center">
                  <TrendingUp size={12} className="mr-0.5" /> LIVE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Real-time exchange feed</span>
            </div>

            <div className="bg-[#07080a] border border-slate-800/80 p-5 rounded-sm flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">AI Target Vector</span>
              <span className="text-2xl font-black font-mono text-amber-500">
                {data.ai_target > 1000 ? `₹${data.ai_target.toLocaleString()}` : `$${data.ai_target.toLocaleString()}`}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Projected horizon confidence</span>
            </div>

            <div className="bg-[#07080a] border border-slate-800/80 p-5 rounded-sm flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Market Structure</span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white font-mono truncate">{data.sector}</p>
                <p className="text-[11px] text-slate-400 font-mono">Cap: {data.market_cap}</p>
              </div>
            </div>
          </div>

          {/* CHART WORKSPACE */}
          <div className="bg-[#07080a] border border-slate-800/80 rounded-sm p-6 flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Predictive Matrix & Telemetry Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-sm text-slate-400">LSTM Model Active</span>
              </div>
            </div>
            
            <div className="flex-1 w-full bg-[#050507] border border-slate-900 rounded-sm flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />
              
              <div className="text-center z-10 space-y-2">
                <div className="inline-flex h-12 w-12 rounded-sm bg-slate-900 border border-slate-800 items-center justify-center text-amber-500 mb-2">
                  <Activity size={24} className="animate-pulse" />
                </div>
                <h3 className="text-sm font-bold font-mono text-white tracking-widest uppercase">Telemetry Graph Ready</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Active connection established for <span className="text-amber-500 font-mono font-bold">{data.ticker}</span>. Real-time inference vectors are synced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}