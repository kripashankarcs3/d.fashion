import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shirt } from 'lucide-react';
import { Link } from 'wouter';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
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
  <svg
    viewBox="0 0 200 250"
    className="mx-auto h-72 w-56 transition-colors duration-500 ease-out"
    style={{ color }}
  >
    {/* Body structure filled with active color */}
    <path
      d="M30 80 C 30 70, 50 65, 75 60 L 75 250 L 30 250 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M170 80 C 170 70, 150 65, 125 60 L 125 250 L 170 250 Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M75 60 L 100 85 L 125 60 L 125 250 L 75 250 Z"
      fill="currentColor"
      opacity="0.85"
    />
    {/* Lapels */}
    <path
      d="M60 40 L 75 60 L 100 85 L 75 140 L 60 40 Z"
      fill="#ffffff"
      opacity="0.15"
    />
    <path
      d="M140 40 L 125 60 L 100 85 L 125 140 L 140 40 Z"
      fill="#ffffff"
      opacity="0.15"
    />
    {/* Shadow lines and collar lines */}
    <path d="M60 40 L 75 60 L 100 85 L 125 60 L 140 40" stroke="#2C1810" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M75 60 L 75 250" stroke="#2C1810" strokeWidth="1.5" opacity="0.3" />
    <path d="M125 60 L 125 250" stroke="#2C1810" strokeWidth="1.5" opacity="0.3" />
    <path d="M100 85 L 100 250" stroke="#2C1810" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
    {/* Buttons */}
    <circle cx="88" cy="150" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="112" cy="150" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="88" cy="180" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
    <circle cx="112" cy="180" r="4" fill="#B8974A" stroke="#2C1810" strokeWidth="1" />
  </svg>
);

export default function TryOnPreview() {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const palette = analysisResult
    ? getSeasonInfo(
        analysisResult.colourSeason,
        analysisResult.colorProfile.undertone,
      ).palette.map((c) => ({ hex: c.hex, name: c.name }))
    : FALLBACK_PALETTE;

  const [activeHex, setActiveHex] = useState(palette[0].hex);
  const activeColour = palette.find((c) => c.hex === activeHex) ?? palette[0];

  return (
    <section className="py-30">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
              Try-On Studio
            </p>
            <h2 className="mt-4 font-serif text-[length:var(--text-h2)] text-espresso">
              See your palette on you.
            </h2>
            <p className="mt-4 max-w-md text-[length:var(--text-body)] text-espresso-light">
              Preview outfits, makeup looks, and hairstyles rendered in the
              colours from your analysis — before you commit to the mirror.
            </p>
            <div className="mt-8">
              <Link href="/try-on">
                <Button size="lg">
                  <Shirt aria-hidden="true" />
                  Try It On
                  <ArrowRight aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="relative">
              <div
                className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-cream-dark border border-border shadow-card flex flex-col justify-between p-6 relative"
              >
                {/* Visual Garment Try-On Container */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_80%)]" />
                  <BlazerSvg color={activeColour.hex} />
                </div>

                <div className="flex h-full flex-col justify-between relative z-10 pointer-events-none">
                  <span className="self-start rounded-sm bg-cream-primary/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-espresso shadow-sm">
                    Interactive Preview
                  </span>
                  <div className="rounded-md bg-cream-primary/95 p-4 shadow-sm border border-border/40">
                    <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                      {activeColour.name}
                    </p>
                    <p className="mt-0.5 text-[length:var(--text-micro)] tabular-nums text-espresso-muted font-mono">
                      {activeColour.hex}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[length:var(--text-body-sm)] text-espresso-light">
              Pick a colour to preview
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {palette.slice(0, 6).map((colour) => (
                <button
                  key={colour.hex + colour.name}
                  type="button"
                  onClick={() => setActiveHex(colour.hex)}
                  aria-label={`Preview ${colour.name}`}
                  aria-pressed={activeHex === colour.hex}
                  className={`h-11 w-11 rounded-md shadow-[var(--shadow-swatch)] transition-transform duration-200 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary ${
                    activeHex === colour.hex
                      ? 'ring-2 ring-gold-primary ring-offset-2 ring-offset-cream-primary'
                      : ''
                  }`}
                  style={{ backgroundColor: colour.hex }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
