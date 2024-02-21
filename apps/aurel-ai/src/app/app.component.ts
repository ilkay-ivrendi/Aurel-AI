import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThreeComponent } from '@aurel-ai/three';
import { ShellComponent } from '@aurel-ai/shell';
@Component({
  standalone: true,
  imports: [ShellComponent, ThreeComponent, RouterModule],
  selector: 'aurel-ai-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Aurel-AI';
}
