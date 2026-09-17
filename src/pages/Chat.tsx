import StylistChat from '@/components/StylistChat';

/** A full-screen app page, like ChatGPT's own window — no marketing chrome
 *  (masthead, sidebar, footer) around it, and only the message list scrolls;
 *  the page itself never does. AppShell hides the global footer for this
 *  route and pins the page to the viewport (see APP_SCREEN_ROUTES there). */
export default function Chat() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden pt-16">
      <div className="mx-auto flex h-full w-full max-w-3xl flex-1 flex-col">
        <StylistChat className="flex-1" />
      </div>
    </div>
  );
}
