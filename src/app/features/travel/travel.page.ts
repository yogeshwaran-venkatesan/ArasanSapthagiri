import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HOTEL, TRAVEL_PACKAGES, TravelPackage, whatsappUrl } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { travelSchema } from '../../core/structured-data';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SectionHeading } from '../../shared/ui/section-heading';

/** Card colour themes, one per package, in package order. */
const THEMES = [
  'from-forest-800 to-forest-600',
  'from-[#6b3f1d] to-[#a8682c]',
  'from-[#0f4c5c] to-[#2a8a9a]',
  'from-[#29443a] to-[#5b7f62]',
];

@Component({
  selector: 'app-travel-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon, PageHero, SectionHeading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.templeMandapam" [eyebrow]="'travel.eyebrow' | translate" [title]="'travel.title' | translate"
                   [lead]="'travel.lead' | translate" />

    <!-- Packages -->
    <section class="py-16 sm:py-24">
      <div class="container-x">
        <app-section-heading [eyebrow]="'travel.packagesEyebrow' | translate" [title]="'travel.packagesTitle' | translate"
                             [lead]="'travel.packagesLead' | translate" />

        <div class="mt-14 grid gap-8 lg:grid-cols-2">
          @for (p of packages; track p.id; let i = $index) {
            <article [id]="p.id" class="group flex scroll-mt-28 flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift">
              <!-- Card header -->
              <header class="relative overflow-hidden bg-gradient-to-br p-6 text-ivory sm:p-8" [class]="theme(i)">
                <app-icon [name]="p.icon" class="absolute -right-6 -bottom-8 size-44 text-white/10 transition duration-700 group-hover:scale-110 group-hover:rotate-6" />
                <div class="relative flex items-start justify-between gap-4">
                  <span class="grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur"><app-icon [name]="p.icon" class="size-7" /></span>
                  <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {{ 'travel.kind.' + p.kind | translate }}
                    @if (p.distanceKm) { · {{ 'travel.distance' | translate: { km: p.distanceKm } }} }
                  </span>
                </div>
                <p class="relative mt-6 text-xs font-bold tracking-[0.3em] text-gold-300 uppercase">{{ 'travel.packageNo' | translate: { n: i + 1 } }}</p>
                <h3 class="font-display relative mt-1 text-3xl font-semibold sm:text-4xl">{{ 'travel.packages.' + p.id + '.name' | translate }}</h3>
                <p class="relative mt-2 max-w-md text-sm text-ivory/80">{{ 'travel.packages.' + p.id + '.tagline' | translate }}</p>
              </header>

              <!-- Route: 4 stops -->
              <ol class="relative flex-1 px-6 pt-7 pb-2 sm:px-8 sm:pt-8">
                @for (s of p.sites; track s; let last = $last; let n = $index) {
                  <li class="relative flex gap-5 pb-6">
                    @if (!last) { <span class="absolute top-9 bottom-0 left-[1.05rem] w-px bg-gradient-to-b from-gold-400 to-gold-200" aria-hidden="true"></span> }
                    <span class="font-display relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 border-gold-400 bg-ivory text-base font-semibold text-forest-800">{{ n + 1 }}</span>
                    <span>
                      <span class="block font-semibold text-forest-900">{{ 'travel.sites.' + s + '.name' | translate }}</span>
                      <span class="mt-0.5 block text-sm leading-relaxed text-muted">{{ 'travel.sites.' + s + '.text' | translate }}</span>
                    </span>
                  </li>
                }
              </ol>

              <!-- Footer -->
              <footer class="flex flex-col gap-4 border-t border-forest-900/10 px-6 py-6 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span class="block text-xs text-muted">{{ 'travel.priceLabel' | translate }}</span>
                  <span class="font-display text-xl font-semibold text-forest-900">{{ 'travel.askPrice' | translate }}</span>
                </span>
                <span class="grid gap-2 sm:flex sm:flex-wrap">
                  <a [href]="wa(p)" target="_blank" rel="noopener" class="btn btn-forest !px-5 !py-2.5 text-sm">
                    <app-icon name="whatsapp" class="size-4" /> {{ 'travel.enquire' | translate }}
                  </a>
                  <a routerLink="/book" [queryParams]="{ package: p.id }" class="btn btn-ghost !px-5 !py-2.5 text-sm">{{ 'travel.addToStay' | translate }}</a>
                </span>
              </footer>
            </article>
          }
        </div>
        <p class="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">{{ 'travel.note' | translate }}</p>
      </div>
    </section>

    <!-- How it works -->
    <section class="bg-forest-900 py-16 sm:py-24 text-ivory">
      <div class="container-x">
        <app-section-heading tone="light" [eyebrow]="'travel.how.eyebrow' | translate" [title]="'travel.how.title' | translate" />
        <ol class="mt-14 grid gap-6 md:grid-cols-3">
          @for (step of steps; track step.key; let n = $index) {
            <li class="relative rounded-3xl border border-white/10 bg-white/5 p-8">
              <!-- Decorative step number, drawn with CSS so it isn't read out or contrast-checked as text -->
              <span class="font-display absolute top-6 right-7 text-6xl font-semibold text-white/10 after:content-[attr(data-n)]" aria-hidden="true" [attr.data-n]="'0' + (n + 1)"></span>
              <app-icon [name]="step.icon" class="size-9 text-gold-400" />
              <h3 class="font-display mt-6 text-2xl font-semibold">{{ 'travel.how.' + step.key + '.title' | translate }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-ivory/70">{{ 'travel.how.' + step.key + '.text' | translate }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <!-- Fleet -->
    <section class="py-16 sm:py-24">
      <div class="container-x">
        <app-section-heading [eyebrow]="'facilitiesPage.travel.eyebrow' | translate" [title]="'travel.fleet.title' | translate"
                             [lead]="'facilitiesPage.travel.text' | translate" />
        <div class="mt-12 grid gap-5 sm:grid-cols-3">
          @for (src of img.travel; track src; let i = $index) {
            <figure class="overflow-hidden rounded-3xl bg-white shadow-soft">
              <div class="relative aspect-[5/3]">
                <img [ngSrc]="src" fill sizes="(min-width:640px) 33vw, 100vw" class="object-cover" [alt]="'facilitiesPage.travel.vehicles.' + i | translate" />
              </div>
              <figcaption class="p-4 text-center text-sm font-semibold text-forest-900">{{ 'facilitiesPage.travel.vehicles.' + i | translate }}</figcaption>
            </figure>
          }
        </div>
        <div class="mt-12 flex flex-wrap justify-center gap-3">
          <a [href]="wa(null)" target="_blank" rel="noopener" class="btn btn-gold"><app-icon name="whatsapp" class="size-4" /> {{ 'travel.custom' | translate }}</a>
          <a [href]="hotel.phoneHref" class="btn btn-ghost"><app-icon name="phone" class="size-4" /> {{ hotel.phone }}</a>
        </div>
      </div>
    </section>
  `,
})
export class TravelPage {
  private readonly t = inject(TranslateService);
  protected readonly hotel = HOTEL;
  protected readonly img = IMAGES;
  protected readonly packages = TRAVEL_PACKAGES;
  protected readonly steps = [
    { key: 'choose', icon: 'route' },
    { key: 'tell', icon: 'whatsapp' },
    { key: 'ride', icon: 'car' },
  ];

  constructor() {
    pageSeo('travel', '/travel', { image: IMAGES.templeMandapam, extra: (t) => [travelSchema(t)] });
  }

  protected theme(i: number): string {
    return THEMES[i % THEMES.length];
  }

  /** WhatsApp link for a package, or a general "plan my trip" message when null. */
  protected wa(p: TravelPackage | null): string {
    const text = p
      ? this.t.instant('travel.waPackage', { name: this.t.instant(`travel.packages.${p.id}.name`) })
      : this.t.instant('travel.waCustom');
    return whatsappUrl(text);
  }
}
