import { motion } from 'framer-motion';
import { Link } from 'wouter';
import CampaignSection from '@/components/editorial/CampaignSection';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import { CAMPAIGN } from '@/lib/editorial-images';

const easeOut = [0, 0, 0.2, 1] as const;

const PALETTE_PREVIEW = ['#C19A6B', '#B8974A', '#3E6B5E', '#8B4513', '#D4AF71'];

export default function FinalCTA() {
  return (
    <CampaignSection
      src={CAMPAIGN.closing.src}
      alt={CAMPAIGN.closing.alt}
      position={CAMPAIGN.closing.position}
      anchor="center"
      scrim="soft"
      height="tall"
      contentClassName="text-center"
    >
      {/* Palette row of dots */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="mb-8 flex justify-center gap-3"
      >
        {PALETTE_PREVIEW.map((hex, i) => (
          <motion.div
            key={hex}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: easeOut }}
            className="h-4 w-4 rounded-full border border-gold-hairline"
            style={{ backgroundColor: hex }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: easeOut }}
      >
        <EditorialHeading as="h2" size="xl" tone="inverse">
          Your colours <Emphasis>are waiting.</Emphasis>
        </EditorialHeading>

        <p className="mt-5 text-lede font-light text-cream-primary/60">
          No credit card. Results in under 60 seconds.
        </p>

        <Link href="/upload" className="btn-campaign mt-10">
          Start for Free →
        </Link>
      </motion.div>
    </CampaignSection>
  );
}
