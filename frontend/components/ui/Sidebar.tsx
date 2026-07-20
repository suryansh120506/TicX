"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Cpu, LineChart, Menu, X, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Live Terminal", href: "/", icon: <Activity size={18} /> },
    { name: "Robo-Advisor", href: "/robo-advisor", icon: <Cpu size={18} /> },
    { name: "Market Pulse", href: "/pulse", icon: <LineChart size={18} /> },
  ];

  const SidebarContent = () => (
    <>
      {/* --- AMBER GLOW & GEOMETRIC SHARD LOGO --- */}
      <div className="h-[120px] flex items-center justify-between px-6 border-b border-slate-800/60 relative overflow-hidden group cursor-default">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          {/* Geometric Shard Emblem */}
          <div className="relative h-12 w-12 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.1)] rounded-lg bg-slate-900/50 border border-slate-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-40" />
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]">
              <path d="M12 2L3 14l9 8 9-8-9-10z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
              <path d="M3 14l9-4 9 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
            </svg>
          </div>

          {/* ANIMATED TYPOGRAPHIC NAME (Updated to Ticx) */}
          <div className="flex flex-col pt-1">
            <h2 className="text-4xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-md">
              Tic<span className="inline-block text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]">x</span>
            </h2>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase mt-1.5">
              Data Engine
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-sm border border-transparent hover:border-slate-800 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        <div className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-600 mb-4 px-2 uppercase">
          Trading Suite
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-3.5 rounded-sm transition-all duration-300 group ${
                isActive 
                  ? "bg-slate-900 border border-slate-800 text-white shadow-[inset_2px_0_0_0_#f59e0b]" 
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}>
                <div className={`${isActive ? "text-amber-500" : "text-slate-500 group-hover:text-zinc-400"}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold tracking-wide">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- SECURE DISCONNECT (Sign Out) --- */}
      <div className="p-4 border-t border-slate-800/60">
        <SignOutButton redirectUrl="/sign-in">
          <button className="flex items-center justify-between w-full px-4 py-3 rounded-sm bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 group shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-mono tracking-widest uppercase text-red-500/70 group-hover:text-red-400">Secure Session</span>
              <span className="text-sm font-bold tracking-wide uppercase">Disconnect</span>
            </div>
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </SignOutButton>
      </div>
    </>
  );

  return (
    <>
      {/* 1. MOBILE FLOATING TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#030405] border-b border-slate-800/60 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2">
          {/* ANIMATED MOBILE TYPOGRAPHY */}
          <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Tic<span className="inline-block text-amber-500 animate-pulse">x</span>
          </span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="text-slate-400 hover:text-white p-2 border border-slate-800/80 rounded-sm bg-slate-900/30"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 2. DESKTOP PERMANENT SIDEBAR */}
      <aside className="hidden md:flex w-[280px] bg-[#030405] border-r border-slate-800/60 h-full flex-col shrink-0 relative z-50">
        <SidebarContent />
      </aside>

      {/* 3. MOBILE SLIDING DRAWER OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-[#030405] border-r border-slate-800/60 h-full flex flex-col z-50 transform transition-transform duration-300 md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <SidebarContent />
      </aside>
    </>
  );
}