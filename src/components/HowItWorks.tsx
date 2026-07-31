import { motion, type Variants } from 'framer-motion';
import Container from '@/components/Container';

const steps = [
  {
    number: '01',
    title: 'Upload Your Photo',
    description: 'A clear selfie in natural light is all you need.',
  },
  {
    number: '02',
    title: 'AI Analyses Your Colours',
    description:
      'Our model reads your skin undertone, contrast, and palette in seconds.',
  },
  {
    number: '03',
    title: 'Receive Your Style Profile',
    description:
      'Your personalised colour palette, style archetypes, and wardrobe recommendations.',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-30 relative overflow-hidden bg-cream-primary">
      {/* Background soft glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-gold-light/5 blur-[120px] -z-10" />

      <Container>
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary">
            Process
          </p>
          <h2 className="mt-4 font-serif text-h2 text-espresso">
            How It Works
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line for Timeline (Desktop) */}
          <div aria-hidden className="absolute top-[3.5rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-gold-light/10 via-gold-primary/30 to-gold-light/10 hidden md:block" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-3 relative z-10"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                whileHover="hover"
                className="group relative rounded-lg border border-border bg-white p-8 shadow-card transition-all duration-300 ease-out hover:border-gold-primary hover:shadow-card-hover text-center"
              >
                {/* Visual Step Indicator Bubble */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-primary border border-border transition-all duration-300 group-hover:bg-espresso group-hover:border-espresso">
                  <span className="font-serif text-h3 text-gold-primary transition-transform duration-300 group-hover:scale-110">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-sans text-h5 font-semibold text-espresso transition-colors duration-200 group-hover:text-gold-dark">
                  {step.title}
                </h3>
                
                <p className="mx-auto mt-4 max-w-[32ch] text-body-sm leading-[1.65] text-espresso-light">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
