import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import StylistChat from '@/components/StylistChat';
import { Sparkles, ArrowRight, MessageSquare, Zap, Brain, Heart } from 'lucide-react';

const capabilities = [
  { icon: Brain, title: 'Knows Your Wardrobe', desc: 'Every suggestion is based on what you actually own — not generic advice.' },
  { icon: Zap, title: 'Instant Answers', desc: 'No waiting. Real-time responses to any styling question, 24/7.' },
  { icon: Heart, title: 'Learns Your Taste', desc: 'The more you chat, the better it understands your aesthetic preferences.' },
  { icon: MessageSquare, title: 'Any Occasion', desc: 'Date night, job interview, vacation, rooftop party — just describe the event.' },
];

const samplePrompts = [
  'What should I wear to a casual Friday at a creative agency?',
  'Help me build 5 outfits from my existing wardrobe for a week in Paris.',
  'Which items in my wardrobe are underused?',
  'What\'s one item I should buy to unlock the most new combinations?',
  'I have a black-tie event in 2 weeks. What do I need?',
  'Style me for a beach wedding in Santorini.',
];

export default function Chat() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="pt-40 pb-12 relative">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-foreground leading-tight mb-6">
              Your Personal Stylist, <br /><span className="italic text-gradient-gold">24/7.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl mx-auto">
              Context-aware styling advice based on your exact wardrobe, your body type, your preferences — and wherever you're going next.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-10 bg-secondary/20 border-y border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <cap.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-sm mb-1">{cap.title}</h3>
                <p className="text-xs text-muted-foreground font-accent leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <StylistChat />
        </div>
      </section>

      {/* Sample Prompts */}
      <section className="py-16 bg-secondary/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-serif mb-2 text-center">Try Asking...</h2>
          <p className="text-muted-foreground font-accent text-sm text-center mb-8">Click any prompt to use it</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {samplePrompts.map((prompt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ x: 4 }}
                className="glass-panel p-4 rounded-xl text-left text-sm font-accent text-foreground hover:border-primary/40 hover:text-primary transition-all flex items-start gap-3 group"
              >
                <span className="text-primary flex-shrink-0 mt-0.5">→</span>
                <span>"{prompt}"</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1209] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Better advice starts with your wardrobe</h2>
          <p className="text-white/60 font-accent mb-8">Upload your clothes so your AI stylist knows exactly what you're working with.</p>
          <Link href="/upload" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-accent font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Upload Your Wardrobe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
