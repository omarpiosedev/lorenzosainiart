'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Images for the carousel
const images = [
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-1.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-2.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-3.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-4.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-5.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-6.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-7.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-8.jpeg',
  'https://raw.githubusercontent.com/jankohlbach/canary-islands/main/assets/images/slider-9.jpeg',
];

// Project titles with slugs
const projects = [
  { title: 'Shooting', slug: 'shooting' },
  { title: 'Food & Drink', slug: 'food-drink' },
  { title: 'Matrimoni', slug: 'matrimoni' },
  { title: 'Drone', slug: 'drone' },
  { title: 'Allestimenti', slug: 'allestimenti' },
  { title: 'Eventi', slug: 'eventi' },
  { title: 'Party', slug: 'party' },
  { title: 'Sport', slug: 'sport' },
  { title: 'Coming Soon', slug: null },
];

// Vertex shader
const vertexShader = `
  float PI = 3.141592653589793;
  uniform vec2 uOffset;
  varying vec2 vUv;

  vec3 deformationCurve(vec3 position, vec2 uv) {
    position.x = position.x - (sin(uv.y * PI) * uOffset.x);
    return position;
  }

  void main() {
    vUv = uv;
    vec3 newPosition = deformationCurve(position, uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Fragment shader
const fragmentShader = `
  uniform vec2 uOffset;
  uniform sampler2D uTexture;
  uniform float uAlpha;
  varying vec2 vUv;

  vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
    vec2 rg = texture2D(textureImage, uv).rg;
    float b = texture2D(textureImage, uv + offset).b;
    return vec3(rg, b);
  }

  void main() {
    vec3 color = rgbShift(uTexture, vUv, uOffset);
    gl_FragColor = vec4(color, uAlpha);
  }
