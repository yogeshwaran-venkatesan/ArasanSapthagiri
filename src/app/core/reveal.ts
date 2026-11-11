import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Scroll-reveal: content below the fold fades and rises into place as the
 * visitor scrolls, with a short stagger for items that appear together.
 *
 * Safe by design:
 *  - The prerendered HTML is fully visible; elements are only hidden in the
 *    browser, and only if they start below the fold (no flash on load).
 *  - A single scroll check reveals everything above the bottom of the screen,
 *    so fast scrolling or jumping to an anchor never leaves content hidden.
 *  - Respects "reduce motion" and printing.
 */
const TARGETS = [
  'main [data-reveal]',
  'main app-section-heading',
  'main app-cta-band',
  'main app-next-page',
  'main article',
  'main li',
  'main figure',
  'main form',
  'main aside',
  'main address',
  'main dl > div',
  'main iframe',
  'main section > .container-x > p',
].join(',');

@Injectable({ providedIn: 'root' })
export class RevealService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private pending: HTMLElement[] = [];
  private frame = 0;

  init(): void {
    if (!this.browser) return;
    const win = this.document.defaultView!;
    if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const schedule = () => {
      if (!this.frame) this.frame = win.requestAnimationFrame(() => ((this.frame = 0), this.check()));
    };
    win.addEventListener('scroll', schedule, { passive: true });
    win.addEventListener('resize', schedule, { passive: true });

    // Look for new content whenever the page changes: after navigation (once the router
    // has restored the scroll position) and when sections are added, e.g. by a filter.
    let scanFrame = 0;
    const scheduleScan = () => {
      if (!scanFrame) scanFrame = win.requestAnimationFrame(() => ((scanFrame = 0), this.scan(), this.check()));
    };
    this.router.events.pipe(filter((e) => e instanceof Scroll)).subscribe(scheduleScan);
    new MutationObserver(scheduleScan).observe(this.document.body, { childList: true, subtree: true });
  }

  private scan(): void {
    const view = this.document.defaultView!;
    const all = Array.from(this.document.querySelectorAll<HTMLElement>(TARGETS));
    // Animate the outermost match only (a room card, not each bullet inside it).
    const set = new Set(all);
    const outer = all.filter((el) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });
    for (const el of outer) {
      if (el.classList.contains('reveal-in') || el.classList.contains('reveal-pending')) continue;
      if (el.getBoundingClientRect().top < view.innerHeight * 0.92) continue; // already on screen
      el.classList.add('reveal-pending');
      this.pending.push(el);
    }
  }

  private check(): void {
    if (!this.pending.length) return;
    const limit = this.document.defaultView!.innerHeight * 0.92;
    let batch = 0;
    this.pending = this.pending.filter((el) => {
      if (!el.isConnected) return false;
      if (el.getBoundingClientRect().top > limit) return true;
      el.style.setProperty('--reveal-delay', `${Math.min(batch++, 6) * 90}ms`);
      el.classList.add('reveal-in');
      el.classList.remove('reveal-pending');
      return false;
    });
  }
}
