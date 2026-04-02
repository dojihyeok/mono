import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import QuickNearbyJobs from '@/components/QuickNearbyJobs/QuickNearbyJobs';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';

import Process from '@/components/Process/Process';

export default function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <Hero />
      <QuickNearbyJobs />
      <Features />
      <Process />
      <Footer />
    </div>
  );
}
