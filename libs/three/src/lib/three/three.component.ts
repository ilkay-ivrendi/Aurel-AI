import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'aurel-ai-three',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three.component.html',
  styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
  @ViewChild('threecanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Stage Properties
  @Input() public cameraZ: number = 400;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane = 1;
  @Input('farClipping') public farClippingPlane = 1000;

  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createScene();
    this.startRenderingLoop();
  }

  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFF00);

    // Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: ThreeComponent = this;
    const render = () => {
      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);
    };
    render();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvasContainer = this.canvas.parentElement;
    if (!canvasContainer) {
      return; // Exit early if canvas container is null
    }

    const { clientWidth, clientHeight } = canvasContainer;
    if (clientWidth && clientHeight) {
      this.canvas.width = clientWidth;
      this.canvas.height = clientHeight;
      // Optionally, adjust aspect ratio here if needed
    }
  }
}
