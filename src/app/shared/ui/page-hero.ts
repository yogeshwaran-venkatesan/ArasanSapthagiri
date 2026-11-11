import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Title band for inner pages: photo under a deep-green wash, serif title. */
@Component({
  selector: 'app-page-hero',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <section class="relative isolate overflow-hidden bg-forest-900 pt-32 pb-14 text-ivory sm:pt-44 sm:pb-28">
      @if (image()) {
        <img [ngSrc]="image()!" fill priority sizes="100vw" class="-z-20 object-cover opacity-60" alt="" />
      }
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/80 to-forest-900/50"></div>
      <div class="container-x">
        <p class="eyebrow !text-gold-300">{{ eyebrow() }}</p>
        <h1 class="font-display mt-4 max-w-3xl text-[2.6rem] leading-[1.08] font-semibold min-[400px]:text-5xl sm:text-6xl">{{ title() }}</h1>
        @if (lead()) {
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-ivory/80 sm:text-lg">{{ lead() }}</p>
        }
        <ng-content />
      </div>
    </section>
  `,
})
export class PageHero {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly image = input<string>();
}
