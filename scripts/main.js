
// Main Application Logic
import { SceneManager } from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Initialize 3D Scene
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const sceneManager = new SceneManager(canvasContainer);
        sceneManager.animate();
    }

    // GSAP Animations
    initAnimations();
});

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Reveal
    gsap.from("#navbar", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.2
    });

    // Hero Reveal
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTimeline
        .from("#hero h1 span", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            skewY: 7
        })
        .from("#hero p", {
            y: 30,
            opacity: 0,
            duration: 1
        }, "-=0.8")
        .from("#hero a", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        }, "-=0.6");

    // Section Reveals
    gsap.utils.toArray("section:not(#hero)").forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    });
}
