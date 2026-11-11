import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Eyebrow + serif title + optional lead, with the gold ornament divider. */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div [class]="align() === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
      <p class="eyebrow" [class.!text-gold-300]="tone() === 'light'">{{ eyebrow() }}</p>
      <h2 class="section-title mt-3" [class.!text-ivory]="tone() === 'light'">{{ title() }}</h2>
      @if (align() === 'center') {
        <div class="ornament" aria-hidden="true"><span class="size-1.5 rotate-45 bg-current"></span></div>
      }
      @if (lead()) {
        <p class="mt-4 text-lg leading-relaxed" [class]="tone() === 'light' ? 'text-ivory/80' : 'text-muted'">{{ lead() }}</p>
      }
    </div>
  `,
})
export class SectionHeading {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly align = input<'left' | 'center'>('center');
  readonly tone = input<'dark' | 'light'>('dark');
}
