import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Check } from 'lucide-react';

const colors = ['#000000', '#F5F5DC', '#8B4513', '#2F4F4F'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export default function TryOn() {
  const [selectedColor, setSelectedColor] = useState(1); // Beige
  const [selectedSize, setSelectedSize] = useState(2); // M
  const [isRendering, setIsRendering] = useState(false);

  const handleTryOn = () => {
    setIsRendering(true);
    setTimeout(() => setIsRendering(false), 2000);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Avatar Viewer */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] bg-secondary rounded-3xl overflow-hidden border border-border shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" 
                alt="Virtual Try On Avatar" 
                className={`w-full h-full object-cover transition-all duration-700 ${isRendering ? 'blur-md scale-105' : 'blur-0 scale-100'}`}
              />
              
              {isRendering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                  <RotateCw className="w-10 h-10 text-white animate-spin mb-4" />
                  <p className="text-white font-accent tracking-widest text-sm font-medium">RENDERING FIT...</p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 glass-panel bg-white/80 rounded-full px-4 py-2 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold font-accent tracking-wider">AI FIT ENGINE</span>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              See it on <span className="italic text-primary">you</span>, <br />before you buy.
            </h2>
            <p className="text-lg text-muted-foreground font-accent mb-10 max-w-lg">
              Our neural rendering engine maps garments onto your exact measurements, maintaining realistic drape, lighting, and fabric tension.
            </p>

            <div className="glass-panel p-8 rounded-3xl border-primary/10 shadow-xl bg-white/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif mb-1">Double-Breasted Linen Blazer</h3>
                  <p className="text-primary font-accent font-medium">$345.00</p>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-accent mb-4">Select Color</p>
                <div className="flex gap-4">
                  {colors.map((color, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === i ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-110 ring-1 ring-border'}`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === i && color === '#000000' && <Check className="w-4 h-4 text-white" />}
                      {selectedColor === i && color !== '#000000' && <Check className="w-4 h-4 text-black" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-accent">Select Size</p>
                  <span className="text-xs text-primary underline cursor-pointer font-accent">Size Guide</span>
                </div>
                <div className="flex gap-3">
                  {sizes.map((size, i) => (
                    <button 
                      key={i}
                      onClick={() => setSelectedSize(i)}
                      className={`flex-1 py-3 rounded-xl border font-accent font-medium transition-all ${
                        selectedSize === i 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-border text-foreground hover:border-primary/50 hover:bg-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleTryOn}
                disabled={isRendering}
                className="w-full bg-foreground text-background py-4 rounded-xl font-accent font-medium text-lg tracking-wide hover:bg-foreground/90 transition-colors shadow-lg shadow-black/10 disabled:opacity-70 flex justify-center items-center gap-3"
              >
                {isRendering ? (
                  <>
                    <RotateCw className="w-5 h-5 animate-spin" /> Processing
                  </>
                ) : (
                  'Virtual Try-On'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
