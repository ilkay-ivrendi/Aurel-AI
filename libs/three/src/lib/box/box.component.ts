import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'aurel-ai-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss',
})
export class BoxComponent {
  @Input() color: string = 'red';
  @Input() scene!: THREE.Scene; // Accept scene as an input
  @Output() cubeClicked: EventEmitter<void> = new EventEmitter<void>();
  private cube!: THREE.Mesh;

  constructor() {}

  ngOnInit(): void {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.cube = new THREE.Mesh(geometry, material);

    // Add the cube to the provided Three.js scene
    this.scene.add(this.cube);
  }

  onMouseEnter(): void {
    // Rotate the cube slightly on mouse enter
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }

  onMouseLeave(): void {
    // No action needed on mouse leave
  }

  onClick(): void {
    // Emit a custom event when the cube is clicked
    this.cubeClicked.emit();
  }

  getObject(): THREE.Mesh {
    // Return the Three.js mesh object for the cube
    return this.cube;
  }
}
