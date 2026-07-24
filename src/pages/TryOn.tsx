import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import TryOnComponent from '@/components/TryOn';
import { RotateCw, Check, ArrowRight, Sparkles, ScanFace, Layers } from 'lucide-react';

const howItWorks = [
  { step: '01', title: 'Select Your Item', desc: 'Choose any garment from your wardrobe or browse our catalog of 10,000+ pieces.' },
  { step: '02', title: 'AI Maps Your Body', desc: 'Our neural engine measures your proportions from a single reference photo.' },
  { step: '03', title: 'See the Fit', desc: 'Realistic rendering shows fabric drape, texture, and how the piece interacts with light on your body.' },
];

const garments = [
  { id: 1, name: 'Double-Breasted Linen Blazer', price: '$345', category: 'Outerwear', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', tags: ['Smart Casual', 'Summer'] },
  { id: 2, name: 'Silk Midi Dress', price: '$280', category: 'Dresses', img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80', tags: ['Evening', 'Feminine'] },
  { id: 3, name: 'Pleated Trousers', price: '$195', category: 'Bottoms', img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80', tags: ['Office', 'Versatile'] },
  { id: 4, name: 'Trench Coat', price: '$420', category: 'Outerwear', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80', tags: ['Classic', 'Autumn'] },
  { id: 5, name: 'Leather Moto Jacket', price: '$380', category: 'Outerwear', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80', tags: ['Edgy', 'All-Season'] },
  { id: 6, name: 'Oversized Knit', price: '$145', category: 'Tops', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', tags: ['Cozy', 'Winter'] },
];

const categories = ['All', 'Outerwear', 'Dresses', 'Tops', 'Bottoms'];

export default function TryOn() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filtered = activeCategory === 'All' ? garments : garments.filter(g => g.category === activeCategory);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="pt-40 pb-16 relative">
        <div className="absolute inset-0 -z-10 bg-background">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-sm font-accent font-medium mb-6">
              <ScanFace className="w-4 h-4 text-primary" /> Neural Fit Engine Active
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              See It On <span className="italic text-gradient-gold">You</span>,<br />Before You Buy.
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl mx-auto">
              High-fidelity virtual try-on that maps garments to your exact proportions — realistic drape, texture, and lighting.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/20 border-y border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <span className="font-serif text-4xl text-primary/30 leading-none flex-shrink-0">{step.step}</span>
                <div>
                  <h3 className="font-serif text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-accent leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Try-On */}
      <TryOnComponent />

      {/* Catalog Browse */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-2">Browse Catalog</h2>
              <p className="text-muted-foreground font-accent">Select any item to instantly try it on</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-accent font-medium transition-all ${
                    activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md' : 'glass-panel hover:border-primary/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                  selectedItem === item.id ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-border hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {selectedItem === item.id && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <p className="font-serif text-sm leading-snug">{item.name}</p>
                  <p className="text-primary text-xs font-accent font-medium mt-1">{item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
              <button className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-accent font-medium hover:bg-foreground/90 transition-colors shadow-lg">
                <RotateCw className="w-4 h-4" /> Try On Selected Item
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1209] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready to try your own wardrobe?</h2>
          <p className="text-white/60 font-accent mb-8">Upload your clothes and try them on virtually — your entire wardrobe, reimagined.</p>
          <Link href="/upload" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-accent font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Upload Your Wardrobe <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
