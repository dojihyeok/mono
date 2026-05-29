"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Fake Data for Charts
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
  { name: "일용근로자(종착)", amount: 120 },
];

const mockLogs = [
  "[A-3 현장] 김*수 - 안전교육 이수증 갱신 및 홍채인증 통과 (100%)",
  "[B-1 현장] 이*영 - 스마트 상해보험 일일 자동 가입 완료 (증권번호 발행)",
  "[A-3 현장] 박*민 - 다국어 AI 반장 안전 브리핑 (베트남어) 수신 확인",
  "[C-2 현장] 최*호 - 에스크로 당일 일당 정산 예약 완료",
  "[B-1 현장] 정*진 - 신규 채용자 현장 안전 교육 (TBM) 인증 스냅샷 등록",
  "[A-1 현장] 장*석 - 위험성 평가서(스마트기기) 서명 완료",
];

export default function ComplianceDashboardDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [escrowAmount, setEscrowAmount] = useState(0);

  // Simulate real-time log ticking
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [mockLogs[index % mockLogs.length], ...prev].slice(0, 5);
        return newLogs;
      });
      index++;
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Simulate counter animation
  useEffect(() => {
    const duration = 2000;
    const target = 124500000; // 1.245억
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
    <div className="min-h-screen bg-[#F4EFE6] text-[#0A0F1A] font-sans pt-20 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 border-b border-[#0A0F1A]/10 pb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-[#0E7490] text-[#F4EFE6] text-xs font-mono font-bold tracking-wider rounded-sm">SI DEMO</span>
            <span className="text-[#0E7490] font-mono text-sm font-semibold tracking-tight">MONO LIVE DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">현장 컴플라이언스 & 에스크로 관제</h1>
          <p className="text-[#475569] mt-3 text-lg font-medium">중대재해처벌법 완벽 방어 및 상생 자금 집행 현황 (실시간)</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#0A0F1A] text-white p-6 border-l-4 border-[#22D3EE] shadow-lg rounded-sm relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#22D3EE]/10 rounded-full blur-xl"></div>
            <p className="text-[#67E8F9] text-xs font-mono font-bold mb-2 tracking-wider">법정 안전교육 이수율</p>
            <h2 className="text-4xl font-extrabold mb-1">100<span className="text-xl text-[#22D3EE]">%</span></h2>
            <p className="text-sm text-[#94A3B8] border-t border-white/10 pt-2 mt-3">금일 출역 인원 450명 전원 수료 인증 완료</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white p-6 border border-[#0A0F1A]/10 shadow-sm rounded-sm"
          >
            <p className="text-[#0E7490] text-xs font-mono font-bold mb-2 tracking-wider">투명 에스크로 상생 자금 누적</p>
            <h2 className="text-3xl font-extrabold mb-1 text-[#0A0F1A]">
              ₩ {escrowAmount.toLocaleString()}
            </h2>
            <p className="text-sm text-[#475569] border-t border-[#0A0F1A]/10 pt-2 mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              원·하청 대금 당일 직결제 연동 중
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white p-6 border border-[#0A0F1A]/10 shadow-sm rounded-sm"
          >
            <p className="text-[#0E7490] text-xs font-mono font-bold mb-2 tracking-wider">미인증 노무 리스크 지수</p>
            <h2 className="text-4xl font-extrabold mb-1 text-[#10B981]">0</h2>
            <p className="text-sm text-[#475569] border-t border-[#0A0F1A]/10 pt-2 mt-3">
              블랙리스트 및 불법 체류 필터링 100% 작동
            </p>
          </motion.div>
        </div>

        {/* Charts & Logs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts (2 columns on large screens) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white border border-[#0A0F1A]/10 p-6 rounded-sm shadow-sm"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-chart-area text-[#0E7490]"></i> 
              시간대별 컴플라이언스 준수율
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0F1A', border: 'none', borderRadius: '4px', color: '#fff' }}
                    itemStyle={{ color: '#67E8F9' }}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <Area type="monotone" dataKey="rate" stroke="#0891B2" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 border-t border-[#0A0F1A]/10 pt-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-money-bill-transfer text-[#0E7490]"></i> 
                계층별 에스크로 상생 자금 흐름 (단위: 백만원)
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={escrowData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} width={100} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0A0F1A', border: 'none', color: '#fff' }} />
                    <Bar dataKey="amount" fill="#0E7490" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Real-time Logs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-[#0A0F1A] border border-[#22D3EE]/30 p-6 rounded-sm shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <h3 className="text-white font-bold tracking-tight">LIVE VERIFICATION LOGS</h3>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981]/20">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={log + i}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-[#10172A] border border-[#1E293B] p-3 rounded-sm flex items-start gap-3"
                    >
                      <i className="fa-solid fa-shield-check text-[#22D3EE] mt-0.5 text-sm"></i>
                      <p className="text-[#94A3B8] text-sm font-mono leading-snug">{log}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-8 bg-[#0E7490]/20 border border-[#0E7490]/50 p-4 rounded-sm">
                <p className="text-[#67E8F9] text-xs font-bold font-mono tracking-wider mb-1">SYSTEM MESSAGE</p>
                <p className="text-white text-sm">원청 관리자(삼성물산)에게 모든 컴플라이언스 이력이 블록체인으로 영구 기록되고 있습니다.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
