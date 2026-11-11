import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GALLERY_CATEGORIES, GalleryCategory, IMAGES } from '../../core/images';
import { pageSeo } from '../../core/page-seo';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { Lightbox } from '../../shared/ui/lightbox';
import { PageHero } from '../../shared/ui/page-hero';

@Component({
  selector: 'app-gallery-page',
  imports: [NgOptimizedImage, TranslatePipe, Icon, PageHero, CtaBand, Lightbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-hero [image]="img.rooftopNight" [eyebrow]="'home.gallery.eyebrow' | translate" [title]="'galleryPage.title' | translate"
                   [lead]="'galleryPage.lead' | translate" />

    <section class="py-14 sm:py-20">
      <div class="container-x">
        <div class="flex flex-wrap justify-center gap-2" role="group" [attr.aria-label]="'galleryPage.filter' | translate">
          @for (c of filters; track c) {
            <button type="button" (click)="category.set(c)" [attr.aria-pressed]="category() === c"
                    class="min-h-11 rounded-full border px-4 py-2.5 text-sm font-semibold transition sm:px-5"
                    [class]="category() === c ? 'border-forest-800 bg-forest-800 text-ivory' : 'border-forest-900/15 text-forest-900 hover:border-gold-500'">
              {{ 'galleryPage.categories.' + c | translate }}
              <span class="ml-1 opacity-60">{{ count(c) }}</span>
            </button>
          }
        </div>

        <ul class="mt-12 grid auto-rows-[14rem] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:auto-rows-[16rem] lg:grid-cols-4">
          @for (g of visible(); track g.src; let i = $index) {
            <li [class]="i % 7 === 0 ? 'col-span-2 row-span-2' : ''">
              <button type="button" (click)="open.set(i)" class="group relative block size-full overflow-hidden rounded-3xl bg-sand focus-visible:outline-4 focus-visible:outline-gold-500"
                      [attr.aria-label]="('galleryPage.openPhoto' | translate) + ': ' + (g.alt | translate)">
                <img [ngSrc]="g.src" fill sizes="(min-width:1024px) 25vw, 50vw" class="object-cover transition duration-700 group-hover:scale-105" alt="" />
                <span class="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"></span>
                <span class="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left text-sm font-semibold text-ivory opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {{ g.alt | translate }} <app-icon name="expand" class="size-5 shrink-0" />
                </span>
              </button>
            </li>
          }
        </ul>
        <p class="mt-8 text-center text-xs text-muted">{{ 'galleryPage.note' | translate }}</p>
      </div>
    </section>

    <app-cta-band />
    <app-lightbox [images]="visible()" [(index)]="open" />
  `,
})
export class GalleryPage {
  protected readonly img = IMAGES;
  protected readonly filters: ('all' | GalleryCategory)[] = ['all', ...GALLERY_CATEGORIES];
  protected readonly category = signal<'all' | GalleryCategory>('all');
  protected readonly open = signal<number | null>(null);
  protected readonly visible = computed(() =>
    this.category() === 'all' ? IMAGES.gallery : IMAGES.gallery.filter((g) => g.category === this.category()),
  );

  constructor() {
    pageSeo('gallery', '/gallery', { image: IMAGES.rooftopNight });
  }

  protected count(c: 'all' | GalleryCategory): number {
    return c === 'all' ? IMAGES.gallery.length : IMAGES.gallery.filter((g) => g.category === c).length;
  }
}
