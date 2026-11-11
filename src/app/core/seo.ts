import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HOTEL } from './hotel.config';
import { SITE_URL } from './site-url';

export { SITE_URL };

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Keep the page out of search results (e.g. 404). */
  noindex?: boolean;
  /** schema.org objects for this page, emitted as one JSON-LD @graph. */
  structuredData?: object[];
}

const JSON_LD_ID = 'page-structured-data';

/** Absolute URL for a site path or a public asset path. */
export const absoluteUrl = (path: string): string => SITE_URL + (path.startsWith('/') ? path : '/' + path);

/**
 * Sets a unique <title>, meta description, canonical URL, Open Graph /
 * Twitter tags and JSON-LD per page. Runs during prerendering, so crawlers and
 * link previews (WhatsApp, Facebook) see real values in the static HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(page: PageMeta): void {
    const fullTitle = page.path === '/' ? page.title : `${page.title} | ${HOTEL.name}`;
    const url = absoluteUrl(page.path);
    const image = absoluteUrl(page.image ?? 'images/og-cover.jpg');

    this.title.setTitle(fullTitle);
    const tags: Record<string, string>[] = [
      { name: 'description', content: page.description },
      { name: 'robots', content: page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: HOTEL.name },
      { property: 'og:locale', content: 'en_IN' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: page.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: fullTitle },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: page.description },
      { name: 'twitter:image', content: image },
    ];
    for (const tag of tags) this.meta.updateTag(tag);

    this.setLink('canonical', url);
    this.setJsonLd(page.structuredData ?? []);
  }

  private setLink(rel: string, href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = this.document.createElement('link');
      link.rel = rel;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private setJsonLd(items: object[]): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
    if (!items.length) return;
    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    // Escape "<" so content can never close the script tag.
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': items }).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
