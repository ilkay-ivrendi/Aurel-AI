import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/orbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

@Component({
  selector: 'aurel-ai-three',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './three.component.html',
  styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
  @ViewChild('threecanvas', { static: false })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  // Stage Properties
  @Input({ alias: 'cameraZ' }) public cameraZ: number = 100;
  @Input() public fieldOfView: number = 75;
  @Input('nearClipping') public nearClippingPlane = 0.1;
  @Input('farClipping') public farClippingPlane = 10000;

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

    // this.setupSkyBox();
    // this.setupSkySphere();
    this.setupSkyDome();
    this.setupLights(); // Add this line to set up lights

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
    // this.scene.background = new THREE.Color(0xfffff);

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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    // Add tone mapping and gamma correction if needed
    // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const aniamte = () => {
      requestAnimationFrame(aniamte);

      if (this.orbitControls) {
        this.orbitControls.update();
      }

      this.renderer.render(this.scene, this.camera);
    };
    aniamte();
    console.log('render loop started');
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
    console.log('resize canvas');
  }

  private loadOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.25;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.maxZoom = 10000;
    this.orbitControls.minZoom = 0.1;
  }

  private setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // White light, full intensity
    directionalLight.position.set(1, 1, 1).normalize(); // Set light direction
    this.scene.add(directionalLight);

    console.log('lights added');
  }

  private loadGridHelper() {
    this.gridHelper = new THREE.GridHelper(1000, 100);
    this.scene.add(this.gridHelper);
    console.log('grid added');
  }

  private setupSkySphere() {
    const geometry = new THREE.SphereGeometry(1000, 32, 32); // Large sphere geometry
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(''); // Load sky texture
    texture.minFilter = THREE.LinearFilter; // Enable texture filtering
    texture.magFilter = THREE.LinearFilter; // Enable texture filtering
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    }); // Create material with sky texture
    const skySphere = new THREE.Mesh(geometry, material); // Create sky sphere
    this.scene.add(skySphere); // Add sky sphere to scene
    console.log('sky added');
  }

  private setupSkyBox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './assets/sky/Skybox_8/Right_Tex.png',
      './assets/sky/Skybox_8/Left_Tex.png',
      './assets/sky/Skybox_8/Up_Tex.png',
      './assets/sky/Skybox_8/Down_Tex.png',
      './assets/sky/Skybox_8/Front_Tex.png',
      './assets/sky/Skybox_8/Back_Tex.png',
    ]);
    this.scene.background = texture;
  }

  private setupSkyDome() {
    const geometry = new THREE.SphereGeometry(1000, 64, 64); // Large sphere geometry
    const loader = new RGBELoader(); // Use RGBELoader for HDR images
    loader.setDataType(THREE.FloatType); // Set data type explicitly

    const texture = loader.load(
      './assets/sky/hdri/sky_2k.hdr',
      (hdrTexture) => {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

        this.scene.background = envMap;
        this.scene.environment = envMap;

        hdrTexture.dispose(); // Dispose HDR texture after use
        pmremGenerator.dispose(); // Clean up PMREMGenerator
      }
    );

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create skydome material with the HDRI texture
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.BackSide, // Render on the back side of the sphere
      metalness: 0.0, // Adjust as needed
      roughness: 1.0, // Adjust as needed
    });

    // Create skydome mesh
    const skyDome = new THREE.Mesh(geometry, material);
    this.scene.add(skyDome); // Add skydome to the scene
  }
}
