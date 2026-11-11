import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HOTEL, mapsDirectionsUrl } from '../core/hotel.config';
import { Icon } from '../shared/ui/icon';
import { Logo } from '../shared/ui/logo';
import { NAV } from './nav';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, Icon, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-forest-900 text-ivory/80', role: 'contentinfo' },
  template: `
    <div class="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
      <div class="lg:col-span-2">
        <app-logo tone="light" />
        <p class="mt-5 max-w-md text-sm leading-relaxed">{{ 'footer.about' | translate }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a routerLink="/book" class="btn btn-gold">{{ 'nav.book' | translate }}</a>
          <a [href]="directions" target="_blank" rel="noopener" class="btn btn-ghost text-ivory">
            <app-icon name="directions" class="size-4" /> {{ 'common.directions' | translate }}
          </a>
        </div>
      </div>

      <div>
        <h2 class="eyebrow !text-gold-300">{{ 'footer.explore' | translate }}</h2>
        <ul class="mt-4 grid grid-cols-2 gap-x-6 text-sm sm:grid-cols-1">
          @for (item of nav; track item.path) {
            <li><a [routerLink]="item.path" class="inline-block py-2 transition hover:text-gold-300">{{ item.label | translate }}</a></li>
          }
        </ul>
      </div>

      <div>
        <h2 class="eyebrow !text-gold-300">{{ 'footer.contact' | translate }}</h2>
        <address class="mt-5 grid gap-1 text-sm not-italic">
          <p class="flex gap-3 py-2"><app-icon name="pin" class="mt-0.5 size-4 text-gold-400" />
            <span>{{ hotel.address.line1 }}, {{ hotel.address.line2 }},<br />{{ hotel.address.city }} – {{ hotel.address.pin }}<br />
              <span class="text-ivory/60">{{ 'footer.landmark' | translate }}</span></span></p>
          <a [href]="hotel.phoneHref" class="flex gap-3 py-2 hover:text-gold-300"><app-icon name="phone" class="size-4 text-gold-400" /> {{ hotel.phone }}</a>
          <a [href]="'mailto:' + hotel.email" class="flex gap-3 py-2 break-all hover:text-gold-300"><app-icon name="mail" class="size-4 text-gold-400" /> {{ hotel.email }}</a>
        </address>
      </div>
    </div>
    <div class="border-t border-ivory/10">
      <div class="container-x flex flex-col gap-2 pt-6 pb-[calc(5rem+env(safe-area-inset-bottom))] text-xs text-ivory/50 sm:flex-row sm:justify-between sm:pb-6">
        <p>© {{ year }} {{ hotel.name }}. {{ 'footer.rights' | translate }}</p>
        <p>{{ 'footer.tagline' | translate }}</p>
      </div>
    </div>
  `,
})
export class Footer {
  protected readonly hotel = HOTEL;
  protected readonly nav = NAV;
  protected readonly year = new Date().getFullYear();
  protected readonly directions = mapsDirectionsUrl();
}
