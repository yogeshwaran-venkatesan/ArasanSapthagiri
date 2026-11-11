import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';

interface Venue {
  key: string;
  image: string;
  points: string[];
}

@Component({
  selector: 'app-dining-page',
  imports: [NgOptimizedImage, TranslatePipe, Icon, PageHero, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.rooftopNight" [eyebrow]="'home.dining.eyebrow' | translate" [title]="'dining.title' | translate"
                   [lead]="'home.dining.lead' | translate" />

    <section class="py-16 sm:py-24">
      <div class="container-x grid gap-24">
        @for (v of venues; track v.key; let odd = $odd) {
          <article class="grid items-center gap-12 lg:grid-cols-2">
            <div class="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift" [class.lg:order-2]="odd">
              <img [ngSrc]="v.image" fill sizes="(min-width:1024px) 50vw, 100vw" class="object-cover" [alt]="'dining.' + v.key + '.title' | translate" />
            </div>
            <div>
              <p class="eyebrow">{{ 'dining.' + v.key + '.eyebrow' | translate }}</p>
              <h2 class="section-title mt-3">{{ 'dining.' + v.key + '.title' | translate }}</h2>
              <p class="mt-5 text-lg leading-relaxed text-muted">{{ 'dining.' + v.key + '.text' | translate }}</p>
              <ul class="mt-6 grid gap-3">
                @for (p of v.points; track p) {
                  <li class="flex gap-3 text-forest-900">
                    <app-icon name="check" class="mt-0.5 size-5 text-gold-600" /> {{ 'dining.' + v.key + '.points.' + p | translate }}
                  </li>
                }
              </ul>
            </div>
          </article>
        }
      </div>
    </section>

    <section class="bg-sand py-14 sm:py-20">
      <div class="container-x grid gap-6 md:grid-cols-3">
        @for (f of extras; track f.key) {
          <div class="flex gap-4 rounded-3xl bg-ivory p-7 shadow-soft">
            <app-icon [name]="f.icon" class="size-8 shrink-0 text-gold-600" />
            <div>
              <h3 class="font-display text-xl font-semibold text-forest-900">{{ 'dining.extras.' + f.key + '.title' | translate }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-muted">{{ 'dining.extras.' + f.key + '.text' | translate }}</p>
            </div>
          </div>
        }
      </div>
    </section>

    <div class="pt-16 sm:pt-24"><app-cta-band /></div>
  `,
})
export class DiningPage {
  protected readonly img = IMAGES;
  protected readonly venues: Venue[] = [
    { key: 'rooftop', image: IMAGES.rooftop, points: ['open', 'enclosed', 'tea'] },
    { key: 'multicuisine', image: IMAGES.restaurant, points: ['cuisines', 'vegNonVeg', 'ac'] },
  ];
  protected readonly extras = [
    { key: 'roomService', icon: 'bell' },
    { key: 'views', icon: 'sunset' },
    { key: 'events', icon: 'presentation' },
  ];

  constructor() {
    pageSeo('dining', '/dining', { image: IMAGES.rooftop });
  }
}
