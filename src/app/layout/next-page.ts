import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, map } from 'rxjs';
import { IMAGES } from '../core/images';
import { Icon } from '../shared/ui/icon';

/** The "journey" through the site: each page invites the visitor on to the next. */
const NEXT: Record<string, { path: string; key: string; image: string }> = {
  '/': { path: '/rooms', key: 'rooms', image: IMAGES.hero },
  '/about': { path: '/rooms', key: 'rooms', image: IMAGES.hero },
  '/rooms': { path: '/dining', key: 'dining', image: IMAGES.rooftopNight },
  '/dining': { path: '/facilities', key: 'facilities', image: IMAGES.conference },
  '/facilities': { path: '/travel', key: 'travel', image: IMAGES.templeMandapam },
  '/travel': { path: '/gallery', key: 'gallery', image: IMAGES.reception },
  '/gallery': { path: '/location', key: 'location', image: IMAGES.templeNight },
  '/location': { path: '/contact', key: 'contact', image: IMAGES.reception },
  '/contact': { path: '/book', key: 'book', image: IMAGES.rooms['super-deluxe'] },
};

/**
 * Large "Up next" card at the bottom of each page, so reaching the end of a
 * page leads straight into the next one (with a smooth page transition).
 */
@Component({
  selector: 'app-next-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @if (next(); as n) {
      <section class="container-x pb-20 pt-4" [attr.aria-label]="'nextPage.label' | translate">
        <a [routerLink]="n.path"
           class="group relative isolate flex min-h-64 items-end overflow-hidden rounded-[2rem] p-8 text-ivory shadow-lift sm:min-h-80 sm:p-12">
          <img [ngSrc]="n.image" fill sizes="100vw" class="-z-20 object-cover transition duration-[1.4s] ease-out group-hover:scale-105" alt="" />
          <span class="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/95 via-forest-900/70 to-forest-900/20"></span>
          <span class="flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <span>
              <span class="eyebrow !text-gold-300">{{ 'nextPage.label' | translate }}</span>
              <span class="font-display mt-2 block text-4xl font-semibold sm:text-5xl">{{ 'nextPage.' + n.key + '.title' | translate }}</span>
              <span class="mt-3 block max-w-xl text-ivory/75">{{ 'nextPage.' + n.key + '.text' | translate }}</span>
            </span>
            <span class="grid size-16 shrink-0 place-items-center rounded-full bg-gold-500 text-forest-900 transition duration-500 group-hover:translate-x-2 group-hover:bg-gold-400">
              <app-icon name="arrow" class="size-7" />
            </span>
          </span>
        </a>
      </section>
    }
  `,
})
export class NextPage {
  private readonly router = inject(Router);
  private readonly path = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );
  protected readonly next = computed(() => NEXT[this.path().split(/[?#]/)[0]] ?? null);
}
