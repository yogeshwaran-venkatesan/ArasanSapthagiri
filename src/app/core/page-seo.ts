import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './seo';
import { breadcrumbSchema, hotelSchema, Translate } from './structured-data';

export interface PageSeoOptions {
  image?: string;
  /** Extra schema.org objects for this page, built with English copy. */
  extra?: (t: Translate) => object[];
}

/**
 * Call from a page constructor. Sets title/description from i18n keys
 * `seo.<key>.title` / `seo.<key>.description` (English at prerender time) and
 * JSON-LD: the Hotel, plus a breadcrumb on inner pages, plus any extras.
 */
export function pageSeo(key: string, path: string, options: PageSeoOptions = {}): void {
  const translate = inject(TranslateService);
  const t: Translate = (k) => translate.instant(k);
  const title = t(`seo.${key}.title`);
  inject(SeoService).set({
    title,
    description: t(`seo.${key}.description`),
    path,
    image: options.image,
    structuredData: [
      hotelSchema(t),
      ...(path === '/' ? [] : [breadcrumbSchema(t, path, title)]),
      ...(options.extra?.(t) ?? []),
    ],
  });
}
