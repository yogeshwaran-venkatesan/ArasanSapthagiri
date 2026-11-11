import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../core/seo';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid min-h-[80svh] place-items-center bg-forest-900 px-6 pt-20 text-center text-ivory">
      <div>
        <p class="font-display text-8xl font-semibold text-gold-400">404</p>
        <h1 class="font-display mt-4 text-4xl font-semibold">{{ 'notFound.title' | translate }}</h1>
        <p class="mt-3 text-ivory/70">{{ 'notFound.text' | translate }}</p>
        <a routerLink="/" class="btn btn-gold mt-8">{{ 'notFound.home' | translate }}</a>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    const t = inject(TranslateService);
    inject(SeoService).set({ title: t.instant('notFound.title'), description: t.instant('notFound.text'), path: '/404', noindex: true });
  }
}
