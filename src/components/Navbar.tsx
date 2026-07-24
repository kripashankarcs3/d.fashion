import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/upload', label: 'How It Works' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tryon', label: 'Try-On' },
  { href: '/report', label: 'Reports' },
  { href: '/chat', label: 'AI Stylist' },
  { href: '/pricing', label: 'Pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <nav className={`glass-panel rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-lg shadow-black/5' : ''}`}>
          <Link href="/" className="flex items-center gap-2 group cursor-pointer z-50">
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-foreground text-background overflow-hidden">
              <span className="font-serif text-xl font-bold relative z-10">D</span>
              <motion.div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="font-serif text-xl tracking-wide font-medium">DeeStyle</span>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-accent transition-colors ${location === link.href ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link href="/upload" className="relative group overflow-hidden rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-accent tracking-wide transition-all hover:shadow-lg hover:shadow-primary/20">
              <span className="relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-gold transition-all duration-300">Get Early Access</span>
            </Link>
          </div>

          <button className="md:hidden z-50 p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full px-6 pt-4 pb-8"
          >
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`text-lg font-serif ${location === link.href ? 'text-primary' : 'text-foreground'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border w-full my-2" />
              <Link href="/upload" className="w-full text-center bg-foreground text-background py-3 rounded-xl font-accent">
                Get Early Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
