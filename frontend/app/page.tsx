"use client";

import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Activity, Zap, ShieldCheck, ArrowUpRight, ArrowDownRight, Building2, BarChart3, Globe, ServerOff, RefreshCcw, AlertTriangle, Target, Cpu, Layers, Terminal, ChevronRight, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTicker } from "../context/TickerContext";

// --- SMART SEARCH DIRECTORY ---
const STOCK_DIRECTORY = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "ZOMATO.NS", name: "Zomato Ltd." },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors" },
  { symbol: "TATAPOWER.NS", name: "Tata Power" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "INFY.NS", name: "Infosys Limited" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "ITC.NS", name: "ITC Limited" },
  { symbol: "PAYTM.NS", name: "One97 Communications (Paytm)" },
  { symbol: "SUZLON.NS", name: "Suzlon Energy" }
];

export default function NexusTerminal() {
  const { globalTicker: ticker, setGlobalTicker: setTicker } = useTicker();
  const [searchInput, setSearchInput] = useState(ticker);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(STOCK_DIRECTORY);
  
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false); 
  const [searchError, setSearchError] = useState("");
  const [failedTicker, setFailedTicker] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState({
    current_price: 2950.50,
    ai_target: 3045.20,
    company_name: "Reliance Industries Limited",
    website: "https://www.ril.com",
    sector: "Energy / Conglomerate",
    market_cap: "₹19.50T"
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }
    const query = searchInput.toLowerCase();
    const results = STOCK_DIRECTORY.filter(stock => 
      stock.symbol.toLowerCase().includes(query) || 
      stock.name.toLowerCase().includes(query)
    ).slice(0, 5); 
    
    setFilteredSuggestions(results);
  }, [searchInput]);

  const handleSuggestionClick = (symbol: string) => {
    setSearchInput(symbol);
    setShowSuggestions(false);
    handleAnalyze(symbol);
  };

  const handleAnalyze = async (overrideTicker?: string) => {
    const queryToUse = overrideTicker || searchInput;
    if (!queryToUse) return;
    
    setLoading(true);
    setImgError(false);
    setSearchError(""); 
    setFailedTicker("");
    setShowSuggestions(false);
    
    let cleanQuery = queryToUse.trim().toUpperCase().replace(/\s+/g, '');
    let finalQuery = cleanQuery;

    const matchedStock = STOCK_DIRECTORY.find(
      s => s.name.toUpperCase().replace(/\s+/g, '') === cleanQuery || 
           s.symbol.toUpperCase() === cleanQuery
    );

    if (matchedStock) {
      finalQuery = matchedStock.symbol;
      setSearchInput(matchedStock.symbol); 
    } else {
      setSearchInput(queryToUse.toUpperCase());
    }

    const aliases: Record<string, string> = {
      "SBI": "SBIN.NS", "HDFC": "HDFCBANK.NS", "BAJAJFINANCE": "BAJFINANCE.NS",
      "TATAMOTOR": "TATAMOTORS.NS", "TATAPOWER": "TATAPOWER.NS"
    };
    if (aliases[finalQuery]) finalQuery = aliases[finalQuery];

    const indianBlueChips = ["ZOMATO", "RELIANCE", "TCS", "HDFCBANK", "INFY", "WIPRO", "ITC", "SUZLON", "PAYTM", "TATAMOTORS", "TATAPOWER", "SBIN"];
    if (indianBlueChips.includes(finalQuery)) {
      finalQuery = `${finalQuery}.NS`;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/predict/${finalQuery}`);
      
      if (!res.ok) {
        setSearchError(`Unable to resolve asset information.`);
        setFailedTicker(queryToUse); 
        setLoading(false);
        return;
      }

      const json = await res.json();
      if (json.current_price) {
        setData({
          current_price: json.current_price,
          ai_target: json.ai_target,
          company_name: json.company_name || finalQuery,
          website: json.website || "",
          sector: json.sector || "Finance",
          market_cap: json.market_cap || "N/A"
        });
        setTicker(json.ticker || finalQuery);
        setSearchInput(json.ticker || finalQuery); 
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      setSearchError("Network interface offline. Verification required.");
      setFailedTicker(queryToUse);
    }
    setLoading(false);
  };

  const guaranteedDomains: Record<string, string> = {
    "RELIANCE.NS": "ril.com", "TCS.NS": "tcs.com", "HDFCBANK.NS": "hdfcbank.com",
    "ZOMATO.NS": "zomato.com", "INFY.NS": "infosys.com", "TATAMOTORS.NS": "tatamotors.com",
    "TATAPOWER.NS": "tatapower.com", "AAPL": "apple.com", "TSLA": "tesla.com", "NVDA": "nvidia.com", "MSFT": "microsoft.com"
  };

  const parsedDomain = data.website ? data.website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] : "";
  const activeDomain = guaranteedDomains[ticker.toUpperCase()] || parsedDomain;
  const activeLogoUrl = activeDomain ? `https://logos.hunter.io/${activeDomain}` : "";

  const isIndianStock = ticker.endsWith(".NS") || ticker.endsWith(".BO");
  const sym = isIndianStock ? "₹" : "$";
  const diff = data.ai_target - data.current_price;
  const pctChange = (diff / data.current_price) * 100;
  const isBullish = diff >= 0;

  const mockChartData = [
    { time: "09:30", price: data.current_price * 0.96 }, { time: "10:30", price: data.current_price * 0.98 },
    { time: "11:30", price: data.current_price * 0.97 }, { time: "12:30", price: data.current_price * 1.02 },
    { time: "13:30", price: data.current_price * 1.01 }, { time: "14:30", price: data.current_price * 1.03 },
    { time: "15:30", price: data.current_price },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 p-6 md:p-10 font-sans selection:bg-emerald-500/30 pb-20 flex flex-col w-full max-w-[1800px] mx-auto relative overflow-hidden">
      
      {/* --- PRO-MAX BACKGROUND: TACTICAL GRID --- */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-500/[0.02] to-transparent pointer-events-none z-0" />

      {/* --- STARK INSTITUTIONAL HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 border-b border-zinc-800/60 pb-6 shrink-0 relative z-50">
        
        {/* Brand */}
        <div className="flex items-center gap-4 select-none group">
          <div className="h-12 w-12 bg-zinc-950 border border-zinc-800 text-white flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-emerald-500/50 transition-colors duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Terminal size={24} strokeWidth={2} className="relative z-10 text-emerald-50" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-[0.15em] text-white uppercase leading-none flex items-center gap-1">
              NEXUS <span className="w-2 h-6 bg-emerald-400 animate-pulse block"></span>
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                System Online // Telemetry Active
              </p>
            </div>
          </div>
        </div>
        
        {/* Command Line Search Bar */}
        <div className="w-full lg:w-[500px]" ref={searchRef}>
          {/* FIX: Removed overflow-hidden from this wrapper so the dropdown can escape */}
          <div className="flex w-full relative bg-[#050505] border border-zinc-800 rounded-sm focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-focus-within:bg-emerald-500 transition-colors rounded-l-sm" />
            
            <div className="flex items-center pl-5 pr-2 pointer-events-none">
              <span className="text-emerald-500/70 font-mono font-bold text-sm">{">"}</span>
            </div>
            <Input 
              className="bg-transparent border-none text-white h-12 text-sm font-mono placeholder:text-zinc-600 focus-visible:ring-0 rounded-none w-full tracking-wider" 
              placeholder="INITIALIZE TICKER SEARCH..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              autoComplete="off"
            />
            
            <div className="flex items-center pr-2">
              <Button 
                onClick={() => handleAnalyze()}
                disabled={loading}
                variant="ghost"
                className={`font-mono text-xs font-bold h-8 px-4 rounded-sm transition-all ${searchError ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
              >
                {loading ? "..." : "EXECUTE"}
              </Button>
            </div>

            {/* DIRECTORY DROPDOWN */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#050505] border border-zinc-800 rounded-sm shadow-2xl overflow-hidden z-50">
                {filteredSuggestions.map((stock) => (
                  <div 
                    key={stock.symbol}
                    onClick={() => handleSuggestionClick(stock.symbol)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900 cursor-pointer transition-colors border-b border-zinc-900 last:border-0 group/item"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight size={14} className="text-zinc-700 group-hover/item:text-emerald-500 transition-colors" />
                      <span className="font-bold text-sm text-zinc-300 group-hover/item:text-white transition-colors">{stock.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded-sm border border-zinc-800">{stock.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- REDESIGNED PROFESSIONAL ERROR STATE --- */}
      {searchError ? (
        <div className="flex-1 flex items-center justify-center animate-in fade-in duration-300 relative z-10 w-full">
          <Card className="max-w-2xl w-full bg-[#0a0000] border border-red-900/50 rounded-sm shadow-2xl relative overflow-hidden">
            {/* Warning Tape Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,transparent_10px,transparent_20px)] opacity-50" />
            
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <ServerOff className="h-8 w-8 text-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-red-500 font-mono font-bold tracking-widest text-sm uppercase mb-1">ERR_PIPELINE_REFUSED</h3>
                    <h2 className="text-3xl font-black text-white tracking-wide uppercase">Data Blocked</h2>
                  </div>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed border-l-2 border-red-900 pl-4 py-1 font-mono">
                    The requested sequence for <strong className="text-red-400">"{failedTicker}"</strong> could not be validated. The upstream market connection is temporarily restricted or the identifier syntax is invalid.
                  </p>
                  
                  <div className="bg-[#050000] border border-red-900/30 p-4 rounded-sm mt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500/70 mt-0.5" />
                      <div>
                        <h4 className="text-zinc-200 text-xs font-bold tracking-widest mb-1 uppercase">Syntax Guidelines</h4>
                        <p className="text-zinc-500 text-xs leading-relaxed font-mono">
                          Input the exact corporate entity name or official exchange ticker. Regional equities must include their exchange suffix (e.g., <span className="text-zinc-300">.NS</span> for National Stock Exchange).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => setSearchError("")} 
                      className="bg-white hover:bg-zinc-200 text-black rounded-sm h-10 px-8 text-xs font-bold tracking-widest uppercase transition-colors"
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAnalyze(failedTicker)} 
                      className="bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm h-10 px-6 text-xs font-bold tracking-widest uppercase transition-colors"
                    >
                      <RefreshCcw className="h-3 w-3 mr-2" /> Retry Ping
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* --- MAIN DASHBOARD BRUTALIST GRID --- */
        <div className="space-y-6 w-full animate-in fade-in duration-700 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* PRIMARY DATA CARD */}
            <Card className="lg:col-span-8 bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <CardHeader className="pb-4 border-b border-zinc-800/50 bg-[#050505]/50">
                <CardTitle className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    {ticker} // LIVE QUOTE
                  </div>
                  <span className="text-zinc-700">T-0 SERVER SYNC</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <h2 className="text-6xl md:text-8xl font-mono font-black tracking-tighter text-white mb-2 drop-shadow-lg">
                      <span className="text-zinc-600 font-sans text-4xl md:text-6xl mr-2 font-normal">{sym}</span>
                      {data.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="bg-[#050505] border border-zinc-800 px-4 py-2 rounded-sm flex items-center gap-3 w-full md:w-auto">
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">AI Target</span>
                      <span className="text-white font-mono font-bold text-lg">{sym}{data.ai_target.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold border w-full md:w-auto ${isBullish ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                      {isBullish ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownRight size={18} strokeWidth={2.5} />}
                      <span className="font-mono text-base tracking-wider">{Math.abs(diff).toFixed(2)} ({Math.abs(pctChange).toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* IDENTITY CARD */}
            <Card className="lg:col-span-4 bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <CardHeader className="pb-4 border-b border-zinc-800/50 bg-[#050505]/50">
                <CardTitle className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                  CORPORATE ENTITY MAP
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-5 mb-8">
                  <div className="h-14 w-14 bg-white rounded-sm flex items-center justify-center overflow-hidden p-2 shrink-0 shadow-lg">
                    {!imgError && activeLogoUrl ? (
                      <img src={activeLogoUrl} alt="Logo" className="h-full w-full object-contain" onError={() => setImgError(true)} />
                    ) : (
                      <div className="text-black text-2xl font-black uppercase">
                        {data.company_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-black text-white tracking-wider uppercase truncate">{data.company_name}</h3>
                    <div className="flex items-center gap-1.5 text-emerald-400/80 font-mono text-xs mt-1 truncate bg-emerald-500/10 w-fit px-2 py-0.5 rounded-sm border border-emerald-500/20">
                      <Globe className="h-3 w-3 shrink-0" />
                      {activeDomain ? activeDomain : "N/A"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5 pt-5 border-t border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Sector</span>
                    <span className="text-zinc-200 text-xs font-bold uppercase tracking-wider">{data.sector}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">Mkt Cap</span>
                    <span className="text-zinc-200 text-sm font-mono font-bold bg-[#050505] px-2 py-1 rounded-sm border border-zinc-800">{data.market_cap}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* SECONDARY ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-xl group hover:border-zinc-700 transition-colors">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2">Live Value</p>
                  <p className="text-2xl font-mono font-black text-white">{sym}{data.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="h-10 w-10 bg-[#050505] border border-zinc-800 rounded-sm flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-xl group hover:border-zinc-700 transition-colors">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2">Neural Target</p>
                  <p className="text-2xl font-mono font-black text-white">{sym}{data.ai_target.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="h-10 w-10 bg-[#050505] border border-zinc-800 rounded-sm flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-xl group hover:border-zinc-700 transition-colors">
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2">System Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-sm font-black tracking-widest text-white uppercase">Secured</p>
                  </div>
                </div>
                <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-sm flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CHART AREA */}
          <Card className="bg-[#09090b]/80 backdrop-blur-xl border border-zinc-800/80 rounded-sm shadow-2xl relative overflow-hidden">
            <CardHeader className="pb-4 border-b border-zinc-800/50 bg-[#050505]/50">
              <CardTitle className="text-zinc-500 text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex justify-between">
                <span className="flex items-center gap-2"><LineChart size={14} className="text-emerald-500"/> INTRADAY SIMULATION // VECTOR MAPPING</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <XAxis dataKey="time" stroke="#52525b" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} dy={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', borderColor: '#27272a', borderRadius: '4px', color: '#fff', padding: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} 
                      itemStyle={{ color: '#10b981', fontWeight: 'bold', fontFamily: 'monospace' }} 
                      labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* --- TELEMETRY / FEATURES ROW --- */}
          <div className="pt-6">
            <h2 className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4 flex items-center gap-2">
              <Layers size={14} /> Diagnostic Telemetry Subsystems
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#050505] border border-zinc-800/80 p-6 rounded-sm group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Globe size={14} className="text-emerald-500" /> Live Pipeline
                </h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-mono">Active connection resolving global pricing vectors continuously.</p>
              </div>
              
              <div className="bg-[#050505] border border-zinc-800/80 p-6 rounded-sm group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Cpu size={14} className="text-emerald-500" /> LSTM Forecast
                </h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-mono">Deep Learning models calculating structural probability matrices.</p>
              </div>
              
              <div className="bg-[#050505] border border-zinc-800/80 p-6 rounded-sm group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                  <BarChart3 size={14} className="text-emerald-500" /> Macro Sync
                </h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-mono">Real-time validation against underlying market sector logic.</p>
              </div>
              
              <div className="bg-[#050505] border border-zinc-800/80 p-6 rounded-sm group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                  <Target size={14} className="text-emerald-500" /> Simulation
                </h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-mono">Mapping localized volatility via geometric pathfinding.</p>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}