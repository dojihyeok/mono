import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import UrgentRecruitment from '@/components/UrgentRecruitment/UrgentRecruitment';
import QuickNearbyJobs from '@/components/QuickNearbyJobs/QuickNearbyJobs';
import Features from '@/components/Features/Features';
import Footer from '@/components/Footer/Footer';
import Process from '@/components/Process/Process';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <Hero />
      <UrgentRecruitment />
      <QuickNearbyJobs />
      <Features />
      <Process />
      <Footer />
    </div>
  );
}
