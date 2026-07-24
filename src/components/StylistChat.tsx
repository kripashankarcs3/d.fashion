import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';

const conversation = [
  { role: 'user', text: "What should I wear to a summer rooftop dinner in NYC? The dress code is 'smart casual'." },
  { role: 'ai', text: "For a summer evening in NYC, you want breathability mixed with structure. Based on your wardrobe, I suggest the **Linen Blend Midi Dress** (great for the heat) paired with your **Oversized Cream Blazer** for when the wind picks up on the roof. Finish with the **Tan Strappy Sandals**.", outfit: true },
  { role: 'user', text: "Make it a bit more edgy, less classic." },
];

export default function StylistChat() {
  const [messages, setMessages] = useState(conversation);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');

  // Simulate typing effect on mount
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Let's swap the dress for your **Black Silk Slip Skirt** and **Vintage Graphic Tee**. Keep the blazer but add the **Chunky Leather Loafers** instead of sandals. It's sophisticated but has that effortless downtown edge." 
      }]);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: "That's a great direction. I've updated your outfit board with those suggestions." }]);
    }, 2000);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Your AI Stylist, 24/7.</h2>
          <p className="font-accent text-muted-foreground text-lg">Context-aware advice based on your exact wardrobe and the occasion.</p>
        </div>

        <div className="glass-panel bg-white/60 rounded-3xl border-primary/20 shadow-2xl flex flex-col h-[600px] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-border bg-white/40 flex items-center gap-4 backdrop-blur-md">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-medium">Claude (Style Engine)</h3>
              <p className="text-xs font-accent text-primary font-bold tracking-widest flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> ONLINE
              </p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 md:p-5 ${
                  msg.role === 'user' 
                    ? 'bg-foreground text-background rounded-tr-sm' 
                    : 'glass-panel bg-white/80 rounded-tl-sm text-foreground shadow-sm'
                }`}>
                  <p className={`font-accent text-sm md:text-base leading-relaxed ${
                    msg.role === 'user' ? 'text-background' : 'text-foreground'
                  }`}>
                    {/* Hacky markdown bolding support */}
                    {msg.text.split('**').map((part, index) => 
                      index % 2 === 1 ? <strong key={index} className="font-semibold text-primary">{part}</strong> : part
                    )}
                  </p>
                  
                  {msg.outfit && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                        <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80" className="w-full h-full object-cover" alt="Dress" />
                      </div>
                      <div className="aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                        <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80" className="w-full h-full object-cover" alt="Blazer" />
                      </div>
                      <div className="aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                        <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80" className="w-full h-full object-cover" alt="Shoes" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass-panel bg-white/80 rounded-2xl rounded-tl-sm p-4 px-5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/60 border-t border-border backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex items-center">
              <button type="button" className="absolute left-3 text-muted-foreground hover:text-primary transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask for advice..." 
                className="w-full bg-white border border-border rounded-full py-3 pl-12 pr-14 font-accent text-sm focus:outline-none focus:border-primary/50 shadow-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
