import { motion } from 'framer-motion';
import { Search, Bell, Settings, Filter, Plus } from 'lucide-react';

const mockCategories = ["All Items", "Outerwear", "Tops", "Bottoms", "Footwear", "Accessories"];
const mockItems = [
  { img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", score: 98, name: "Leather Moto" },
  { img: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80", score: 92, name: "Silk Blouse" },
  { img: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&q=80", score: 87, name: "Pleated Skirt" },
  { img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80", score: 95, name: "Trench Coat" },
];

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Your Digital Atelier</h2>
          <p className="font-accent text-muted-foreground text-lg max-w-2xl mx-auto">
            A beautiful, centralized hub for your entire wardrobe. AI-categorized, infinitely searchable.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-panel bg-white/70 rounded-3xl border-primary/20 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col bg-white/40">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-serif font-bold">M</div>
              <span className="font-serif font-medium text-lg">DeeStyle</span>
            </div>

            <div className="space-y-1 flex-1">
              {mockCategories.map((cat, i) => (
                <div key={i} className={`px-4 py-2.5 rounded-lg text-sm font-accent cursor-pointer transition-colors ${
                  i === 0 ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary'
                }`}>
                  {cat}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium font-accent">Emma W.</p>
                  <p className="text-xs text-primary font-accent font-medium">Pro Member</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-transparent">
            {/* Topbar */}
            <div className="h-20 border-b border-border flex items-center justify-between px-8 bg-white/40 backdrop-blur-md">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search outfits..." 
                  className="w-full bg-white border border-border rounded-full py-2 pl-10 pr-4 text-sm font-accent focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="bg-foreground text-background px-4 py-2 rounded-full font-accent text-sm flex items-center gap-2 hover:bg-foreground/90 transition-colors">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-foreground">All Items</h3>
                  <p className="text-sm text-muted-foreground font-accent">142 items in your wardrobe</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-4 py-2 rounded-lg bg-white border border-border text-sm font-accent font-medium shadow-sm">
                    <span className="text-muted-foreground">Style Score:</span> <span className="text-primary">84/100</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {mockItems.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-secondary mb-3">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold font-accent shadow-sm flex items-center gap-1">
                        <SparkleIcon /> {item.score}
                      </div>
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="px-4 py-2 bg-white rounded-full text-sm font-medium font-accent transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          View Details
                        </div>
                      </div>
                    </div>
                    <h4 className="font-serif text-foreground text-lg">{item.name}</h4>
                    <p className="text-xs text-muted-foreground font-accent">Added 2d ago</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