`;

type CarouselItem = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  buttonMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  index: number;
  isVisible: boolean;
};

export default function Carousel() {
  const params = useParams();
  const locale = params.locale as string;

  const watermarkWrapRef = useRef<HTMLDivElement>(null);
  const watermarkTextRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger for watermark text
  useGSAP(() => {
    if (!watermarkWrapRef.current || !watermarkTextRef.current) {
      return;
    }

    // ✅ CRITICAL FIX: Delay ScrollTrigger creation to avoid conflicts with page transition
    // Wait for page transition to complete before creating ScrollTrigger
    // Triple RAF ensures ScrollSmoother is resumed and ready
    // Declare rafId2/rafId3 at outer scope so cleanup can access them
    let rafId2: number | undefined;
    let rafId3: number | undefined;

    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        rafId3 = requestAnimationFrame(() => {
          if (!watermarkWrapRef.current || !watermarkTextRef.current) {
            return;
          }

          const tlWatermark = gsap.timeline({
            scrollTrigger: {
              trigger: watermarkWrapRef.current,
              start: 'top top',
              end: '+=800%',
              scrub: true,
              pin: true,
              pinSpacing: false,
            },
            defaults: { ease: 'none' },
          });

          tlWatermark.fromTo(
            watermarkTextRef.current,
            { x: '20%' },
            { x: '-60%' },
          );
        });
      });
    });

    // Cleanup RAF on unmount
    return () => {
      if (rafId1 !== undefined) {
        cancelAnimationFrame(rafId1);
      }
      if (rafId2 !== undefined) {
        cancelAnimationFrame(rafId2);
      }
      if (rafId3 !== undefined) {
        cancelAnimationFrame(rafId3);
      }
    };
  }, { scope: watermarkWrapRef });

  // Set initial opacity for titles and buttons
  useGSAP(() => {
    if (!titlesRef.current) {
      return;
    }

    const titleElements = gsap.utils.toArray<HTMLElement>('.project-title');
    const buttonElements = gsap.utils.toArray<HTMLElement>('.project-button');

    titleElements.forEach((title) => {
      gsap.set(title, { opacity: 0 });
    });

    buttonElements.forEach((button) => {
      gsap.set(button, { opacity: 0 });
    });
  }, { scope: titlesRef });

  // Three.js scene setup
  useEffect(() => {
    if (!canvasRef.current || !wrapRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    let animationId: number;
    let scrollTrigger: ScrollTrigger | null = null;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.3, 1.75);
    camera.rotation.z = 2 * Math.PI * 0.01;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Texture loading
    const textureLoader = new THREE.TextureLoader();
    const textures = images.map(image => textureLoader.load(image));

    // Geometry
    const geometry = new THREE.PlaneGeometry(1, 0.75, 10, 10);
    const uOffset = new THREE.Vector2(0, 0);

    // Create meshes with shader materials
    const items: CarouselItem[] = [];
    const buttonGeometry = new THREE.PlaneGeometry(0.1, 0.1);
    for (let i = 0; i < textures.length; i++) {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.ShaderMaterial({
          uniforms: {
            uOffset: { value: uOffset },
            uTexture: { value: textures[i] },
            uAlpha: { value: 1.0 },
          },
          vertexShader,
          fragmentShader,
        }),
      );

      // Create invisible button mesh that follows the image
      const buttonMesh = new THREE.Mesh(
        buttonGeometry,
        new THREE.MeshBasicMaterial({ visible: false }),
      );

      items.push({ mesh, buttonMesh, index: i, isVisible: false });
      scene.add(mesh);
      scene.add(buttonMesh);
    }

    // Update mesh positions and sync titles
    const updateMeshes = () => {
      if (!scrollTrigger) {
        return;
      }

      const width = 1.1;
      const progress = scrollTrigger.progress;
      // Calculate movement to show all 9 images (from first to last centered)
      const totalMovement = width * (items.length - 1);
      const isMobile = window.innerWidth < 768;

      // Find the closest item to center (for mobile)
      let closestItem: CarouselItem | undefined;
      let minDistance = Number.POSITIVE_INFINITY;

      items.forEach((item) => {
        // Linear positioning: first image centered at start, last image centered at end
        item.mesh.position.x = (width * item.index) - (progress * totalMovement);
        item.mesh.rotation.y = 2 * Math.PI * 0.03;

        // Position button mesh with the image (centered on the image)
        item.buttonMesh.position.copy(item.mesh.position);
        item.buttonMesh.position.z = item.mesh.position.z + 0.01; // Slightly in front

        // Track closest item for mobile
        const distance = Math.abs(item.mesh.position.x);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      items.forEach((item) => {
        // Sync title and button position with mesh
        const titleElement = document.querySelector(`[data-project-index="${item.index}"]`) as HTMLElement;
        const buttonElement = document.querySelector(`[data-project-button="${item.index}"]`) as HTMLElement;

        // Convert 3D position to screen position with responsive scaling
        const scaleFactor = isMobile ? window.innerWidth / 2.5 : window.innerWidth / 3.5;
        const meshScreenX = item.mesh.position.x * scaleFactor;

        // Convert button mesh 3D position to 2D screen coordinates
        const buttonVector = new THREE.Vector3();
        item.buttonMesh.getWorldPosition(buttonVector);
        buttonVector.project(camera);

        const buttonScreenX = (buttonVector.x * 0.5 + 0.5) * window.innerWidth;
        const buttonScreenY = (-buttonVector.y * 0.5 + 0.5) * window.innerHeight;

        // Animate text visibility
        const distance = Math.abs(item.mesh.position.x);

        // On mobile: show only the closest title
        // On desktop: show titles within threshold
        let shouldShow = false;

        if (isMobile) {
          // Mobile: only show the title of the centered image
          shouldShow = closestItem !== undefined && item.index === closestItem.index;
        } else {
          // Desktop: show titles within distance threshold
          shouldShow = distance < 0.7;
        }

        if (titleElement) {
          // Position title to follow mesh horizontally
          titleElement.style.transform = `translateX(${meshScreenX}px)`;

          if (isMobile) {
            titleElement.style.display = shouldShow ? 'block' : 'none';
          } else {
            titleElement.style.display = 'block';
          }

          // Fade in/out animation with smooth movement
          if (shouldShow) {
            gsap.to(titleElement, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          } else {
            gsap.to(titleElement, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              ease: 'power2.in',
              overwrite: 'auto',
            });
          }
        }

        if (buttonElement) {
          // Position button using 3D to 2D projection (only update position, not opacity)
          const newLeft = `${buttonScreenX}px`;
          const newTop = `${buttonScreenY}px`;

          if (buttonElement.style.left !== newLeft) {
            buttonElement.style.left = newLeft;
          }
          if (buttonElement.style.top !== newTop) {
            buttonElement.style.top = newTop;
          }
          if (!buttonElement.style.transform.includes('translate')) {
            buttonElement.style.transform = 'translate(-50%, -50%)';
          }

          if (isMobile) {
            buttonElement.style.display = shouldShow ? 'flex' : 'none';
          } else {
            buttonElement.style.display = 'flex';
          }

          // Only animate when visibility state changes
          if (shouldShow !== item.isVisible) {
            item.isVisible = shouldShow;

            if (shouldShow) {
              gsap.to(buttonElement, {
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            } else {
              gsap.to(buttonElement, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                overwrite: 'auto',
              });
            }
          }
        }
      });
    };

    // Render loop
    const render = () => {
      if (scrollTrigger?.isActive) {
        uOffset.set(scrollTrigger.getVelocity() * 0.00002, 0);
      } else {
        uOffset.set(0, 0);
      }

      updateMeshes();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    };

    // Resize handler
    const resizeCanvas = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', resizeCanvas);

    // ✅ CRITICAL FIX: Delay ScrollTrigger creation to avoid conflicts with page transition
    // Wait for page transition to complete before creating ScrollTrigger
    // Triple RAF ensures ScrollSmoother is resumed and ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // ScrollTrigger for canvas pinning - create after scene is ready
          scrollTrigger = ScrollTrigger.create({
            trigger: wrap,
            start: 'top top',
            end: '+=800%',
            pin: true,
          });

          // Force refresh to ensure correct calculations
          ScrollTrigger.refresh();
        });
      });
    });

    // Start render loop
    animationId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);

      if (scrollTrigger) {
        scrollTrigger.kill();
      }

      // Dispose Three.js resources
      geometry.dispose();
      items.forEach((item) => {
        item.mesh.material.dispose();
        scene.remove(item.mesh);
      });
      textures.forEach(texture => texture.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Watermark */}
      <div
        ref={watermarkWrapRef}
        className="overflow-hidden"
      >
        <span
          ref={watermarkTextRef}
          className="inline-block text-[35vw] font-black leading-none uppercase opacity-[0.05] pointer-events-none whitespace-nowrap"
          style={{ fontFamily: 'var(--font-clash-display, sans-serif)' }}
        >
          PHOTOGRAPHY
        </span>
      </div>

      {/* Canvas carousel */}
      <div ref={wrapRef} className="w-full h-screen relative">
        {/* Project titles */}
        <div ref={titlesRef} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          {projects.map((project, index) => (
            <h2
              key={index}
              data-project-index={index}
              className="project-title absolute top-[35%] text-[var(--text-lg)] md:text-[var(--text-xl)] font-black uppercase text-black whitespace-nowrap text-wrap-balanced heading-compact font-bacasime"
              style={{
              }}
            >
              {project.title}
            </h2>
          ))}
        </div>

        {/* Project buttons */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {projects.map((project, index) => (
            project.slug
              ? (
                  <Link
                    key={index}
                    href={`/${locale}/portfolio/photography/${project.slug}`}
                    data-project-button={index}
                    className="project-button absolute w-14 h-14 flex items-center justify-center pointer-events-auto rounded-full border border-black/10 backdrop-blur-md bg-white/60 hover:bg-white/90 hover:border-black/30 hover:scale-105 group shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10 btn-fluid"
                    style={{
                      opacity: 0,
                      transition: 'transform 0.4s ease-out, background-color 0.4s ease-out, border-color 0.4s ease-out, box-shadow 0.4s ease-out',
                    }}
                  >
                    <svg
                      className="w-5 h-5 text-black/80 transition-all duration-400 group-hover:text-black group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                )
              : null
          ))}
        </div>

        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
