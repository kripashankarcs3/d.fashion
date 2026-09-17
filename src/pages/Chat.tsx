import { useState } from 'react';
import { motion } from 'framer-motion';
import StylistChat from '@/components/StylistChat';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { MessageSquare, Palette, Shirt, Sparkles } from 'lucide-react';
import { BRAND } from '@/config/site';

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
    // Fixed to the viewport and never scrolls — chatting must not require
    // scrolling the page itself. Everything below fits within this one
    // screen; only the message list and the sidebar (on large screens)
    // scroll internally, the way a chat app shell does.
    <div className="relative flex h-[100svh] w-full flex-col overflow-hidden pt-20 pb-4 md:pt-24 md:pb-6">
      {/* Subtle styling ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[600px] w-[600px] rounded-full opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F3E2B3 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <EditorialContainer width="content" className="flex min-h-0 flex-1 flex-col">
        {/* Compact header — a full PageMasthead ate too much of the one
            screen this page has to work with. */}
        <div className="shrink-0 border-b border-gold-hairline pb-4 md:pb-5">
          <EyebrowLabel tone="muted">AI Stylist</EyebrowLabel>
          <EditorialHeading as="h1" size="sm" className="mt-1.5">
            Ask <Emphasis>D&rsquo;Style.</Emphasis>
          </EditorialHeading>
        </div>

        {/* Floating animated accents */}
        <div aria-hidden className="pointer-events-none absolute right-10 top-32 -z-0 hidden lg:block">
          {[
            { top: '2%', left: '0%', delay: 0 },
            { top: '55%', left: '28%', delay: 1.4 },
            { top: '20%', left: '70%', delay: 0.8 },
            { top: '85%', left: '8%', delay: 2.1 },
          ].map((p, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
              className="absolute text-gold-primary"
              style={{ top: p.top, left: p.left }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.span>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-6 md:mt-6 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          {/* Conversation */}
          <motion.div variants={itemVariants} className="flex min-h-0 flex-col">
            {/* Elegant AI Avatar header card */}
            <div className="mb-3 flex shrink-0 items-center gap-3 border border-gold-hairline/40 bg-surface-3 px-4 py-2.5 rounded-sm">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full overflow-hidden border border-gold-hairline/60">
                <motion.img
                  src="/images/campaign/model ok.png"
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover object-top"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-surface-3 bg-gold-primary"
                />
                <span
                  aria-hidden
                  className="absolute -inset-0.5 rounded-full ring-1 ring-gold-primary/20 animate-pulse"
                />
              </div>
              <div>
                <h3 className="font-editorial text-body font-light text-cream-primary leading-tight">D&rsquo;Style Stylist</h3>
                <p className="text-[0.65rem] text-gold-primary uppercase tracking-widest font-semibold mt-0.5">Online &amp; Ready</p>
              </div>
            </div>

            <StylistChat initialPrompt={activePrompt} className="flex-1" />
          </motion.div>

          {/* Quick actions — hidden below lg, where there isn't room to show
              them without pushing the chat off-screen; scrolls internally
              so it never grows the page itself. */}
          <motion.div
            variants={itemVariants}
            className="hidden min-h-0 flex-col space-y-10 overflow-y-auto scrollbar-none pr-1 lg:flex"
          >
            {/* Quick questions — hairline list, no card chrome */}
            <div className="border-b border-gold-hairline pb-6">
              <EyebrowLabel tone="muted" className="mb-4">
                Quick Questions
              </EyebrowLabel>
              <ul className="space-y-2">
                {samplePrompts.map((prompt) => (
                  <li key={prompt}>
                    <motion.button
                      type="button"
                      onClick={() => setActivePrompt(prompt)}
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-full border-b border-gold-hairline py-3 text-left text-body-sm text-cream-primary/70 transition-colors duration-200 ease-out hover:border-gold-border-hover hover:text-cream-primary"
                    >
                      &ldquo;{prompt}&rdquo;
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            {/* What D'Style Knows — minimal list */}
            <div>
              <EyebrowLabel tone="muted" className="mb-4">
                What {BRAND.stylistName} Knows
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
