import { Component, HostBinding, Input, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThreeComponent } from '@aurel-ai/three';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '@aurel-ai/auth';
import { CredentialsService } from 'libs/auth/src/lib/credentials.service';
@Component({
  selector: 'aurel-ai-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    ThreeComponent,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    FlexLayoutModule,
    MatCardModule,
    MatSlideToggleModule,
    HttpClientModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  providers: [AuthService],
})
export class ShellComponent {
  @Input() title = 'Shell';

  private breakpointObserver = inject(BreakpointObserver);
  private authenticationService = inject(AuthService);
  private router = inject(Router);
  private credentialsService = inject(CredentialsService);
  user_data = signal(this.credentialsService.credentials?.user_data);

  isDarkMode: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.user_data());
  }

  onThemeChanged() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    }
    this.isDarkMode = !this.isDarkMode;
  }

  logOut() {
    this.authenticationService
      .logOut()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
