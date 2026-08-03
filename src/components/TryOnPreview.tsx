import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import { useStyleStore } from '@/store/useStyleStore';
import { getSeasonInfo } from '@/lib/colour-data';

const FALLBACK_PALETTE = [
  { hex: '#B8974A', name: 'Antique Gold' },
  { hex: '#8B3A2A', name: 'Burnt Sienna' },
  { hex: '#2C1810', name: 'Espresso' },
  { hex: '#6B4F3A', name: 'Toffee' },
  { hex: '#B4523A', name: 'Terra Cotta' },
  { hex: '#3E6B5E', name: 'Eucalyptus' },
];

const BlazerSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 250" className="mx-auto h-64 w-52 transition-colors duration-500" style={{ color }}>
    <path d="M30 80 C 30 70, 50 65, 75 60 L 75 250 L 30 250 Z" fill="currentColor" opacity="0.9" />
    <path d="M170 80 C 170 70, 150 65, 125 60 L 125 250 L 170 250 Z" fill="currentColor" opacity="0.9" />
    <path d="M75 60 L 100 85 L 125 60 L 125 250 L 75 250 Z" fill="currentColor" opacity="0.85" />
    <path d="M60 40 L 75 60 L 100 85 L 75 140 L 60 40 Z" fill="#ffffff" opacity="0.12" />
    <path d="M140 40 L 125 60 L 100 85 L 125 140 L 140 40 Z" fill="#ffffff" opacity="0.12" />
    <path d="M60 40 L 75 60 L 100 85 L 125 60 L 140 40" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M75 60 L 75 250" stroke="#2C1810" strokeWidth="1.5" opacity="0.3" />
    <path d="M125 60 L 125 250" stroke="#2C1810" strokeWidth="1.5" opacity="0.3" />
    <path d="M100 85 L 100 250" stroke="#2C1810" strokeWidth="2" strokeDasharray="4 4" opacity="0.35" />
    <circle cx="88" cy="150" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="112" cy="150" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="88" cy="180" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="112" cy="180" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
  </svg>
);

export default function TryOnPreview() {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const palette = analysisResult
    ? getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone).palette.map((c) => ({ hex: c.hex, name: c.name }))
    : FALLBACK_PALETTE;

  const [activeHex, setActiveHex] = useState(palette[0].hex);
  const activeColour = palette.find((c) => c.hex === activeHex) ?? palette[0];

  return (
    <section className="relative overflow-hidden bg-surface-0 py-section-xl">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-gold-primary/[0.04] blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-gold-light/10 blur-[100px]" />

      <EditorialContainer className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0, 0, 0.2, 1] }}
          >
            <EyebrowLabel rule tone="inverse">Try-On Studio</EyebrowLabel>

            <EditorialHeading as="h2" size="xl" tone="inverse" className="mt-5">
              See your palette <Emphasis>on you.</Emphasis>
            </EditorialHeading>

            <p className="mt-6 max-w-md text-lede font-light leading-relaxed text-cream-primary/70">
              Preview outfits, makeup looks, and hairstyles rendered in the exact colours from your analysis — before you commit to the mirror.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/try-on" className="btn-campaign">
                Try It On →
              </Link>
              <Link
                href="/upload"
                className="eyebrow text-cream-primary/45 transition-colors hover:text-cream-primary/70"
              >
                Upload first to personalise
              </Link>
            </div>
          </motion.div>

          {/* Right: Interactive card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0, 0, 0.2, 1] }}
            className="mx-auto w-full max-w-[360px]"
          >
            {/* Card — dark frosted */}
            <div className="relative overflow-hidden rounded-sm border border-gold-hairline bg-gold-primary/[0.03] backdrop-blur-md aspect-[4/5] flex flex-col justify-between p-6">
              {/* Radial bg */}
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_75%)]" />

              {/* Garment */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BlazerSvg color={activeColour.hex} />
              </div>

              {/* Top badge */}
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-hairline bg-surface-3/80 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cream-primary/80 backdrop-blur-md">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    aria-hidden
                    style={{ willChange: 'opacity' }}
                    className="h-1.5 w-1.5 rounded-full bg-gold-light"
                  />
                  Interactive Preview
                </span>
              </div>

              {/* Bottom colour info */}
              <div className="relative z-10 rounded-sm border border-gold-hairline bg-surface-4/80 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-serif text-h5 text-cream-primary">{activeColour.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-cream-primary/45">{activeColour.hex}</p>
                  </div>
                  <div className="h-10 w-10 rounded-sm border border-gold-hairline" style={{ backgroundColor: activeColour.hex }} />
                </div>
              </div>
            </div>

            {/* Swatch picker — rounded squares on dark */}
            <div className="mt-5">
              <p className="mb-3 text-caption uppercase tracking-label text-cream-primary/40">Pick a colour</p>
              <div className="flex flex-wrap gap-3">
                {palette.slice(0, 6).map((colour) => (
                  <button
                    key={colour.hex + colour.name}
                    type="button"
                    onClick={() => setActiveHex(colour.hex)}
                    aria-label={`Preview ${colour.name}`}
                    aria-pressed={activeHex === colour.hex}
                    className={`h-10 w-10 rounded-md border transition-all duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary ${
                      activeHex === colour.hex
                        ? 'scale-110 border-gold-primary ring-1 ring-gold-primary/60'
                        : 'border-gold-hairline opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: colour.hex }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </EditorialContainer>
    </section>
  );
}
