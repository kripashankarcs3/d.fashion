import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, PanelLeft } from 'lucide-react';
import StylistChat, { type Message } from '@/components/StylistChat';
import ChatSidebar from '@/components/ChatSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getChatConversation } from '@/services/api';

/** A full-screen app page, like ChatGPT's own window — no marketing chrome
 *  (masthead, footer) around it, and only the message list scrolls; the page
 *  itself never does. AppShell hides the global footer for this route and
 *  pins the page to the viewport (see APP_SCREEN_ROUTES there). The empty
 *  side space it used to leave is now the conversation history rail. */
export default function Chat() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const conversationQuery = useQuery({
    queryKey: ['chat-conversation', activeId],
    queryFn: () => getChatConversation(activeId as string),
    enabled: Boolean(activeId),
  });

  const loadedConversation = conversationQuery.data?.data.conversation;
  // Only true once the messages for the CURRENT activeId have actually
  // arrived — mounting StylistChat before that would seed it with the canned
  // intro, and initialMessages is only read once (on mount), so a later
  // prop update would silently be ignored.
  const ready = !activeId || loadedConversation?.id === activeId;
  const initialMessages: Message[] | undefined = loadedConversation
    ? loadedConversation.messages.map((m) => ({
        role: m.role === 'assistant' ? 'ai' : 'user',
        text: m.content,
      }))
    : undefined;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileSidebarOpen(false);
  };
  const handleNewChat = () => {
    setActiveId(null);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-full w-full overflow-hidden pt-16">
      <ChatSidebar
        activeId={activeId}
        onSelect={handleSelect}
        onNewChat={handleNewChat}
        className="hidden w-72 shrink-0 border-r border-gold-hairline bg-surface-2/40 lg:flex"
      />

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 border-gold-hairline bg-surface-2 p-0 text-cream-primary">
          <SheetHeader className="sr-only">
            <SheetTitle>Conversation history</SheetTitle>
          </SheetHeader>
          <ChatSidebar activeId={activeId} onSelect={handleSelect} onNewChat={handleNewChat} className="h-full pt-8" />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-3 border-b border-gold-hairline px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Show conversation history"
            className="text-cream-primary/70 transition-colors hover:text-cream-primary"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <span className="text-body-sm font-medium text-cream-primary">D&rsquo;Style Stylist</span>
        </div>

        {ready ? (
          <StylistChat
            key={activeId ?? 'new'}
            conversationId={activeId ?? undefined}
            initialMessages={initialMessages}
            onConversationId={setActiveId}
            className="flex-1"
          />
        ) : (
          <div className="flex flex-1 items-center justify-center bg-surface-3">
            <Loader2 className="h-6 w-6 animate-spin text-gold-primary" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
