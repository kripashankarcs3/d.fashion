import { motion } from 'framer-motion';
import { Camera, Layers, ScanFace, Sparkles, MessageSquare, Briefcase } from 'lucide-react';

const features = [
  {
    title: "AI Wardrobe Analysis",
    description: "Upload your clothes, get instant style profiling and color palette extraction.",
    icon: Camera
  },
  {
    title: "Virtual Try-On",
    description: "See outfits mapped onto your body in real time with high-fidelity rendering.",
    icon: ScanFace
  },
  {
    title: "Personalized Dashboard",
    description: "Your style data, beautifully organized in a centralized digital atelier.",
    icon: Layers
  },
  {
    title: "AI Style Reports",
    description: "Weekly insights on your fashion patterns and emerging seasonal trends.",
    icon: Briefcase
  },
  {
    title: "Smart Outfit Builder",
    description: "Drag-and-drop outfit creation with AI scoring for color and silhouette harmony.",
    icon: Sparkles
  },
  {
    title: "Stylist Chat",
    description: "Chat with your personal AI fashion advisor for real-time situational advice.",
    icon: MessageSquare
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Features() {
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif text-foreground mb-6"
          >
            Intelligence, <br />
            <span className="italic text-muted-foreground">Woven In.</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-gold origin-left"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass-panel p-8 rounded-3xl group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ease-out cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-accent text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
