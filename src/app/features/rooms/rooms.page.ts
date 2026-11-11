import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import { HOTEL, ROOM_AMENITIES, ROOM_TYPES, RoomType, whatsappUrl } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-rooms-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon, PageHero, SectionHeading, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.hero" [eyebrow]="'home.rooms.eyebrow' | translate" [title]="'roomsPage.title' | translate"
                   [lead]="'home.rooms.lead' | translate" />

    <!-- Room types: alternating image / text rows -->
    <section class="py-16 sm:py-24">
      <div class="container-x grid gap-20">
        @for (r of rooms; track r.id; let odd = $odd) {
          <article [id]="r.id" class="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2">
            <div class="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift" [class.lg:order-2]="odd">
              <img [ngSrc]="img.rooms[r.id]" fill sizes="(min-width:1024px) 50vw, 100vw" class="object-cover"
                   [alt]="'rooms.types.' + r.id + '.name' | translate" />
            </div>
            <div>
              <p class="eyebrow">{{ 'roomsPage.roomLabel' | translate }}</p>
              <h2 class="section-title mt-3">{{ 'rooms.types.' + r.id + '.name' | translate }}</h2>
              <p class="mt-5 text-lg leading-relaxed text-muted">{{ 'rooms.types.' + r.id + '.short' | translate }}</p>
              <p class="mt-3 leading-relaxed text-muted">{{ 'roomsPage.shared' | translate }}</p>
              <p class="font-display mt-6 text-2xl font-semibold text-forest-800">
                {{ r.rate ? ('₹' + r.rate + ' ' + ('rooms.perNight' | translate)) : ('rooms.askRate' | translate) }}
              </p>
              <div class="mt-6 flex flex-wrap gap-3">
                <a routerLink="/book" [queryParams]="{ room: r.id }" class="btn btn-gold">{{ 'roomsPage.enquire' | translate }}</a>
                <a [href]="wa(r)" target="_blank" rel="noopener" class="btn btn-forest">
                  <app-icon name="whatsapp" class="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </article>
        }
      </div>
    </section>

    <!-- In every room -->
    <section class="bg-forest-900 py-16 sm:py-24 text-ivory">
      <div class="container-x">
        <app-section-heading tone="light" [eyebrow]="'roomsPage.inEvery.eyebrow' | translate" [title]="'roomsPage.inEvery.title' | translate" />
        <ul class="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          @for (a of amenities; track a.key) {
            <li class="flex flex-col items-center gap-3 rounded-3xl border border-ivory/10 p-6 text-center">
              <app-icon [name]="a.icon" class="size-8 text-gold-300" />
              <span class="text-sm font-semibold">{{ 'rooms.amenities.' + a.key | translate }}</span>
            </li>
          }
        </ul>
        <p class="mx-auto mt-10 max-w-2xl text-center text-sm text-ivory/60">{{ 'roomsPage.note' | translate }}</p>
      </div>
    </section>

    <div class="pt-16 sm:pt-24"><app-cta-band /></div>
  `,
})
export class RoomsPage {
  private readonly t = inject(TranslateService);
  protected readonly img = IMAGES;
  protected readonly rooms = ROOM_TYPES;
  protected readonly amenities = ROOM_AMENITIES;
  protected readonly hotel = HOTEL;

  constructor() {
    pageSeo('rooms', '/rooms', { image: IMAGES.hero });
  }

  /** WhatsApp link pre-filled with the room name (in the current language). */
  wa(r: RoomType): string {
    return whatsappUrl(this.t.instant('roomsPage.waMessage', { room: this.t.instant(`rooms.types.${r.id}.name`) }));
  }
}
