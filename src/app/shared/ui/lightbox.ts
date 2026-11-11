import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  PLATFORM_ID,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GalleryImage } from '../../core/images';
import { Icon } from './icon';

/**
 * Full-screen photo viewer built on the native <dialog> element, which gives
 * focus trapping, Esc-to-close and a top-layer backdrop for free.
 * Keyboard: ← / → to move, Esc to close. Touch: swipe left / right.
 */
@Component({
  selector: 'app-lightbox',
  imports: [TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialog class="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ivory"
            [attr.aria-label]="'galleryPage.viewer' | translate"
            (close)="index.set(null)" (keydown)="onKey($event)"
            (touchstart)="touchStart($event)" (touchend)="touchEnd($event)">
      @if (current(); as img) {
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <p class="text-sm text-ivory/70" aria-live="polite">{{ (index() ?? 0) + 1 }} / {{ images().length }}</p>
            <button type="button" (click)="close()" class="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                    [attr.aria-label]="'galleryPage.close' | translate">
              <app-icon name="close" class="size-5" />
            </button>
          </div>

          <figure class="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4 pb-24 sm:px-20 sm:pb-6" (click)="backdropClick($event)">
            <img [src]="img.src" [alt]="img.alt | translate" class="max-h-[75dvh] w-auto max-w-full rounded-2xl object-contain shadow-2xl animate-fade-up" />
            <figcaption class="font-display text-center text-xl sm:text-2xl">{{ img.alt | translate }}</figcaption>
          </figure>

          @if (images().length > 1) {
            <button type="button" (click)="step(-1)" class="nav-btn left-[calc(50%-4rem)] sm:left-6" [attr.aria-label]="'galleryPage.prev' | translate">
              <app-icon name="chevronLeft" class="size-6" />
            </button>
            <button type="button" (click)="step(1)" class="nav-btn right-[calc(50%-4rem)] sm:right-6" [attr.aria-label]="'galleryPage.next' | translate">
              <app-icon name="chevronRight" class="size-6" />
            </button>
          }
        </div>
      }
    </dialog>
  `,
  styles: `
    .lightbox::backdrop { background: rgb(6 26 18 / 0.94); backdrop-filter: blur(6px); }
    .nav-btn {
      position: absolute; bottom: 1.5rem;
      display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 9999px;
      background: rgb(255 255 255 / 0.1); transition: background 0.2s;
    }
    @media (min-width: 640px) { .nav-btn { bottom: auto; top: 50%; translate: 0 -50%; } }
    .nav-btn:hover, .nav-btn:focus-visible { background: rgb(255 255 255 / 0.22); }
  `,
})
export class Lightbox {
  readonly images = input.required<GalleryImage[]>();
  /** Index of the open photo, or null when closed. Two-way bindable: [(index)]. */
  readonly index = model<number | null>(null);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private touchX = 0;
  private opener: HTMLElement | null = null;

  protected readonly current = computed(() => {
    const i = this.index();
    return i === null ? null : (this.images()[i] ?? null);
  });

  constructor() {
    effect(() => {
      if (!this.browser) return;
      const el = this.dialog().nativeElement;
      const open = this.index() !== null;
      if (open && !el.open) {
        this.opener = this.document.activeElement as HTMLElement | null;
        el.showModal();
        this.document.documentElement.style.overflow = 'hidden';
      } else if (!open && el.open) {
        el.close();
      }
      if (!open) {
        this.document.documentElement.style.overflow = '';
        this.opener?.focus();
        this.opener = null;
      }
    });
  }

  close(): void {
    this.index.set(null);
  }

  step(delta: number): void {
    const n = this.images().length;
    this.index.update((i) => (i === null ? null : (i + delta + n) % n));
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'ArrowLeft') this.step(-1);
  }

  /** Clicking the empty area around the photo closes the viewer. */
  protected backdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.close();
  }

  protected touchStart(e: TouchEvent): void {
    this.touchX = e.changedTouches[0]?.clientX ?? 0;
  }

  protected touchEnd(e: TouchEvent): void {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - this.touchX;
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }
}
