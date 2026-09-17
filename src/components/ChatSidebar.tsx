import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNowStrict } from 'date-fns';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { deleteChatConversation, listChatConversations, type ChatConversationSummary } from '@/services/api';
import { error as toastError } from '@/lib/toast';

interface ChatSidebarProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  className?: string;
}

function DeleteRowButton({ conversation, isActive, onNewChat }: { conversation: ChatConversationSummary; isActive: boolean; onNewChat: () => void }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      await deleteChatConversation(conversation.id);
      await queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
      if (isActive) onNewChat();
    } catch {
      toastError('Could not delete this conversation.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="rounded-sm p-1.5 text-cream-primary/40 opacity-0 transition-opacity hover:text-cream-primary group-hover:opacity-100"
          aria-label={`Delete "${conversation.title}"`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{conversation.title}&rdquo; will be permanently removed. This can&rsquo;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** The "previous conversations" list — the ChatGPT-style history rail. */
export default function ChatSidebar({ activeId, onSelect, onNewChat, className }: ChatSidebarProps) {
  const query = useQuery({
    queryKey: ['chat-conversations'],
    queryFn: listChatConversations,
    staleTime: 10_000,
  });
  const conversations = query.data?.data.conversations ?? [];

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className="shrink-0 p-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start gap-2"
          onClick={onNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {query.isLoading ? (
          <p className="px-2 py-4 text-caption text-cream-primary/40">Loading…</p>
        ) : conversations.length === 0 ? (
          <p className="px-2 py-4 text-caption text-cream-primary/40">
            Your past conversations will show up here.
          </p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                {/* A container div, not a button — the title and delete
                    actions below are each their own interactive element, and
                    a <button> cannot legally nest another <button>. */}
                <div
                  className={cn(
                    'group flex items-center justify-between gap-1 rounded-sm pr-1 transition-colors duration-150',
                    c.id === activeId
                      ? 'bg-gold-primary/10 text-cream-primary'
                      : 'text-cream-primary/70 hover:bg-surface-4 hover:text-cream-primary',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                  >
                    <span className="block truncate text-body-sm">{c.title}</span>
                    <span className="block truncate text-caption text-cream-primary/40">
                      {formatDistanceToNowStrict(new Date(c.updatedAt), { addSuffix: true })}
                    </span>
                  </button>
                  <DeleteRowButton conversation={c} isActive={c.id === activeId} onNewChat={onNewChat} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
