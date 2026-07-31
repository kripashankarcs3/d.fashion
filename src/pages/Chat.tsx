import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import StylistChat from '@/components/StylistChat';
import { MessageSquare, Palette, Shirt } from 'lucide-react';

const samplePrompts = [
  'What should I wear to a casual Friday at a creative agency?',
  'Help me build 5 outfits for a week in Paris from my palette.',
  'Which of my saved looks are underused?',
  "What's one item I should add to unlock the most new combinations?",
  'Style me for a beach wedding in Santorini.',
];

const knowledge = [
  {
    icon: Palette,
    title: 'Your colour season',
    description: 'Every suggestion starts from your personal palette.',
  },
  {
    icon: Shirt,
    title: 'Your saved looks',
    description: 'It references the outfits you have already saved.',
  },
  {
    icon: MessageSquare,
    title: 'Any occasion',
    description: 'Date night, interview, vacation — just describe the event.',
  },
];

export default function Chat() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [activePrompt, setActivePrompt] = useState('');

  return (
    <div className="w-full pt-28 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
            AI Stylist
          </p>
          <h1 className="mt-3 font-serif text-[length:var(--text-h1)] text-espresso">
            Ask D&rsquo;Style.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[length:var(--text-body)] text-espresso-light">
            A knowledgeable, warm stylist who knows your colour season and your
            wardrobe.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* Conversation */}
          <StylistChat initialPrompt={activePrompt} />

          {/* Quick actions */}
          <div className="space-y-10">
            <Card variant="report" className="p-8">
              <h2 className="font-serif text-[length:var(--text-h5)] text-espresso">
                Quick Questions
              </h2>
              <ul className="mt-5 space-y-3">
                {samplePrompts.map((prompt) => (
                  <li key={prompt}>
                    <button
                      type="button"
                      onClick={() => setActivePrompt(prompt)}
                      className="w-full rounded-md border border-border bg-cream-primary px-4 py-3 text-left text-[length:var(--text-body-sm)] text-espresso-light transition-colors duration-200 ease-out hover:border-gold-primary hover:bg-cream-dark hover:text-espresso"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="report" className="p-8">
              <h2 className="font-serif text-[length:var(--text-h5)] text-espresso">
                What D&rsquo;Style Knows
              </h2>
              <ul className="mt-5 space-y-5">
                {knowledge.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cream-dark text-gold-primary"
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[length:var(--text-body-sm)] font-medium text-espresso">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[length:var(--text-caption)] text-espresso-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
