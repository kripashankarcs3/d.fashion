import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Send, Sparkles } from 'lucide-react';
import { error } from '@/lib/toast';
import { sendChatMessage } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

interface Message {
  role: 'user' | 'ai';
  text: string;
  link?: { href: string; label: string };
}

interface StylistChatProps {
  initialPrompt?: string;
}

function initialMessage(hasAnalysis: boolean): Message {
  if (hasAnalysis) {
    return {
      role: 'ai',
      text: 'Based on your colour season, I can help you find colours and outfits that work for you.',
    };
  }
  return {
    role: 'ai',
    text: 'Upload a selfie first to get personalised style advice. ',
    link: { href: '/upload', label: 'Upload a selfie →' },
  };
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="D'Style is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-gold-primary"
          style={{ willChange: 'opacity' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.18,
          }}
        />
      ))}
    </span>
  );
}

export default function StylistChat({ initialPrompt }: StylistChatProps) {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const [messages, setMessages] = useState<Message[]>(() => [
    initialMessage(Boolean(analysisResult)),
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const submittedPromptRef = useRef('');

  const mutation = useMutation({
    mutationFn: (text: string) =>
      sendChatMessage(text, { analysisResult, wardrobeItems }),
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: response.data.reply },
      ]);
    },
    onError: () => {
      error('Stylist is unavailable. Please try again.');
    },
  });

  useEffect(() => {
    if (initialPrompt && initialPrompt !== submittedPromptRef.current) {
      submittedPromptRef.current = initialPrompt;
      setInput(initialPrompt);
      if (analysisResult) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: initialPrompt },
        ]);
        mutation.mutate(initialPrompt);
      }
    }
  }, [initialPrompt, analysisResult, mutation]);

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
    <div className="flex h-[620px] flex-col overflow-hidden border border-border bg-surface-3">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border p-6">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-none bg-gold-primary text-surface-0"
        >
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-gold-primary">
            D&rsquo;Style
          </p>
          <p className="text-[length:var(--text-caption)] text-cream-primary/55">
            Your personal stylist
          </p>
        </div>
      </div>

      {/* Messages */}
      <div role="log" aria-live="polite" className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 ${
                msg.role === 'user'
                  ? 'bg-surface-4 text-cream-primary'
                  : 'border border-gold-border bg-surface-3/60 text-cream-primary'
              }`}
            >
              <p className="text-[length:var(--text-body-sm)] leading-[1.6]">
                {msg.text.split('**').map((part, index) =>
                  index % 2 === 1 ? (
                    <strong
                      key={index}
                      className="font-semibold text-gold-primary"
                    >
                      {part}
                    </strong>
                  ) : (
                    part
                  ),
                )}
                {msg.link && (
                  <Link
                    href={msg.link.href}
                    className="ml-0.5 font-medium text-gold-primary underline underline-offset-2 transition-colors duration-200 ease-out hover:text-gold-light"
                  >
                    {msg.link.label}
                  </Link>
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
            <div className="border border-gold-border bg-surface-3/60 p-4">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-6">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              analysisResult
                ? 'Ask for advice…'
                : 'Upload a selfie to get started…'
            }
            disabled={!analysisResult}
            className="min-h-11 min-w-0 flex-1 border-0 border-b border-input bg-transparent pb-3 text-[length:var(--text-body-sm)] text-cream-primary placeholder:text-placeholder transition-colors duration-200 ease-out focus:border-gold-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!input.trim() || mutation.isPending || !analysisResult}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-none text-cream-primary transition-colors duration-200 ease-out hover:bg-gold-primary/10 hover:text-gold-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
}
