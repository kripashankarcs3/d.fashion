import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import { useStyleStore } from '@/store/useStyleStore';
import { getSeasonInfo } from '@/lib/colour-data';
import { ROUTES } from '@/config/navigation';

const FALLBACK_PALETTE = [
  { hex: '#B8974A', name: 'Antique Gold' },
  { hex: '#8B3A2A', name: 'Burnt Sienna' },
  { hex: '#2C1810', name: 'Espresso' },
  { hex: '#6B4F3A', name: 'Toffee' },
  { hex: '#B4523A', name: 'Terra Cotta' },
  { hex: '#3E6B5E', name: 'Eucalyptus' },
];

function GarmentDisplay({ color }: { color: string }) {
  return (
    <div className="relative mx-auto flex h-64 w-52 flex-col overflow-hidden rounded-sm">
      {/* Main garment body — colour block */}
      <div
        className="flex-1 transition-colors duration-500"
        style={{ backgroundColor: color }}
      />
      {/* Lapel shadow — adds depth without pretending to be real */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.18) 55%, transparent 55%)`,
        }}
        aria-hidden
      />
      {/* Collar notch */}
      <div
        className="absolute left-1/2 top-0 h-12 w-0.5 -translate-x-1/2 bg-black/20"
        aria-hidden
      />
      {/* Garment label at bottom */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center">
        <span className="rounded-sm bg-black/30 px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
          Classic Blazer
        </span>
      </div>
    </div>
  );
}

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
              <Link href={ROUTES.tryOn} className="btn-campaign">
                Try It On →
              </Link>
              <Link
                href={ROUTES.upload}
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
            className="mx-auto w-full max-w-[22.5rem]"
          >
            {/* Card — dark frosted */}
            <div className="relative overflow-hidden rounded-sm border border-gold-hairline bg-gold-primary/[0.03] backdrop-blur-md aspect-[4/5] flex flex-col justify-between p-6">
              {/* Radial bg */}
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_75%)]" />

              {/* Garment */}
              <div className="absolute inset-0 flex items-center justify-center">
                <GarmentDisplay color={activeColour.hex} />
              </div>

              {/* Top badge */}
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-hairline bg-surface-3/80 px-3.5 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] backdrop-blur-md">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-light" />
                  <span className="animate-gold-shimmer">Interactive Preview</span>
                </span>
              </div>

              {/* Bottom colour info */}
              <div className="relative z-10 rounded-sm border border-gold-hairline bg-surface-4/80 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-cream-primary/45 mb-1">Classic Blazer</p>
                    <p className="font-serif text-h5 text-cream-primary">{activeColour.name}</p>
                    <p className="mt-0.5 font-mono text-[0.625rem] text-cream-primary/45">{activeColour.hex}</p>
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

            <div className="mt-6 border-t border-gold-hairline pt-5">
              <Link
                href={ROUTES.upload}
                className="eyebrow flex items-center gap-2 text-gold-primary/70 transition-colors hover:text-gold-primary"
              >
                <span className="h-px w-4 bg-current" aria-hidden />
                Try on your own photo
              </Link>
            </div>
          </motion.div>
        </div>
      </EditorialContainer>
    </section>
  );
}
