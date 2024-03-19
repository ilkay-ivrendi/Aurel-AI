import { Injectable } from '@angular/core';
import { ShellComponent } from './shell/shell.component';
import { Route, Routes } from '@angular/router';
import { AuthenticationGuard } from '@aurel-ai/auth';
@Injectable({
  providedIn: 'root',
})
export class ShellService {
 /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      providers: []
    };
  }
}
