import { Component, HostBinding, Input, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThreeComponent } from '@aurel-ai/three';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  @Input() title = 'Shell';
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  @HostBinding('class')
  currentTheme: 'light-theme' | 'dark-theme' = 'light-theme';

  isDarkMode: boolean = false;

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
    console.log(this.isDarkMode);
  }
}
