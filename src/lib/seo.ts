// ============================================
// SEO — per-route document head management
// ============================================
// A tiny imperative head manager. It mutates the tags that already ship in
// index.html rather than appending duplicates, so crawlers only ever see one
// <title>, one description and one canonical per route.

import { useEffect } from 'react';

export const SITE_URL = 'https://yorkscreenplay.com';
export const SITE_NAME = 'York Screenplay';
export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/dmhabztbf/image/upload/v1781511206/ChatGPT_Image_Jun_15_2026_01_39_22_PM_mbaqbe.png';

export interface SeoOptions {
  /** Full <title>. Keep under ~60 characters so Google doesn't truncate it. */
  title: string;
  /** Meta description. Aim for 150–160 characters. */
  description: string;
  /** Route path, e.g. '/script'. Used for the canonical + og:url. */
  path: string;
  /** Absolute URL of the social preview image. */
  image?: string;
  /** Open Graph type. 'website' for landing pages, 'article' for content. */
  type?: string;
  /** Keep the page out of the index (admin, thank-you pages, …). */
  noindex?: boolean;
  /** Route-specific structured data, serialised into a JSON-LD script. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/** Create the tag if it's missing, then set its content. */
function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'route-jsonld';

export function useSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`;

    document.title = title;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    );
    upsertCanonical(url);

    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);

    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Route-level structured data replaces whatever the previous route left behind.
    document.getElementById(JSON_LD_ID)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = JSON_LD_ID;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, path, image, type, noindex, jsonLd]);
}
