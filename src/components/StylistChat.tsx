import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Send, Sparkles } from 'lucide-react';
import { error } from '@/lib/toast';
import { sendChatMessage, type ChatTurn } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';
import { BRAND } from '@/config/site';
import { cn } from '@/lib/utils';

export interface Message {
  role: 'user' | 'ai';
  text: string;
  link?: { href: string; label: string };
  /** The canned opening line — UI chrome, not part of the conversation. */
  intro?: boolean;
}

const HISTORY_TURNS = 12;

/** The recent conversation, in the shape the server replays to the model. */
function toHistory(messages: Message[]): ChatTurn[] {
  return messages
    .filter((m) => !m.intro)
    .slice(-HISTORY_TURNS)
    .map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text.slice(0, 2000),
    }));
}

interface StylistChatProps {
  initialPrompt?: string;
  /** Extra classes on the root — the parent decides the widget's height
   *  (e.g. `flex-1` to fill the remaining space of a fixed-viewport page). */
  className?: string;
  /** A saved conversation to persist turns into. Omitted for a fresh chat —
   *  the first exchange then creates one server-side and reports its id back
   *  via `onConversationId`. */
  conversationId?: string;
  /** Messages loaded from a saved conversation, replacing the canned intro.
   *  Only read on mount — pair with `key={conversationId}` on this component
   *  so switching conversations remounts it instead of merging state. */
  initialMessages?: Message[];
  /** Fired once, the first time a fresh chat is assigned a conversation id
   *  by the server (i.e. after its first exchange). */
  onConversationId?: (id: string) => void;
}

function initialMessage(hasAnalysis: boolean): Message {
  if (hasAnalysis) {
    return {
      role: 'ai',
      text: 'Based on your colour season, I can help you find colours and outfits that work for you.',
      intro: true,
    };
  }
  return {
    role: 'ai',
    text: 'Upload a selfie first to get personalised style advice. ',
    link: { href: '/upload', label: 'Upload a selfie →' },
    intro: true,
  };
}

/** Renders a run of text, turning **double-asterisk** spans into gold-bold. */
function InlineText({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold text-gold-primary">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Colours each `**Word**` span, used by headings so the caps stay small. */
function CaptionText({ text }: { text: string }) {
  return <InlineText text={text} />;
}

/**
 * Renders a GPT-style structured answer — `**HEADING**` all-caps section
 * headers, `- ` bullets, `1.` numbered steps and plain paragraphs — without
 * pulling in a full markdown dependency.
 */
function StructuredBody({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p key={blocks.length} className="text-[length:var(--text-body-sm)] leading-[1.7]">
        <InlineText text={paragraph.join('\n')} />
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const ListTag = list.type === 'ul' ? 'ul' : 'ol';
    const itemClass =
      'text-[length:var(--text-body-sm)] leading-[1.7] ' +
      (list.type === 'ul' ? 'list-disc pl-5' : 'list-decimal pl-5');
    blocks.push(
      <ListTag key={blocks.length} className={`space-y-1.5 ${itemClass}`}>
        {list.items.map((item, i) => (
          <li key={i}>
            <InlineText text={item} />
          </li>
        ))}
      </ListTag>,
    );
    list = null;
  };

  const pushLine = (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    const ulMatch = line.match(/^[-–*]\s+(.*)$/);
    if (ulMatch) {
      flushParagraph();
      if (list && list.type !== 'ul') flushList();
      list = list ?? { type: 'ul', items: [] };
      list.items.push(ulMatch[1]);
      return;
    }

    const olMatch = line.match(/^\d+[.)]\s+(.*)$/);
    if (olMatch) {
      flushParagraph();
      if (list && list.type !== 'ol') flushList();
      list = list ?? { type: 'ol', items: [] };
      list.items.push(olMatch[1]);
      return;
    }

    const headingMatch = raw.match(/^\s*#{1,6}\s+(.*)$/) || raw.match(/^\s*\*\*(.+?)\*\*\s*:?\s*$/);
    if (headingMatch && headingMatch[1].length < 60) {
      flushParagraph();
      flushList();
      blocks.push(
        <p key={blocks.length} className="font-semibold uppercase tracking-wider text-gold-primary">
          <CaptionText text={headingMatch[1]} />
        </p>,
      );
      return;
    }

    flushList();
    paragraph.push(line);
  };

  lines.forEach(pushLine);
  flushParagraph();
  flushList();

  return <div className="space-y-2.5">{blocks}</div>;
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${BRAND.stylistName} is typing`}>
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

export default function StylistChat({
  initialPrompt,
  className,
  conversationId,
  initialMessages,
  onConversationId,
}: StylistChatProps) {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const [messages, setMessages] = useState<Message[]>(
    () => initialMessages ?? [initialMessage(Boolean(analysisResult))],
  );
  const [input, setInput] = useState('');
  const messagesListRef = useRef<HTMLDivElement>(null);
  const submittedPromptRef = useRef('');
  const conversationIdRef = useRef(conversationId);

  const mutation = useMutation({
    mutationFn: ({ text, history }: { text: string; history: ChatTurn[] }) =>
      sendChatMessage(text, { analysisResult, wardrobeItems }, history, conversationIdRef.current),
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: response.data.reply },
      ]);
      const newId = response.data.conversationId;
      if (newId && newId !== conversationIdRef.current) {
        conversationIdRef.current = newId;
        onConversationId?.(newId);
      }
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
        // History is taken before the prompt is appended: the prompt itself
        // travels as `message`, not as a past turn.
        mutation.mutate({ text: initialPrompt, history: toHistory(messages) });
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: initialPrompt },
        ]);
      }
    }
    // `messages` changes after every exchange; submittedPromptRef keeps the
    // re-run from sending the same prompt twice.
  }, [initialPrompt, analysisResult, mutation, messages]);

  useEffect(() => {
    const list = messagesListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, mutation.isPending]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || mutation.isPending) return;
    mutation.mutate({ text, history: toHistory(messages) });
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
  };

  return (
    <div className={cn('flex min-h-0 flex-col overflow-hidden bg-surface-3', className)}>
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-4 py-2.5">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-none bg-gold-primary text-surface-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <p className="text-[0.8125rem] font-semibold text-gold-primary">
          D&rsquo;Style
        </p>
      </div>

      {/* Messages */}
      <div ref={messagesListRef} role="log" aria-live="polite" className="scrollbar-none flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 ${
                msg.role === 'user'
                  ? 'bg-surface-4 text-cream-primary'
                  : 'border border-gold-border bg-surface-3/60 text-cream-primary'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap text-[length:var(--text-body-sm)] leading-[1.6]">
                  {msg.text}
                </p>
              ) : (
                <>
                  <StructuredBody text={msg.text} />
                  {msg.link && (
                    <Link
                      href={msg.link.href}
                      className="mt-2 inline-block text-body-sm font-medium text-gold-primary underline underline-offset-2 transition-colors duration-200 ease-out hover:text-gold-light"
                    >
                      {msg.link.label}
                    </Link>
                  )}
                </>
              )}
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
