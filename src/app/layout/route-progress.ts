import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

/** Thin gold bar across the top while the next page is loading. */
@Component({
  selector: 'app-route-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-x-0 top-0 z-[60] block h-[3px]', 'aria-hidden': 'true' },
  template: `@if (loading()) { <div class="route-progress h-full"></div> }`,
})
export class RouteProgress {
  protected readonly loading = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => this.loading.set(true), 80); // only for slow loads
        } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
          clearTimeout(this.timer);
          this.loading.set(false);
        }
      });
  }
}
