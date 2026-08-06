import { useState } from 'react';
import { motion } from 'framer-motion';
import StylistChat from '@/components/StylistChat';
import PageMasthead from '@/components/editorial/PageMasthead';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { MessageSquare, Palette, Shirt, Sparkles } from 'lucide-react';

const samplePrompts = [
  'What should I wear to a casual Friday at a creative agency?',
  'Help me build 5 outfits for a week in Paris from my palette.',
  'Which of my saved looks are underused?',
  "What's one item I should add to unlock the most new combinations?",
  'Style me for a beach wedding in Santorini.',
];

const knowledge = [
  {
    icon: Palette,
    title: 'Your colour season',
    description: 'Every suggestion starts from your personal palette.',
  },
  {
    icon: Shirt,
    title: 'Your saved looks',
    description: 'It references the outfits you have already saved.',
  },
  {
    icon: MessageSquare,
    title: 'Any occasion',
    description: 'Date night, interview, vacation — just describe the event.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Chat() {
  const [activePrompt, setActivePrompt] = useState('');

  return (
    <div className="w-full pt-28 pb-24 relative overflow-hidden">
      {/* Subtle styling ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[600px] w-[600px] rounded-full opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F3E2B3 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <EditorialContainer width="content">
        <PageMasthead
          label="AI Stylist"
          title={
            <>
              Ask <Emphasis>D&rsquo;Style.</Emphasis>
            </>
          }
          lede="A knowledgeable, warm stylist who knows your colour season and your wardrobe."
          className="pb-0"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
        >
          {/* Conversation */}
          <motion.div variants={itemVariants} className="relative">
            {/* Elegant AI Avatar header card */}
            <div className="mb-4 flex items-center gap-3 border border-gold-hairline/40 bg-surface-3 px-4 py-3 rounded-sm">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-primary/10 text-gold-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-primary/20 to-transparent animate-pulse" />
                <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h3 className="font-editorial text-body font-light text-cream-primary leading-tight">D&rsquo;Style Stylist</h3>
                <p className="text-[0.65rem] text-gold-primary uppercase tracking-widest font-semibold mt-0.5">Online &amp; Ready</p>
              </div>
            </div>
            
            <StylistChat initialPrompt={activePrompt} />
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={itemVariants} className="space-y-12">
            {/* Quick questions — hairline list, no card chrome */}
            <div className="border-b border-gold-hairline pb-8">
              <EyebrowLabel tone="muted" className="mb-4">
                Quick Questions
              </EyebrowLabel>
              <ul className="space-y-2">
                {samplePrompts.map((prompt) => (
                  <li key={prompt}>
                    <button
                      type="button"
                      onClick={() => setActivePrompt(prompt)}
                      className="w-full border-b border-gold-hairline py-3 text-left text-body-sm text-cream-primary/70 transition-colors duration-200 ease-out hover:border-gold-border-hover hover:text-cream-primary"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* What D'Style Knows — minimal list */}
            <div>
              <EyebrowLabel tone="muted" className="mb-4">
                What D&rsquo;Style Knows
              </EyebrowLabel>
              <ul className="space-y-5">
                {knowledge.map((item) => (
                  <li key={item.title} className="flex gap-3 border-b border-gold-hairline pb-5 last:border-b-0 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-surface-4 text-gold-primary"
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-body-sm font-medium text-cream-primary">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-caption text-cream-primary/55">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </EditorialContainer>
    </div>
  );
}

