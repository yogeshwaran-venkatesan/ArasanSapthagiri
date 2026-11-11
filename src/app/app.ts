import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Header } from './layout/header';
import { NextPage } from './layout/next-page';
import { QuickContact } from './layout/quick-contact';
import { RouteProgress } from './layout/route-progress';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, QuickContact, NextPage, RouteProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold-500 focus:px-5 focus:py-2 focus:font-semibold">
      Skip to content
    </a>
    <app-route-progress />
    <app-header />
    <main id="main">
      <router-outlet />
      <app-next-page />
    </main>
    <app-footer />
    <app-quick-contact />
  `,
})
export class App {}
