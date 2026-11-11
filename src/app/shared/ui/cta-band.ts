import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HOTEL } from '../../core/hotel.config';
import { Icon } from './icon';

/** Closing "book your stay" band reused at the bottom of inner pages. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block pb-16 sm:pb-24' },
  template: `
    <div class="container-x">
      <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest-800 to-forest-900 px-6 py-12 sm:rounded-[2.5rem] sm:px-8 sm:py-14 text-center text-ivory sm:px-16">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,179,94,0.25),transparent_45%)]" aria-hidden="true"></div>
        <div class="relative">
          <h2 class="font-display mx-auto max-w-2xl text-3xl font-semibold sm:text-4xl">{{ 'home.cta.title' | translate }}</h2>
          <p class="mx-auto mt-3 max-w-xl text-ivory/75">{{ 'home.cta.lead' | translate }}</p>
          <div class="mt-7 flex flex-wrap justify-center gap-3">
            <a routerLink="/book" class="btn btn-gold">{{ 'nav.book' | translate }}</a>
            <a [href]="hotel.phoneHref" class="btn btn-ghost text-ivory"><app-icon name="phone" class="size-4" /> {{ hotel.phone }}</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CtaBand {
  protected readonly hotel = HOTEL;
}
