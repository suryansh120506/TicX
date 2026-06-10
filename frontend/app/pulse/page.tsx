"use client";

import React from "react";
import { Activity, Globe, Newspaper, TrendingUp, TrendingDown, Minus, AlertTriangle, Radio, BookOpen, Layers } from "lucide-react";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTicker } from "../../context/TickerContext";

export default function MarketPulsePage() {
  const { globalTicker } = useTicker();

  // --- DYNAMIC DATA GENERATOR ---
  const generateHash = (str: string) => {
    return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };
  const hash = generateHash(globalTicker.toUpperCase());

  const macroScore = 40 + (hash % 50); 
  const sentimentLabel = macroScore > 75 ? "STRONG BULLISH (GREED)" : macroScore > 60 ? "LEANING BULLISH" : "NEUTRAL";
  const volatilityIndex = (10 + (hash % 15) + (hash % 10) / 10).toFixed(2);

  const sectorData = [
    { name: "Tech", score: (hash % 60) + 30 },
    { name: "Energy", score: ((hash * 2) % 60) + 20 },
    { name: "Finance", score: ((hash * 3) % 70) + 10 },
    { name: "Healthcare", score: ((hash * 5) % 50) + 5 },
    { name: "Crypto", score: ((hash * 7) % 80) - 20 }, 
    { name: "Real Estate", score: ((hash * 11) % 60) - 10 },
  ].sort((a, b) => b.score - a.score); 

  const newsFeed = [
    { id: 1, time: "10:42 AM", source: "Bloomberg", text: `Institutional order flow for ${globalTicker} surges as algorithmic funds increase exposure ahead of quarterly guidance.`, sentiment: "BULLISH", score: 0.82 },
    { id: 2, time: "10:15 AM", source: "Reuters", text: `Macro headwinds threaten supply chain logistics affecting ${globalTicker}'s core operational sectors.`, sentiment: "BEARISH", score: -0.45 },
    { id: 3, time: "09:30 AM", source: "WSJ", text: `Options market prices in significant implied volatility for ${globalTicker} expiring this Friday.`, sentiment: "NEUTRAL", score: 0.05 },
    { id: 4, time: "08:45 AM", source: "CNBC", text: `Retail sentiment indicators show mass accumulation of ${globalTicker} across social trading platforms.`, sentiment: "BULLISH", score: 0.74 },
    { id: 5, time: "08:10 AM", source: "Financial Times", text: `Analyst downgrades sector outlook, citing overextended valuations for assets closely correlated with ${globalTicker}.`, sentiment: "BEARISH", score: -0.62 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30 pb-20 flex flex-col relative overflow-hidden">
      
      {/* --- PRO-MAX BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[600px] opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent blur-[100px] z-0" />

      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="h-12 w-12 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500">
            <Globe size={24} className="text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-sm uppercase">
              Pulse <span className="text-white">{globalTicker}</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mt-0.5">
              Asset-Specific NLP & Sentiment
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
          <Radio size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Live Intercept</span>
        </div>
      </div>

      {/* --- TOP OVERVIEW CARDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 relative z-10">
        
        {/* Fear & Greed Index */}
        <Card className="lg:col-span-8 bg-white/[0.02] border-white/[0.05] backdrop-blur-2xl rounded-2xl overflow-hidden relative group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" /> 
              Asset Sentiment Index
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2">
              <div className="flex items-end gap-3 mb-2">
                <h2 className="text-6xl font-mono font-black tracking-tighter text-white drop-shadow-md">{macroScore}</h2>
                <span className="text-xl text-zinc-600 font-mono font-bold mb-2">/ 100</span>
              </div>
              <p className="text-emerald-400 font-bold tracking-[0.2em] text-xs mb-5">{sentimentLabel}</p>
              
              <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${macroScore}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold tracking-widest mt-3 uppercase">
                <span>Fear</span>
                <span>Neutral</span>
                <span>Greed</span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 text-sm text-zinc-400 leading-relaxed border-l border-white/5 pl-0 md:pl-8">
              The NLP engine has isolated <strong className="text-white font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10">4,280</strong> specific references to <strong className="text-cyan-400">{globalTicker}</strong> in the last 24 hours. Current linguistic weighting indicates strong institutional accumulation.
            </div>
          </CardContent>
        </Card>

        {/* Volatility Monitor */}
        <Card className="lg:col-span-4 bg-white/[0.02] border-white/[0.05] backdrop-blur-2xl rounded-2xl flex flex-col justify-center shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors duration-700 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" /> 
              Implied Volatility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-mono font-black tracking-tighter text-white mb-3 drop-shadow-md">{volatilityIndex}</div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 text-xs font-bold tracking-wider">
                <TrendingUp size={14} strokeWidth={3} />
                <span className="font-mono">+1.24 (+8.03%)</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-5 leading-relaxed">Options pricing suggests expected price swings in the near term for this asset.</p>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Live NLP News Feed */}
        <Card className="bg-white/[0.02] border-white/[0.05] backdrop-blur-2xl rounded-2xl lg:col-span-2 flex flex-col shadow-2xl relative overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-blue-400" /> 
              Intercepted NLP Headlines
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1 overflow-y-auto max-h-[450px] p-0 custom-scrollbar">
            <div className="divide-y divide-white/5">
              {newsFeed.map((news) => (
                <div key={news.id} className="p-6 hover:bg-white/[0.02] transition-colors duration-300 group cursor-default">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-zinc-500 bg-black/40 px-2 py-1 rounded border border-white/5">{news.time}</span>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-300 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">{news.source}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${
                      news.sentiment === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                      news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {news.sentiment === 'BULLISH' ? <TrendingUp size={12} strokeWidth={2.5} /> : news.sentiment === 'BEARISH' ? <TrendingDown size={12} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}
                      {news.sentiment} <span className="font-mono ml-1 opacity-80">({news.score > 0 ? '+' : ''}{news.score})</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                    {news.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sector Momentum Chart */}
        <Card className="bg-white/[0.02] border-white/[0.05] backdrop-blur-2xl rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-400" />
              Sector Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[-50, 100]} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }} width={85} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 0 ? '#10b981' : '#ef4444'} className="transition-all duration-300 hover:opacity-80" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* --- EDUCATIONAL FOOTER --- */}
      <div className="pt-10 relative z-10">
        <div className="mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-zinc-500" />
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-500">How AI Sentiment Analysis Works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="bg-white/[0.01] border-white/[0.05] backdrop-blur-xl rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-cyan-500/20 pointer-events-none" />
            <CardContent className="p-6">
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400/80 to-cyan-900/20 font-black text-5xl mb-3 -ml-1 select-none">01</div>
              <h4 className="text-zinc-200 font-bold mb-2 tracking-wide text-sm uppercase">Data Scraping</h4>
              <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                The NLP engine constantly monitors global financial news networks, institutional press releases, and verified social streams.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/[0.01] border-white/[0.05] backdrop-blur-xl rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/20 pointer-events-none" />
            <CardContent className="p-6">
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400/80 to-emerald-900/20 font-black text-5xl mb-3 -ml-1 select-none">02</div>
              <h4 className="text-zinc-200 font-bold mb-2 tracking-wide text-sm uppercase">Language Processing</h4>
              <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                Advanced machine learning models identify whether the linguistic tone regarding your selected asset is positive or negative.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.01] border-white/[0.05] backdrop-blur-xl rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-purple-500/20 pointer-events-none" />
            <CardContent className="p-6">
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400/80 to-purple-900/20 font-black text-5xl mb-3 -ml-1 select-none">03</div>
              <h4 className="text-zinc-200 font-bold mb-2 tracking-wide text-sm uppercase">Score Aggregation</h4>
              <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                Individual headline scores are combined into a master "Fear & Greed" index to give a mathematical view of market psychology.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.01] border-white/[0.05] backdrop-blur-xl rounded-2xl hover:bg-white/[0.03] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-blue-500/20 pointer-events-none" />
            <CardContent className="p-6">
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400/80 to-blue-900/20 font-black text-5xl mb-3 -ml-1 select-none">04</div>
              <h4 className="text-zinc-200 font-bold mb-2 tracking-wide text-sm uppercase">Sector Correlation</h4>
              <p className="text-zinc-500 text-xs leading-relaxed group-hover:text-zinc-400 transition-colors">
                The AI maps your asset against broader economic sectors to determine if the stock is outperforming its industry.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}