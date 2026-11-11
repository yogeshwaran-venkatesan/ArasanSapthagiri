import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Wordmark + emblem. The emblem is a simplified gopuram silhouette inside a
 * gold-ringed seal, echoing the hotel's existing green-and-gold mark.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-3' },
  template: `
    <svg viewBox="0 0 48 48" class="size-11 shrink-0" role="img" aria-label="Hotel Arasan Sapthagiri">
      <circle cx="24" cy="24" r="23" fill="#0f3a2a" />
      <circle cx="24" cy="24" r="20" fill="none" stroke="#c39a3c" stroke-width="1.2" />
      <path fill="#d6b35e" d="M24 9l2 3h-4l2-3Zm-4 4h8l1 4h-10l1-4Zm-2 5h12l1 4H17l1-4Zm-2 5h16l1 5H15l1-5Zm-2 6h20v8H14v-8Z" />
      <path fill="#0f3a2a" d="M22 31h4v6h-4z" />
    </svg>
    <span class="leading-none">
      <span class="block text-[0.6rem] font-bold tracking-[0.35em] uppercase" [class]="tone() === 'light' ? 'text-gold-300' : 'text-gold-600'">Hotel</span>
      <span class="font-display block text-xl font-semibold tracking-wide sm:text-2xl" [class]="tone() === 'light' ? 'text-ivory' : 'text-forest-900'">
        Arasan Sapthagiri
      </span>
    </span>
  `,
})
export class Logo {
  readonly tone = input<'dark' | 'light'>('dark');
}
