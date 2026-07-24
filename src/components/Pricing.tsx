import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: "Style Explorer",
    price: "0",
    description: "For those just beginning to digitize their wardrobe.",
    features: [
      "10 items upload per month",
      "Basic AI style analysis",
      "1 monthly style report",
      "Standard support"
    ]
  },
  {
    name: "Style Curator",
    price: "19",
    description: "The complete digital atelier experience.",
    popular: true,
    features: [
      "Unlimited wardrobe uploads",
      "Full Virtual Try-On access",
      "Weekly intelligence reports",
      "24/7 AI Stylist Chat",
      "Color palette extraction"
    ]
  },
  {
    name: "Style Director",
    price: "49",
    description: "For professionals, stylists, and power users.",
    features: [
      "Everything in Curator",
      "Multiple profiles (up to 5)",
      "High-res PDF export",
      "Early access to new models",
      "API access"
    ]
  }
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-24 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Invest in Your Aesthetic</h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 font-accent text-sm font-medium">
            <span className={annual ? "text-muted-foreground" : "text-foreground"}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-8 rounded-full bg-secondary border border-border transition-colors focus:outline-none p-1"
            >
              <motion.div 
                className="w-6 h-6 rounded-full bg-primary"
                animate={{ x: annual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={annual ? "text-foreground" : "text-muted-foreground"}>Annually <span className="text-primary text-xs ml-1">(Save 20%)</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                tier.popular 
                  ? 'glass-panel bg-white shadow-2xl border-primary md:-translate-y-4 py-12' 
                  : 'bg-white/50 border border-border shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold font-accent tracking-widest rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="font-serif text-2xl text-foreground mb-2">{tier.name}</h3>
              <p className="font-accent text-muted-foreground text-sm h-10">{tier.description}</p>
              
              <div className="my-6">
                <span className="text-5xl font-serif">${annual && tier.price !== "0" ? Math.round(Number(tier.price) * 0.8) : tier.price}</span>
                <span className="text-muted-foreground font-accent">/mo</span>
              </div>
              
              <button className={`w-full py-3 rounded-xl font-accent font-medium mb-8 transition-colors ${
                tier.popular 
                  ? 'bg-gradient-gold text-white shadow-lg hover:opacity-90' 
                  : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
              }`}>
                {tier.price === "0" ? "Start Free" : "Subscribe"}
              </button>

              <div className="space-y-4">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="font-accent text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
