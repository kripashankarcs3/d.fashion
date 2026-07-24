import { motion } from 'framer-motion';

const brands = [
  "VOGUE", "ELLE", "GQ", "THE CUT", "VANITY FAIR", "HARPER'S BAZAAR", "WWD", "ESQUIRE"
];

export default function TrustedBy() {
  return (
    <section className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="font-accent text-sm tracking-widest uppercase text-muted-foreground">
          Trusted by style-forward professionals at
        </p>
      </div>
      
      <div className="relative w-full border-y border-primary/20 py-8 bg-gradient-to-r from-transparent via-primary/5 to-transparent flex">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        
        <div className="flex w-fit animate-marquee whitespace-nowrap items-center">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center px-12">
              <span className="font-serif text-2xl md:text-3xl text-foreground/70 tracking-widest opacity-80 hover:opacity-100 hover:text-primary transition-colors duration-300">
                {brand}
              </span>
              <div className="w-2 h-2 rounded-full bg-primary/30 ml-12" />
            </div>
          ))}
        </div>
        
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
