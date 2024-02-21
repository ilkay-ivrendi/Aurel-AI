import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ThreeComponent } from '@aurel-ai/three';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, ThreeComponent, RouterModule],
  selector: 'aurel-ai-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'aurel-ai';
}
