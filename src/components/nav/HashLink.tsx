import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { scrollToSection, setPendingScrollTarget } from '@/lib/scroll';

interface HashLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  /** Route the section lives on — the landing page for every current anchor. */
  href: string;
  /** DOM id of the section to scroll to. */
  hash: string;
  children: ReactNode;
  /** Fired after navigation starts, e.g. to close the mobile drawer. */
  onNavigate?: () => void;
}

/**
 * Scrolls to a section of the landing page, routing there first when the
 * visitor is somewhere else. A plain `<a href="/#id">` would trigger a full
 * document load under wouter, throwing away the SPA state; the cross-page case
 * is handed to `ScrollManager`, which knows when the page has mounted.
 */
export default function HashLink({
  href,
  hash,
  children,
  onNavigate,
  ...anchorProps
}: HashLinkProps) {
  const [location, navigate] = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / new-window and modified clicks.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    onNavigate?.();

    if (location === href) {
      scrollToSection(hash, true);
      return;
    }

    setPendingScrollTarget(href, hash);
    navigate(href);
  };

  return (
    <a href={`${href}#${hash}`} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
}
