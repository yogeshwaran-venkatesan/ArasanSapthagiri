import { Routes } from '@angular/router';

/** Every page is lazy-loaded and prerendered to static HTML at build time. */
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage) },
  { path: 'about', loadComponent: () => import('./features/about/about.page').then((m) => m.AboutPage) },
  { path: 'rooms', loadComponent: () => import('./features/rooms/rooms.page').then((m) => m.RoomsPage) },
  { path: 'dining', loadComponent: () => import('./features/dining/dining.page').then((m) => m.DiningPage) },
  { path: 'facilities', loadComponent: () => import('./features/facilities/facilities.page').then((m) => m.FacilitiesPage) },
  { path: 'location', loadComponent: () => import('./features/location/location.page').then((m) => m.LocationPage) },
  { path: 'travel', loadComponent: () => import('./features/travel/travel.page').then((m) => m.TravelPage) },
  { path: 'gallery', loadComponent: () => import('./features/gallery/gallery.page').then((m) => m.GalleryPage) },
  { path: 'book', loadComponent: () => import('./features/book/book.page').then((m) => m.BookPage) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.page').then((m) => m.ContactPage) },
  /** Prerendered as /404.html for the host to serve on unknown URLs (see scripts/postbuild.mjs). */
  { path: '404', loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage) },
  { path: '**', loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage) },
];
