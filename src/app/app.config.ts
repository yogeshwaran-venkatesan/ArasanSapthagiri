import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { routes } from './app.routes';
import { BundledTranslateLoader, LanguageService } from './core/i18n';
import { RevealService } from './core/reveal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
      // Fetch every page in the background after the first one loads, so moving on is instant.
      withPreloading(PreloadAllModules),
    ),
    provideClientHydration(withEventReplay()),
    provideTranslateService({ loader: provideTranslateLoader(BundledTranslateLoader), fallbackLang: 'en' }),
    provideAppInitializer(() => inject(LanguageService).init()),
    provideAppInitializer(() => inject(RevealService).init()),
  ],
};
