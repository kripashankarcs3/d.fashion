import { useEffect } from 'react';
import Hero from '@/components/Hero';
import ProblemStrip from '@/components/ProblemStrip';
import HowItWorks from '@/components/HowItWorks';
import FeatureShowcase from '@/components/FeatureShowcase';
import SocialProof from '@/components/SocialProof';
import FinalCTA from '@/components/FinalCTA';
import { ResumeAnalysisBanner } from '@/components/ResumeAnalysisBanner';

export default function Home() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <ResumeAnalysisBanner />
      <ProblemStrip />
      <HowItWorks />
      <FeatureShowcase />
      <SocialProof />
      <FinalCTA />
    </div>
  );
}
