import { Route } from '@angular/router';
import { ShellService } from '@aurel-ai/shell';

export const appRoutes: Route[] = [
  ShellService.childRoutes([
    {
      path: 'about',
      loadComponent: () =>
        import('./about/about.component').then((c) => c.AboutComponent),
    },
    {
      path: 'three',
      loadChildren: () =>
        import('@aurel-ai/three').then((r) => r.THREE_ROUTES),
    },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
