import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Creative Director",
    text: "DeeStyle completely changed how I pack for fashion week. It analyzed my closet and built 15 outfits I never would have thought of. The color harmony engine is frighteningly accurate.",
    initials: "SJ"
  },
  {
    name: "Marcus Chen",
    role: "Product Designer",
    text: "I appreciate good software, and this is masterful. But more importantly, I finally understand why certain pieces in my wardrobe work together and others don't. It's like having a stylist in my pocket.",
    initials: "MC"
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Exec",
    text: "The virtual try-on is magic. I used to spend 20 minutes every morning trying on different combinations. Now I check the app while drinking coffee and know exactly what I'm wearing.",
    initials: "ER"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">The Verdict</h2>
          <p className="font-accent text-muted-foreground text-lg">Don't just take our word for it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-panel bg-white p-8 rounded-3xl shadow-lg border-primary/10 flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="font-accent text-foreground leading-relaxed flex-1 italic">"{t.text}"</p>
              
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-gold text-white flex items-center justify-center font-serif text-lg">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-serif text-lg text-foreground leading-tight">{t.name}</h4>
                  <p className="font-accent text-xs text-muted-foreground uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
