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
import { GridHelper } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/orbitControls';

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
  @Input({ alias: 'cameraZ' }) public cameraZ: number = 400;
  @Input() public fieldOfView: number = 0.75;
  @Input('nearClipping') public nearClippingPlane = 0.1;
  @Input('farClipping') public farClippingPlane = 1000;

  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  private orbitControls!: OrbitControls;
  private gridHelper!: THREE.GridHelper;

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createScene();
    this.startRenderingLoop();

    this.loadGridHelper();
    this.loadOrbitControls();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfffff);

    // Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const render = () => {
      requestAnimationFrame(render);

      if (this.orbitControls) {
        this.orbitControls.update();
      }

      this.renderer.render(this.scene, this.camera);
    };
    render();
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
      this.getAspectRatio();
    }
  }

  private loadOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }

  private loadGridHelper() {
    this.gridHelper = new THREE.GridHelper(100, 10);
    this.scene.add(this.gridHelper);
  }
}
