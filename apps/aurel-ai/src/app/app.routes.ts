import { Route } from '@angular/router';
import { AUTH_ROUTES } from '@aurel-ai/auth';
import { NotFoundComponent } from '@aurel-ai/shared-ui';
import { ShellService } from '@aurel-ai/shell';

export const appRoutes: Route[] = [
  ShellService.childRoutes([
    {
      path: 'home',
      loadComponent: () =>
        import('./home/home.component').then((c) => c.HomeComponent),
    },
    {
      path: 'about',
      loadComponent: () =>
        import('./about/about.component').then((c) => c.AboutComponent),
    },
    {
      path: 'chat',
      loadComponent: () =>
        import('./chat/chat.component').then((c) => c.ChatComponent),
    },
    {
      path: 'three',
      loadChildren: () => import('@aurel-ai/three').then((r) => r.THREE_ROUTES),
    },
  ]),
  
  // Include the authentication routes
  ...AUTH_ROUTES, // Spread the authentication routes array

  // Fallback when no prior route is matched
  {
    path: '**',
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];
