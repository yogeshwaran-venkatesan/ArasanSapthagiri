import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { HOTEL, mapsDirectionsUrl, mapsEmbedUrl, NEARBY } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SafeUrlPipe } from '../../shared/ui/safe-url.pipe';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-location-page',
  imports: [NgOptimizedImage, TranslatePipe, Icon, PageHero, SectionHeading, CtaBand, SafeUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.templeNight" [eyebrow]="'home.location.eyebrow' | translate" [title]="'locationPage.title' | translate"
                   [lead]="'home.location.lead' | translate" />

    <section class="py-16 sm:py-24">
      <div class="container-x grid gap-12 lg:grid-cols-5">
        <div class="lg:col-span-2">
          <app-section-heading align="left" [eyebrow]="'locationPage.address' | translate" [title]="hotel.name" />
          <address class="mt-6 grid gap-4 not-italic text-forest-900">
            <p class="flex gap-3"><app-icon name="pin" class="mt-1 size-5 text-gold-600" />
              <span>{{ hotel.address.line1 }}, {{ hotel.address.line2 }},<br />{{ hotel.address.city }} – {{ hotel.address.pin }}, {{ hotel.address.state }}
                <span class="block text-sm text-muted">{{ 'footer.landmark' | translate }}</span></span></p>
            <a [href]="hotel.phoneHref" class="flex gap-3 py-1.5 hover:text-gold-600"><app-icon name="phone" class="size-5 text-gold-600" /> {{ hotel.phone }}</a>
            <a [href]="'mailto:' + hotel.email" class="flex gap-3 py-1.5 break-all hover:text-gold-600"><app-icon name="mail" class="size-5 text-gold-600" /> {{ hotel.email }}</a>
          </address>
          <a [href]="directions" target="_blank" rel="noopener" class="btn btn-gold mt-8"><app-icon name="directions" class="size-4" /> {{ 'common.directions' | translate }}</a>
        </div>
        <div class="overflow-hidden rounded-[2rem] shadow-soft lg:col-span-3">
          <iframe [src]="mapUrl | safeUrl" class="h-80 w-full border-0 sm:h-[28rem]" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                  [title]="'home.location.mapTitle' | translate"></iframe>
        </div>
      </div>
    </section>

    <section class="bg-forest-50 py-16 sm:py-24">
      <div class="container-x">
        <app-section-heading [eyebrow]="'locationPage.nearby.eyebrow' | translate" [title]="'locationPage.nearby.title' | translate" />
        <ol class="mx-auto mt-14 grid max-w-4xl gap-4">
          @for (n of nearby; track n.key) {
            <li class="flex items-center gap-5 rounded-3xl bg-ivory p-6 shadow-soft">
              <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold-500/15 text-gold-600"><app-icon [name]="n.icon" class="size-7" /></span>
              <span class="flex-1">
                <span class="font-display block text-xl font-semibold text-forest-900">{{ 'nearby.' + n.key | translate }}</span>
                <span class="text-sm text-muted">{{ 'locationPage.how.' + n.key | translate }}</span>
              </span>
              @if (n.minutes) {
                <span class="text-right"><span class="font-display block text-3xl font-semibold text-forest-800">{{ n.minutes }}</span>
                  <span class="text-xs text-muted">{{ 'common.min' | translate }}</span></span>
              }
            </li>
          }
        </ol>
        <p class="mx-auto mt-6 max-w-4xl text-center text-xs text-muted">{{ 'locationPage.timesNote' | translate }}</p>
      </div>
    </section>

    <section class="py-16 sm:py-24">
      <div class="container-x grid items-center gap-12 lg:grid-cols-2">
        <div class="grid grid-cols-2 gap-4">
          <div class="relative aspect-[4/3] overflow-hidden rounded-3xl"><img [ngSrc]="img.templeMandapam" fill sizes="25vw" class="object-cover" [alt]="'about.templeAlt' | translate" /></div>
          <div class="relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl"><img [ngSrc]="img.templeNight" fill sizes="25vw" class="object-cover" [alt]="'about.templeNightAlt' | translate" /></div>
        </div>
        <app-section-heading align="left" [eyebrow]="'locationPage.city.eyebrow' | translate" [title]="'locationPage.city.title' | translate"
                             [lead]="'locationPage.city.text' | translate" />
      </div>
    </section>

    <app-cta-band />
  `,
})
export class LocationPage {
  protected readonly hotel = HOTEL;
  protected readonly img = IMAGES;
  protected readonly nearby = NEARBY;
  protected readonly mapUrl = mapsEmbedUrl();
  protected readonly directions = mapsDirectionsUrl();

  constructor() {
    pageSeo('location', '/location', { image: IMAGES.templeNight });
  }
}
