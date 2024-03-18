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
  private animationMixer!: THREE.AnimationMixer;
  // Create a clock to measure time
  clock = new THREE.Clock();

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

    this.loadFbxModel();
    this.loadOrbitControls();
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
      
      if (this.animationMixer) {
        // Calculate deltaTime using the clock
        const deltaTime = this.clock.getDelta();
        this.animationMixer.update(deltaTime);
        console.log("animation mixer is updating");
      }

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
    this.animationMixer = new THREE.AnimationMixer(fbx);
    
    const animations = await this.loadAnimations(); // Load locomotion animations
    fbx.animations = animations;
    fbx.castShadow = true;

    console.log('Animations:', animations);
    
    this.playAnimationByName('idle', fbx.animations);

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

  }

  async loadAnimations(): Promise<THREE.AnimationClip[]> {
    // Load locomotion animations here and return the loaded animations as an array
    // Example:
    const animations: THREE.AnimationClip[] = [];
    const animationIdle = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/idle.fbx'
    );
    animationIdle.name = 'idle';

    const animationRunning = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/running.fbx'
    );
    animationRunning.name = 'running';

    const animationWalking = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/walking.fbx'
    );
    animationWalking.name = 'walking';

    const animationJump = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/jump.fbx'
    );
    animationJump.name = 'jump';

    const animationLeftStrafe = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/left strafe.fbx'
    );
    animationLeftStrafe.name = 'left-strafe';

    const animationLeftStrafeWalking = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/left strafe walking.fbx'
    );
    animationLeftStrafeWalking.name = 'left strafe walking baby';

    const animationLeftTurn90 = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/left turn 90.fbx'
    );
    animationLeftTurn90.name = 'left-turn-90';

    const animationLeftTurn = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/left turn.fbx'
    );
    animationLeftTurn.name = 'left-turn';

    const animationRightStrafeWalking = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/right strafe walking.fbx'
    );
    animationLeftStrafeWalking.name = 'right-strafe-walking';

    const animationRightTurn90 = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/right turn 90.fbx'
    );
    animationRightTurn90.name = 'right-turn-90';

    const animationRightStrafe = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/right strafe.fbx'
    );
    animationRightStrafe.name = 'right-strafe';

    const animationRightTurn = await this.loadAnimation(
      './assets/animations/Locomotion Pack Astra/right turn.fbx'
    );
    animationRightTurn.name = 'right-turn';

    // Add loaded animations to the array
    animations.push(
      animationIdle,
      animationWalking,
      animationJump,
      animationRunning,
      animationLeftStrafe,
      animationLeftStrafeWalking,
      animationLeftTurn,
      animationLeftTurn90,
      animationRightStrafe,
      animationRightStrafeWalking,
      animationRightTurn,
      animationRightTurn90
    );
    return animations;
  }

  async loadAnimation(path: string): Promise<THREE.AnimationClip> {
    const loader = new FBXLoader();
    const fbx = await loader.loadAsync(path);
    const mixer = new THREE.AnimationMixer(fbx);
    const action = mixer.clipAction(fbx.animations[0]); // Assuming only one animation per FBX
    action.clampWhenFinished = true;
    // action.setLoop(,THREE.LoopRepeat);
    return action.getClip(); // Return the AnimationClip
  }

private playAnimationByName(animationName: string, animations: THREE.AnimationClip[]): void {
  if (!this.animationMixer) {
    console.error('Animation mixer is not initialized or no actions are present.');
    return;
  }

  // Find the animation clip by name
  const clip = animations.find((clip) => clip.name === animationName);

  if (clip) {
    // Create animation action and play it
    const animationAction = this.animationMixer.clipAction(clip);
    console.log(clip, animationAction);
    animationAction.play();
  } else {
    console.error(`Animation clip '${animationName}' not found.`);
  }
}

  setupDragControls() {
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
