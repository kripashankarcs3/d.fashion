import { SITE_URL, type PageMeta } from '@/config/navigation';

function ensureMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function ensureCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

const OG_IMAGE = `${SITE_URL}/images/campaign/opening-og.jpg`;

/**
 * Per-route SEO: title + description + Open Graph + Twitter card + canonical.
 * The shared head defaults live in index.html; this layer keeps them in sync
 * as the SPA navigates so every screen is shareable and indexable.
 */
export function applyPageMeta(pathname: string, meta: PageMeta) {
  const url = `${SITE_URL}${pathname}`;

  document.title = meta.title;
  ensureMeta('name', 'description', meta.description);
  ensureMeta('property', 'og:title', meta.title);
  ensureMeta('property', 'og:description', meta.description);
  ensureMeta('property', 'og:type', 'website');
  ensureMeta('property', 'og:url', url);
  ensureMeta('property', 'og:image', OG_IMAGE);
  ensureMeta('name', 'twitter:title', meta.title);
  ensureMeta('name', 'twitter:description', meta.description);
  ensureMeta('name', 'twitter:card', 'summary_large_image');
  ensureMeta('name', 'twitter:image', OG_IMAGE);
  ensureCanonical(url);
}
