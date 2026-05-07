'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import UrgentRecruitment from '@/components/UrgentRecruitment/UrgentRecruitment';
import QuickNearbyJobs from '@/components/QuickNearbyJobs/QuickNearbyJobs';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';
import Process from '@/components/Process/Process';
import MoCulAssistant from '@/components/MoCulAssistant/MoCulAssistant';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div className="page-container">
      <Navbar isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} />
      
      <Hero isLoggedIn={isLoggedIn} />
      
      {isLoggedIn ? (
        <>
          {/* Dashboard View (Auth) */}
          <UrgentRecruitment />
          <QuickNearbyJobs />
        </>
      ) : (
        <>
          {/* Landing View (Guest) */}
          <UrgentRecruitment />
          <Features />
          <Process />
        </>
      )}
      
      <Footer />

      {/* Floating AI Assistant (현장 반장) */}
      <MoCulAssistant />
    </div>
  );
}
