import { RenderMode, ServerRoute } from '@angular/ssr';

/** Static site: every route is prerendered (SSG) — fast, cheap to host, great for SEO. */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Prerender },
];
