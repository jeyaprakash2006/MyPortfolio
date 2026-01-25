import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.frameId = null;

        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        // Fog for depth
        this.scene.fog = new THREE.FogExp2(0x050505, 0.002);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.y = 2;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Objects
        this.createParticles();
        this.createLights();

        // Mouse interaction
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;

        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createParticles() {
        // Create a molecular cloud particle system
        const geometry = new THREE.BufferGeometry();
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color1 = new THREE.Color(0x00ffaa); // Fluorescent Green
        const color2 = new THREE.Color(0x4353ff); // Deep Blue

        for (let i = 0; i < count; i++) {
            // Atomic distribution
            const r = Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            // Random molecular cloud
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Mix colors for chemical gradient
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Generate a circular texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        const center = 16;
        const radius = 16;

        context.beginPath();
        context.arc(center, center, radius, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.PointsMaterial({
            size: 0.15, // Increased size for better visibility with texture
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            map: texture,
            alphaTest: 0.1,
            depthWrite: false, // Helps with transparency blending
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        this.mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.frameId = requestAnimationFrame(() => this.animate());

        // Smooth rotation
        this.targetX = this.mouseX * 2;
        this.targetY = this.mouseY * 2;

        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += (this.targetY - this.particles.rotation.x) * 0.05;
        this.particles.rotation.y += (this.targetX - this.particles.rotation.y) * 0.05;

        // Gentle floating movement
        const time = Date.now() * 0.0005;
        this.scene.position.y = Math.sin(time) * 0.2;

        this.renderer.render(this.scene, this.camera);
    }
}
