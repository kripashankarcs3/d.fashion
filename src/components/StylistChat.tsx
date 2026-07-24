import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendChatMessage } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface StylistChatProps {
  initialPrompt?: string;
}

export default function StylistChat({ initialPrompt }: StylistChatProps) {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (!analysisResult) {
      return [{
        role: 'ai',
        text: 'Upload a selfie first to get personalized advice. Your AI stylist works best with your analysis data.',
      }];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const submittedPromptRef = useRef('');

  const mutation = useMutation({
    mutationFn: (text: string) =>
      sendChatMessage(text, { analysisResult, wardrobeItems }),
    onSuccess: (response) => {
      setMessages((prev) => [...prev, { role: 'ai', text: response.data.reply }]);
    },
    onError: () => {
      toast.error('Stylist is unavailable. Please try again.');
    },
  });

  useEffect(() => {
    if (initialPrompt && initialPrompt !== submittedPromptRef.current) {
      submittedPromptRef.current = initialPrompt;
      setInput(initialPrompt);
      if (analysisResult) {
        setMessages((prev) => [...prev, { role: 'user', text: initialPrompt }]);
        mutation.mutate(initialPrompt);
      }
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mutation.isPending]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || mutation.isPending) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    mutation.mutate(text);
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
                    {msg.text.split('**').map((part, index) =>
                      index % 2 === 1 ? <strong key={index} className="font-semibold text-primary">{part}</strong> : part
                    )}
                  </p>
                </div>
              </motion.div>
            ))}

            {mutation.isPending && (
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
            <div ref={messagesEndRef} />
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
                placeholder={analysisResult ? "Ask for advice..." : "Upload a selfie to get started..."}
                className="w-full bg-white border border-border rounded-full py-3 pl-12 pr-14 font-accent text-sm focus:outline-none focus:border-primary/50 shadow-sm"
                disabled={!analysisResult}
              />
              <button
                type="submit"
                disabled={!input.trim() || mutation.isPending || !analysisResult}
                className="absolute right-2 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 ml-0.5" />
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}