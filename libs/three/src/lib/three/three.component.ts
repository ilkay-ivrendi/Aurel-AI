import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  signal,
} from '@angular/core';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/orbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { BoxComponent } from '../box/box.component';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

@Component({
  selector: 'aurel-ai-three',
  standalone: true,
  imports: [CommonModule, BoxComponent],
  templateUrl: './three.component.html',
  styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
  @ViewChild('threecanvas', { static: false })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  // Stage Properties
  @Input({ alias: 'cameraZ' }) public cameraZ: number = 50;
  @Input() public fieldOfView: number = 75;
  @Input('nearClipping') public nearClippingPlane = 0.1;
  @Input('farClipping') public farClippingPlane = 10000;

  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  isSceneInitialized = signal(false);

  dragableObjects: any[] = [];
  mouse!: THREE.Vector2;
  raycaster!: THREE.Raycaster;

  private orbitControls!: OrbitControls;
  private gridHelper!: THREE.GridHelper;
  private dragControls!: DragControls;

  INTERSECTED: any;
  theta = 0;
  pointer = new THREE.Vector2();
  radius = 5;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

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
    this.loadFbxModel();
    // this.setuoDragControls();
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
    this.isSceneInitialized.set(true);
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

    const animate = () => {
      requestAnimationFrame(animate);

      if (this.orbitControls) {
        this.orbitControls.update();
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
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
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 1.25;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.maxZoom = 200;
    this.orbitControls.minZoom = 0.1;
    this.orbitControls.target = new THREE.Vector3(0, 140, 0);
    this.camera.position.y = 160;
  }

  private setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 10); // White light, full intensity
    directionalLight.position.set(1, 1, 1).normalize(); // Set light direction
    this.scene.add(directionalLight);
  }

  private loadGridHelper() {
    this.gridHelper = new THREE.GridHelper(1000, 100);
    this.scene.add(this.gridHelper);
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

  async loadFbxModel(): Promise<void> {
    const fbxLoader = new FBXLoader();
    const fbx = await fbxLoader.loadAsync('./assets/models/Ch48_nonPBR.fbx');

    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material;
        console.log(child);
        if (material) {
          // Set shininess to a fixed value
          material.shininess = 30;
          // Remove shininess map
          material.shininessMap = null;
        }

        if (material.name == 'Ch48_hair') {
          // Set opacity to 1 (fully opaque)
          material.opacity = 1;
          material.transparent = false;
        }
      }
    });

    this.scene.add(fbx);

    // Set up camera to focus on the model's head with a portrait-like view
    // const boundingBox = new THREE.Box3().setFromObject(fbx);
    // const boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0xffff00);
    // this.scene.add(boundingBoxHelper);

    // const center = new THREE.Vector3();
    // boundingBox.getCenter(center);
  }

  setuoDragControls() {
    const geometry = new THREE.BoxGeometry();
    for (let i = 0; i < 200; i++) {
      const object = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
      );

      object.position.x = Math.random() * 30 - 15;
      object.position.y = Math.random() * 15 - 7.5;
      object.position.z = Math.random() * 20 - 10;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() * 2 + 1;
      object.scale.y = Math.random() * 2 + 1;
      object.scale.z = Math.random() * 2 + 1;

      object.castShadow = true;
      object.receiveShadow = true;

      this.scene.add(object);

      this.dragableObjects.push(object);
    }

    this.dragControls = new DragControls(
      [...this.dragableObjects],
      this.camera,
      this.renderer.domElement
    );

    // Add event listener for 'drag' event
    this.dragControls.addEventListener('drag', () => this.renderer);
  }

  onCubeClicked(): void {
    console.log('Cube clicked!');
    // Add your custom logic here
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  @HostListener('window:click', ['$event'])
  onClick(event: KeyboardEvent): void {
    // Handle keydown event here
    console.log('Click happened');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Handle keydown event here
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    // Handle keyup event here
    console.log('Key Down Event!');
  }
}
