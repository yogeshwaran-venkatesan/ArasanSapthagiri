import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { HOTEL } from '../core/hotel.config';
import { LanguageService } from '../core/i18n';
import { Icon } from '../shared/ui/icon';
import { Logo } from '../shared/ui/logo';
import { NAV } from './nav';

/**
 * Sticky header. Transparent over the home hero, solid ivory once the page
 * scrolls (or on inner pages). Slide-in menu on phones.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, Icon, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fixed inset-x-0 top-0 z-40 block',
    role: 'banner',
  },
  template: `
    <!-- Background layer. Kept separate: backdrop-filter on the host would make it the
         containing block for the fixed mobile drawer and trap it inside the bar. -->
    <div class="absolute inset-0 -z-10 transition duration-500" aria-hidden="true"
         [class]="solid() ? 'bg-ivory/95 shadow-soft backdrop-blur' : 'bg-transparent'"></div>
    <div class="scroll-progress" aria-hidden="true"></div>
    <div class="container-x flex h-20 items-center justify-between gap-6">
      <a routerLink="/" class="shrink-0">
        <app-logo [tone]="solid() ? 'dark' : 'light'" />
      </a>

      <nav class="hidden items-center gap-1 xl:flex" [attr.aria-label]="'nav.main' | translate">
        @for (item of nav; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="after:scale-x-100 !text-gold-500"
             [routerLinkActiveOptions]="{ exact: !!$any(item).exact }"
             class="relative px-3 py-2 text-sm font-semibold tracking-wide whitespace-nowrap transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform hover:text-gold-500"
             [class]="solid() ? 'text-forest-900' : 'text-ivory'">
            {{ item.label | translate }}
          </a>
        }
      </nav>

      <div class="flex items-center gap-2">
        @if (lang.multilingual) {
          <button type="button" (click)="lang.toggle()"
                  class="rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition hover:bg-black/5"
                  [class]="solid() ? 'text-forest-900' : 'text-ivory hover:bg-white/10'"
                  [attr.aria-label]="'nav.language' | translate">
            {{ lang.current() === 'en' ? 'தமிழ்' : 'English' }}
          </button>
        }
        <a [href]="hotel.phoneHref" class="hidden items-center gap-2 text-sm font-semibold whitespace-nowrap 2xl:flex"
           [class]="solid() ? 'text-forest-800' : 'text-ivory'">
          <app-icon name="phone" class="size-4" /> {{ hotel.phone }}
        </a>
        <a routerLink="/book" class="btn btn-gold hidden whitespace-nowrap sm:inline-flex">{{ 'nav.book' | translate }}</a>
        <button type="button" class="rounded-full p-2 xl:hidden" (click)="open.set(true)"
                [class]="solid() ? 'text-forest-900' : 'text-ivory'"
                [attr.aria-label]="'nav.openMenu' | translate" [attr.aria-expanded]="open()">
          <app-icon name="menu" class="size-7" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    @if (open()) {
      <div class="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
        <button type="button" class="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" (click)="open.set(false)"
                [attr.aria-label]="'nav.closeMenu' | translate"></button>
        <div class="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] animate-fade-up flex-col overflow-y-auto overscroll-contain bg-ivory p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-lift">
          <div class="flex items-center justify-between">
            <app-logo />
            <button type="button" class="rounded-full p-2 text-forest-900" (click)="open.set(false)"
                    [attr.aria-label]="'nav.closeMenu' | translate">
              <app-icon name="close" class="size-7" />
            </button>
          </div>
          <nav class="mt-8 flex flex-col">
            @for (item of nav; track item.path) {
              <a [routerLink]="item.path" routerLinkActive="!text-gold-600"
                 [routerLinkActiveOptions]="{ exact: !!$any(item).exact }"
                 class="font-display border-b border-forest-900/10 py-2.5 text-2xl font-semibold text-forest-900">
                {{ item.label | translate }}
              </a>
            }
          </nav>
          <div class="mt-auto grid gap-3 pt-8">
            <a routerLink="/book" class="btn btn-gold">{{ 'nav.book' | translate }}</a>
            <a [href]="hotel.phoneHref" class="btn btn-forest"><app-icon name="phone" class="size-4" /> {{ hotel.phone }}</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class Header {
  protected readonly nav = NAV;
  protected readonly hotel = HOTEL;
  protected readonly lang = inject(LanguageService);
  protected readonly open = signal(false);

  private readonly scrolled = signal(false);
  private readonly onHome = signal(true);
  /** Solid bar on inner pages, when scrolled, or while the menu is open. */
  protected readonly solid = () => this.scrolled() || !this.onHome() || this.open();

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe((e) => {
        this.onHome.set(e.urlAfterRedirects.split(/[?#]/)[0] === '/');
        this.open.set(false);
      });

    if (isBrowser) {
      const onScroll = () => this.scrolled.set(window.scrollY > 40);
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
      onScroll();
      // Lock page scroll while the mobile menu is open.
      effect(() => (document.body.style.overflow = this.open() ? 'hidden' : ''));
    }
  }
}
