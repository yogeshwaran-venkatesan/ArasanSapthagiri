import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { HOTEL, whatsappUrl } from '../core/hotel.config';
import { Icon } from '../shared/ui/icon';

/**
 * Always-reachable contact: a bottom action bar on phones (Call · WhatsApp ·
 * Book) and a floating WhatsApp button on larger screens.
 */
@Component({
  selector: 'app-quick-contact',
  imports: [RouterLink, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-forest-900/10 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
         [attr.aria-label]="'quick.label' | translate">
      <a [href]="hotel.phoneHref" class="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-forest-800">
        <app-icon name="phone" class="size-5" /> {{ 'quick.call' | translate }}
      </a>
      <a [href]="wa" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-[#0d7038]">
        <app-icon name="whatsapp" class="size-5" /> WhatsApp
      </a>
      <a routerLink="/book" class="flex flex-col items-center gap-1 bg-gold-500 py-2.5 text-xs font-bold text-forest-900">
        <app-icon name="calendar" class="size-5" /> {{ 'nav.book' | translate }}
      </a>
    </nav>

    <aside class="contents" [attr.aria-label]="'quick.whatsapp' | translate">
    <a [href]="wa" target="_blank" rel="noopener"
       class="fixed right-6 bottom-6 z-30 hidden size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lift transition hover:scale-105 sm:flex"
       [attr.aria-label]="'quick.whatsapp' | translate">
      <svg viewBox="0 0 32 32" class="size-7" fill="currentColor" aria-hidden="true">
        <path d="M16 3a13 13 0 0 0-11.1 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-4-.5-5.7-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 1 4.1.8.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.5-.4Z"/>
      </svg>
    </a>
    </aside>
  `,
})
export class QuickContact {
  protected readonly hotel = HOTEL;
  protected readonly wa = whatsappUrl('Hello! I would like to enquire about a room at Hotel Arasan Sapthagiri.');
}
