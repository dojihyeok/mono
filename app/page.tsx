'use client';

import React from 'react';
import Hero from '@/components/Hero/Hero';
import UrgentRecruitment from '@/components/UrgentRecruitment/UrgentRecruitment';
import QuickNearbyJobs from '@/components/QuickNearbyJobs/QuickNearbyJobs';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';
import Process from '@/components/Process/Process';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="page-container">
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
          <Features />
          <Process />
        </>
      )}
      
      <Footer />
    </div>
  );
}
