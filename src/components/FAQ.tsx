import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "How accurate is the Virtual Try-On?",
    a: "Our proprietary neural engine maps garments in 3D, accounting for fabric drape, body measurements, and lighting. It is highly accurate for standard fits, though highly structured or stiff garments may have a small variance."
  },
  {
    q: "Do I have to photograph every item individually?",
    a: "Not necessarily. While flat lays or hanger shots yield the best pure data, our AI can extract items from photos of you wearing them. Just upload a full-body mirror selfie and it will segment the pieces."
  },
  {
    q: "Is my wardrobe data private?",
    a: "Absolutely. We employ end-to-end encryption for your images. Your wardrobe data is never used to train global models without explicit opt-in, and we never share your data with third-party retailers."
  },
  {
    q: "Can it suggest clothes I should buy?",
    a: "Yes. The AI identifies 'gaps' in your wardrobe (e.g., 'You have many formal trousers but lack versatile blazers') and can recommend specific items that would exponentially increase your outfit combinations."
  },
  {
    q: "What devices are supported?",
    a: "DeeStyle is currently available as a responsive web application optimized for both mobile and desktop. Native iOS and Android apps are in beta for Pro users."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-foreground mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="glass-panel bg-white rounded-2xl overflow-hidden border border-border"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-serif text-lg text-foreground">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-0 font-accent text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
