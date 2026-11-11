import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FACILITIES } from '../../core/hotel.config';
import { IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHero } from '../../shared/ui/page-hero';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-facilities-page',
  imports: [NgOptimizedImage, RouterLink, TranslatePipe, Icon, PageHero, SectionHeading, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.conference" [eyebrow]="'home.facilities.eyebrow' | translate" [title]="'facilitiesPage.title' | translate"
                   [lead]="'facilitiesPage.lead' | translate" />

    <section class="py-16 sm:py-24">
      <div class="container-x">
        <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          @for (f of facilities; track f.key) {
            <li class="group flex gap-5 rounded-3xl border border-forest-900/10 bg-white/60 p-6 transition hover:border-gold-400 hover:bg-white hover:shadow-soft">
              <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-forest-50 text-forest-700 transition group-hover:bg-gold-500 group-hover:text-forest-900">
                <app-icon [name]="f.icon" class="size-7" />
              </span>
              <span>
                <span class="font-display block text-xl font-semibold text-forest-900">{{ 'facilities.items.' + f.key + '.name' | translate }}</span>
                <span class="mt-1 block text-sm leading-relaxed text-muted">{{ 'facilities.items.' + f.key + '.text' | translate }}</span>
              </span>
            </li>
          }
        </ul>
      </div>
    </section>

    <!-- Conference hall -->
    <section class="bg-forest-50 py-16 sm:py-24">
      <div class="container-x grid items-center gap-12 lg:grid-cols-2">
        <div class="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
          <img [ngSrc]="img.conference" fill sizes="(min-width:1024px) 50vw, 100vw" class="object-cover" [alt]="'gallery.conference' | translate" />
        </div>
        <div>
          <app-section-heading align="left" [eyebrow]="'facilitiesPage.conference.eyebrow' | translate"
                               [title]="'facilitiesPage.conference.title' | translate" [lead]="'facilitiesPage.conference.text' | translate" />
          <a routerLink="/contact" class="btn btn-forest mt-8">{{ 'facilitiesPage.conference.cta' | translate }}</a>
        </div>
      </div>
    </section>

    <!-- Travel desk -->
    <section class="py-16 sm:py-24">
      <div class="container-x">
        <app-section-heading [eyebrow]="'facilitiesPage.travel.eyebrow' | translate" [title]="'facilitiesPage.travel.title' | translate"
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
      </div>
    </section>

    <app-cta-band />
  `,
})
export class FacilitiesPage {
  protected readonly img = IMAGES;
  protected readonly facilities = FACILITIES;

  constructor() {
    pageSeo('facilities', '/facilities', { image: IMAGES.conference });
  }
}
