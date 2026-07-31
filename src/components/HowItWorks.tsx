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
    <section id="how-it-works" className="scroll-mt-18 py-30">
      <Container>
        <h2 className="sr-only">How it works</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-12 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants} className="text-center">
              <p className="font-serif text-h2 text-gold-primary">{step.number}</p>
              <h3 className="mt-4 font-sans text-h5 font-semibold text-espresso">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[38ch] text-body leading-[1.65] text-espresso-light">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
