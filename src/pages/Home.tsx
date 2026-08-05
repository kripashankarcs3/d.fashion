import Hero from '@/components/Hero';
import LogoBar from '@/components/LogoBar';
import ProblemStrip from '@/components/ProblemStrip';
import ProblemSection from '@/components/ProblemSection';
import HowItWorks from '@/components/HowItWorks';
import ScienceSection from '@/components/ScienceSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import SampleReportSection from '@/components/SampleReportSection';
import ColourSeasonExplorer from '@/components/ColourSeasonExplorer';
import SocialProof from '@/components/SocialProof';
import TryOnPreview from '@/components/TryOnPreview';
import ComparisonSection from '@/components/ComparisonSection';
import PricingTeaser from '@/components/PricingTeaser';
import FaqSection from '@/components/FaqSection';
import FinalCTA from '@/components/FinalCTA';
import { ResumeAnalysisBanner } from '@/components/ResumeAnalysisBanner';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <ResumeAnalysisBanner />
      <LogoBar />
      <ProblemStrip />
      <ProblemSection />
      <HowItWorks />
      <ScienceSection />
      <FeatureShowcase />
      <SampleReportSection />
      <ColourSeasonExplorer />
      <SocialProof />
      <TryOnPreview />
      <ComparisonSection />
      <PricingTeaser />
      <FaqSection />
      <FinalCTA />
    </div>
  );
}
