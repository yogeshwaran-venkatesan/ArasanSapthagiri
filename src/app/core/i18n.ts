import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslateLoader, TranslateService, TranslationObject } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

export type Lang = 'en' | 'ta';
const STORAGE_KEY = 'arasan.lang';

/**
 * Languages offered on the site. Tamil translations are complete (src/i18n/ta.json)
 * but switched off for now — add 'ta' back here to bring the language button back.
 */
export const ENABLED_LANGS: readonly Lang[] = ['en'];

/**
 * Loads translations by importing the JSON files, so they are bundled and
 * available during server-side prerendering (an HTTP loader would need a
 * running server at build time).
 */
export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const load =
      lang === 'ta' ? import('../../i18n/ta.json') : import('../../i18n/en.json');
    return from(load.then((m) => m.default as TranslationObject));
  }
}

/** English ⇄ Tamil. Pages are prerendered in English; the choice is restored in the browser. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly current = signal<Lang>('en');
  readonly multilingual = ENABLED_LANGS.length > 1;

  async init(): Promise<void> {
    await this.use('en');
    if (this.isBrowser) {
      const saved = this.read();
      if (saved && saved !== 'en' && ENABLED_LANGS.includes(saved)) await this.use(saved);
    }
  }

  async use(lang: Lang): Promise<void> {
    await new Promise<void>((resolve) => this.translate.use(lang).subscribe({ complete: resolve, error: resolve }));
    this.current.set(lang);
    this.document.documentElement.lang = lang;
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* storage blocked */
      }
    }
  }

  toggle(): Promise<void> {
    const i = ENABLED_LANGS.indexOf(this.current());
    return this.use(ENABLED_LANGS[(i + 1) % ENABLED_LANGS.length]);
  }

  private read(): Lang | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'en' || v === 'ta' ? v : null;
    } catch {
      return null;
    }
  }
}
