import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HOTEL, NEARBY } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-about-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon, PageHero, SectionHeading, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.reception" [eyebrow]="'about.eyebrow' | translate" [title]="'about.title' | translate"
                   [lead]="'about.lead' | translate" />

    <section class="py-16 sm:py-24">
      <div class="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <app-section-heading align="left" [eyebrow]="'about.story.eyebrow' | translate" [title]="'about.story.title' | translate" />
          <p class="mt-6 text-lg leading-relaxed text-muted">{{ 'home.welcome.p1' | translate }}</p>
          <p class="mt-4 leading-relaxed text-muted">{{ 'about.story.p2' | translate }}</p>
          <p class="mt-4 leading-relaxed text-muted">{{ 'about.story.p3' | translate }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
            <img [ngSrc]="img.reception" fill sizes="(min-width:1024px) 45vw, 100vw" class="object-cover" [alt]="'gallery.reception' | translate" />
          </div>
          <div class="relative aspect-square overflow-hidden rounded-3xl">
            <img [ngSrc]="img.templeMandapam" fill sizes="25vw" class="object-cover" [alt]="'about.templeAlt' | translate" />
          </div>
          <div class="relative aspect-square overflow-hidden rounded-3xl">
            <img [ngSrc]="img.templeNight" fill sizes="25vw" class="object-cover" [alt]="'about.templeNightAlt' | translate" />
          </div>
        </div>
      </div>
    </section>

    <section class="bg-forest-50 py-16 sm:py-24">
      <div class="container-x">
        <app-section-heading [eyebrow]="'about.why.eyebrow' | translate" [title]="'about.why.title' | translate" />
        <ul class="mt-14 grid gap-6 md:grid-cols-3">
          @for (w of why; track w.key) {
            <li class="rounded-3xl bg-ivory p-8 shadow-soft">
              <span class="grid size-14 place-items-center rounded-2xl bg-gold-500/15 text-gold-600"><app-icon [name]="w.icon" class="size-7" /></span>
              <h3 class="font-display mt-6 text-2xl font-semibold text-forest-900">{{ 'about.why.' + w.key + '.title' | translate }}</h3>
              <p class="mt-3 leading-relaxed text-muted">{{ 'about.why.' + w.key + '.text' | translate }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="py-16 sm:py-24">
      <div class="container-x">
        <dl class="grid grid-cols-2 gap-3 text-center sm:gap-6 lg:grid-cols-4">
          <div class="flex flex-col-reverse justify-end gap-2 rounded-3xl border border-forest-900/10 p-5 sm:p-8">
            <dt class="text-sm text-muted">{{ 'home.highlights.rooms' | translate }}</dt>
            <dd class="font-display text-4xl font-semibold whitespace-nowrap text-forest-800 sm:text-5xl">{{ hotel.rooms }}</dd>
          </div>
          @for (n of nearby.slice(0, 3); track n.key) {
            <div class="flex flex-col-reverse justify-end gap-2 rounded-3xl border border-forest-900/10 p-5 sm:p-8">
              <dt class="text-sm text-muted">{{ 'nearby.' + n.key | translate }}</dt>
              <dd class="font-display text-4xl font-semibold whitespace-nowrap text-forest-800 sm:text-5xl">{{ n.minutes }}<span class="text-xl sm:text-2xl"> {{ 'common.min' | translate }}</span></dd>
            </div>
          }
        </dl>
        <p class="mt-10 text-center">
          <a routerLink="/location" class="inline-flex items-center gap-2 py-2 font-semibold text-forest-800 hover:text-gold-600">
            {{ 'about.seeLocation' | translate }} <app-icon name="arrow" class="size-4" /></a>
        </p>
      </div>
    </section>

    <app-cta-band />
  `,
})
export class AboutPage {
  protected readonly img = IMAGES;
  protected readonly hotel = HOTEL;
  protected readonly nearby = NEARBY;
  protected readonly why = [
    { key: 'location', icon: 'pin' },
    { key: 'family', icon: 'heart' },
    { key: 'service', icon: 'bell' },
  ];

  constructor() {
    pageSeo('about', '/about', { image: IMAGES.reception });
  }
}
