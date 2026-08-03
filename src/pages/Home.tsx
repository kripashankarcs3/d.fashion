import Hero from '@/components/Hero';
import ProblemStrip from '@/components/ProblemStrip';
import HowItWorks from '@/components/HowItWorks';
import FeatureShowcase from '@/components/FeatureShowcase';
import SocialProof from '@/components/SocialProof';
import TryOnPreview from '@/components/TryOnPreview';
import PricingTeaser from '@/components/PricingTeaser';
import FinalCTA from '@/components/FinalCTA';
import { ResumeAnalysisBanner } from '@/components/ResumeAnalysisBanner';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <ResumeAnalysisBanner />
      <ProblemStrip />
      <HowItWorks />
      <FeatureShowcase />
      <SocialProof />
      <TryOnPreview />
      <PricingTeaser />
      <FinalCTA />
    </div>
  );
}
