import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1209] text-white pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
                <span className="font-serif text-xl font-bold">D</span>
              </div>
              <span className="font-serif text-xl tracking-wide">DeeStyle</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-white/50 font-accent text-sm leading-relaxed mb-6">
              The intersection of haute couture and artificial intelligence. Elevating personal style through code.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Product</h4>
            <ul className="space-y-4 font-accent text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Virtual Try-On</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Style Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Stylist</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Company</h4>
            <ul className="space-y-4 font-accent text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Legal</h4>
            <ul className="space-y-4 font-accent text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Ethics</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-accent text-sm text-white/40">
          <p>© {new Date().getFullYear()} DeeStyle. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
