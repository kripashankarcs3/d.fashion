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
            <div>
              <div
                className="aspect-[4/5] w-full overflow-hidden rounded-lg shadow-card transition-colors duration-500 ease-out"
                style={{ backgroundColor: activeColour.hex }}
              >
                <div className="flex h-full flex-col justify-between p-6">
                  <span className="self-start rounded-sm bg-cream-primary/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-espresso">
                    Look preview
                  </span>
                  <div className="rounded-md bg-cream-primary/90 p-4">
                    <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                      {activeColour.name}
                    </p>
                    <p className="mt-0.5 text-[length:var(--text-micro)] tabular-nums text-espresso-muted">
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
