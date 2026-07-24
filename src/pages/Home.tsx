import { useEffect } from 'react';
import Hero from '@/components/Hero';
import TrustedBy from '@/components/TrustedBy';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import CTABanner from '@/components/CTABanner';

export default function Home() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <TrustedBy />
      <Features />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
