"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const complianceData = [
  { time: "06:00", rate: 85 },
  { time: "07:00", rate: 92 },
  { time: "08:00", rate: 98 },
  { time: "09:00", rate: 100 },
  { time: "10:00", rate: 100 },
  { time: "11:00", rate: 100 },
  { time: "12:00", rate: 100 },
];

const escrowData = [
  { name: "삼성건설(원청)", amount: 500 },
  { name: "성우토건(1차)", amount: 350 },
  { name: "형진개발(2차)", amount: 150 },
  { name: "일용근로자", amount: 120 },
];

const mockLogs = [
  "[A-3 현장] 김*수 - 안전교육 이수증 갱신 및 홍채인증 통과",
  "[B-1 현장] 이*영 - 스마트 상해보험 일일 자동 가입 완료",
  "[A-3 현장] 박*민 - 다국어 AI 반장 안전 브리핑 수신 완료",
  "[C-2 현장] 최*호 - 에스크로 당일 일당 정산 예약 됨",
  "[B-1 현장] 정*진 - 신규 채용자 현장 안전 교육 인증 통과",
  "[A-1 현장] 장*석 - 위험성 평가서(스마트기기) 서명 완료",
];

export default function ComplianceDashboardDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [escrowAmount, setEscrowAmount] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [mockLogs[index % mockLogs.length], ...prev].slice(0, 5);
        return newLogs;
      });
      index++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const target = 124500000; 
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setEscrowAmount(target);
        clearInterval(timer);
      } else {
        setEscrowAmount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .display-font { font-family: 'Pretendard', sans-serif; }
        
        .blueprint-dark {
          background-color: #0A0F1A;
          background-image:
            linear-gradient(rgba(34,211,238,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.10) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .glass-dark {
          background: linear-gradient(180deg, rgba(10,15,26,0.92) 0%, rgba(10,15,26,0.78) 100%);
          backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%);
          border: 1px solid rgba(34,211,238,0.22); border-radius: 4px;
        }

        .lcorner { position: relative; }
        .lcorner::before, .lcorner::after {
          content: ''; position: absolute; width: 14px; height: 14px;
          border-color: rgba(34,211,238,0.55); border-style: solid;
        }
        .lcorner::before { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
        .lcorner::after  { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }

        .neo-glow-box {
          position: relative;
          background: linear-gradient(135deg, rgba(10,15,26,0.95) 0%, rgba(15,58,77,0.85) 100%);
          border: 1px solid rgba(34, 211, 238, 0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px -10px rgba(6,182,212,0.3);
        }
        
        .tape-divider { height: 6px; background: repeating-linear-gradient(135deg, #0A0F1A 0 12px, #FFD200 12px 24px); }
      `}} />

      <div className="min-h-screen blueprint-dark text-white pt-20 pb-24 px-4 sm:px-8 font-sans relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#06B6D4] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#0E7490] opacity-20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-12 border-b border-[#22D3EE]/20 pb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="lcorner px-3 py-1.5 bg-[#0E7490]/20 text-[#67E8F9] text-[11px] mono-font font-bold tracking-widest uppercase">
                <i className="fa-solid fa-satellite-dish mr-2 animate-pulse text-[#22D3EE]"></i>
                Live Admin Demo
              </span>
              <span className="text-[#67E8F9] mono-font text-xs font-semibold tracking-tight uppercase">/ MONO Compliance Matrix</span>
            </div>
            <h1 className="display-font text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CFFAFE] to-[#22D3EE]">
              안전 컴플라이언스 & 에스크로 관제망
            </h1>
            <p className="text-[#94A3B8] text-lg max-w-3xl leading-relaxed">
              중대재해처벌법 완벽 방어 및 상생 자금 집행을 위한 실시간 데이터 매트릭스. <br className="hidden md:block"/>
              원청 관리자(SI) 시점에서 모든 하청 인력의 출역/안전 데이터를 투명하게 조회합니다.
            </p>
          </motion.div>

          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* KPI 1: Safety */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="neo-glow-box lcorner p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#67E8F9] text-[11px] mono-font font-bold tracking-widest uppercase">Safety Index</p>
                <i className="fa-solid fa-shield-halved text-[#22D3EE] text-lg opacity-80"></i>
              </div>
              <h2 className="display-font text-5xl font-extrabold mb-1">
                100<span className="text-2xl text-[#22D3EE] ml-1">%</span>
              </h2>
              <div className="tape-divider mt-5 mb-4"></div>
              <p className="text-xs text-[#94A3B8] flex items-center gap-2">
                <i className="fa-solid fa-check text-[#10B981]"></i> 금일 출역 450명 안전교육 전원 이수
              </p>
            </motion.div>

            {/* KPI 2: Escrow */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-dark lcorner p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#67E8F9] text-[11px] mono-font font-bold tracking-widest uppercase">Escrow Vault</p>
                <i className="fa-solid fa-vault text-[#22D3EE] text-lg opacity-80"></i>
              </div>
              <h2 className="display-font text-4xl font-extrabold mb-1 text-white">
                <span className="text-2xl text-[#67E8F9] mr-1">₩</span>
                {escrowAmount.toLocaleString()}
              </h2>
              <div className="h-[1px] w-full bg-gradient-to-r from-[#22D3EE]/50 to-transparent my-5"></div>
              <p className="text-xs text-[#94A3B8] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                실시간 상생 자금 락업 및 결제 승인 중
              </p>
            </motion.div>

            {/* KPI 3: Risk */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-dark lcorner p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#67E8F9] text-[11px] mono-font font-bold tracking-widest uppercase">Risk Factor</p>
                <i className="fa-solid fa-triangle-exclamation text-[#10B981] text-lg opacity-80"></i>
              </div>
              <h2 className="display-font text-5xl font-extrabold mb-1 text-[#10B981]">0</h2>
              <div className="h-[1px] w-full bg-gradient-to-r from-[#10B981]/50 to-transparent my-5"></div>
              <p className="text-xs text-[#94A3B8] flex items-center gap-2">
                <i className="fa-solid fa-filter text-[#10B981]"></i> 블랙리스트/불법체류 필터링 100% 작동
              </p>
            </motion.div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="lg:col-span-8 glass-dark p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <span className="w-2 h-6 bg-[#22D3EE] inline-block"></span>
                  시간대별 실시간 컴플라이언스 율
                </h3>
                <span className="chip px-3 py-1 bg-[#0E7490]/30 text-[#67E8F9] text-xs font-mono border border-[#0E7490] rounded">LIVE UPDATE</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRateDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,15,26,0.9)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '2px', color: '#fff' }}
                      itemStyle={{ color: '#67E8F9', fontWeight: 'bold' }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
                    <Area type="monotone" dataKey="rate" stroke="#22D3EE" strokeWidth={3} fillOpacity={1} fill="url(#colorRateDark)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Real-time Ticker */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="lg:col-span-4 neo-glow-box lcorner p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#22D3EE]/20">
                <h3 className="text-sm font-bold tracking-widest uppercase mono-font text-[#67E8F9]">Verification Stream</h3>
                <i className="fa-solid fa-radar text-[#22D3EE] animate-spin-slow"></i>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col gap-3">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={log + i}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#0A0F1A]/80 border border-[#1E293B] p-3 border-l-2 border-l-[#22D3EE] flex items-start gap-3"
                    >
                      <i className="fa-solid fa-fingerprint text-[#22D3EE] mt-1 text-xs"></i>
                      <p className="text-[#94A3B8] text-[13px] leading-relaxed break-keep">{log}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-6 bg-[#0E7490]/20 border border-[#0E7490] p-4 text-center">
                <p className="text-[#67E8F9] text-[10px] uppercase font-bold mono-font tracking-widest">System Status</p>
                <p className="text-white text-xs mt-1">블록체인 분산 원장 동기화 중...</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
