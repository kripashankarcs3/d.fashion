import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';

const columns = ["", "D'Fashion", "Professional Appointment", "Guessing"] as const;

const rows: [string, string, string, string][] = [
  ["Price",        "From ₹299",                "₹3,000–₹8,000",         "Free... for now"],
  ["Time needed",  "~3 minutes",               "2–4 hours",              "Every morning"],
  ["Works remotely","Yes",                     "In-person only",         "—"],
  ["Repeatable",   "Anytime",                  "Book again",             "Never consistent"],
  ["What you get", "Full report + palette",    "Notes, maybe a sheet",   "A vague impression"],
  ["Accuracy",     "AI-measured, objective",   "Varies by consultant",   "Subjective"],
];

export default function ComparisonSection() {
  return (
    <section className="bg-surface-2 py-section-xl">
      <EditorialContainer>
        {/* Header copy */}
        <div className="mb-12 max-w-2xl">
          <EyebrowLabel tone="gold" rule>The Case for D&apos;Fashion</EyebrowLabel>

          <EditorialHeading as="h2" size="xl" tone="inverse" className="mt-5">
            Better than guessing.{' '}
            <Emphasis>Better than an appointment.</Emphasis>
          </EditorialHeading>

          <p className="mt-5 text-lede font-light leading-relaxed text-cream-primary/65">
            See how D&apos;Fashion compares on every dimension that matters.
          </p>
        </div>

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-x-auto rounded-sm border border-gold-hairline/40"
        >
          {/* Inner grid — min-width prevents squishing on mobile */}
          <div className="min-w-[640px] grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr]">

            {/* ── Header row ── */}
            <div className="contents">
              {/* Empty first header cell */}
              <div className="bg-surface-3 border-b border-gold-primary/30 px-5 py-4" />

              {/* D'Fashion header — highlighted */}
              <div className="bg-surface-3 border-b border-gold-primary/30 border-x border-x-gold-hairline/60 px-5 py-4">
                <span className="text-gold-primary font-semibold text-body-sm tracking-wide">
                  D&apos;Fashion
                </span>
              </div>

              {/* Professional Appointment header */}
              <div className="bg-surface-3 border-b border-gold-primary/30 px-5 py-4">
                <span className="text-cream-primary/50 text-body-sm font-medium">
                  Professional Appointment
                </span>
              </div>

              {/* Guessing header */}
              <div className="bg-surface-3 border-b border-gold-primary/30 px-5 py-4">
                <span className="text-cream-primary/50 text-body-sm font-medium">
                  Guessing
                </span>
              </div>
            </div>

            {/* ── Data rows ── */}
            {rows.map(([label, dfashion, professional, guessing], idx) => {
              const isLast = idx === rows.length - 1;
              const borderClass = isLast ? '' : 'border-b border-gold-hairline/40';

              return (
                <div key={label} className="contents">
                  {/* Row label */}
                  <div className={`${borderClass} py-4 pr-4 pl-5`}>
                    <span className="font-editorial text-body text-cream-primary/80">
                      {label}
                    </span>
                  </div>

                  {/* D'Fashion value — highlighted column */}
                  <div
                    className={`${borderClass} bg-gold-primary/[0.03] border-x border-x-gold-hairline/60 py-4 px-4`}
                  >
                    <span className="text-cream-primary font-medium text-body-sm">
                      {dfashion}
                    </span>
                  </div>

                  {/* Professional value */}
                  <div className={`${borderClass} py-4 px-4`}>
                    <span className="text-cream-primary/55 text-body-sm">
                      {professional}
                    </span>
                  </div>

                  {/* Guessing value */}
                  <div className={`${borderClass} py-4 px-4`}>
                    <span className="text-cream-primary/55 text-body-sm">
                      {guessing}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Caption */}
        <p className="text-caption text-cream-primary/35 mt-4">
          Price comparison based on Mumbai market rate for professional colour consultation, 2024.
        </p>
      </EditorialContainer>
    </section>
  );
}
