'use client';

import type { Application, DisplacementFilter, Sprite, Texture } from 'pixi.js';
import { useEffect, useRef } from 'react';

type PixiLiquidImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function PixiLiquidImage({
  src,
  alt,
  className,
}: PixiLiquidImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    let isMounted = true;
    let sprite: Sprite | null = null;
    let displacementSprite: Sprite | null = null;
    let displacementFilter: DisplacementFilter | null = null;

    // Dynamically import Pixi.js (client-side only)
    import('pixi.js').then(async (PIXI) => {
      if (!isMounted || !canvasRef.current) {
        return;
      }

      // Create Pixi application
      const app = new PIXI.Application();
      await app.init({
        canvas: canvasRef.current,
        width: canvasRef.current.clientWidth,
        height: canvasRef.current.clientHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
      });

      appRef.current = app;

      // Load main image
      const texture = await PIXI.Assets.load(src);
      sprite = PIXI.Sprite.from(texture as Texture);

      // Scale to fill container
      const scaleX = app.screen.width / sprite.width;
      const scaleY = app.screen.height / sprite.height;
      const scale = Math.max(scaleX, scaleY);
      sprite.scale.set(scale);

      // Center sprite
      sprite.x = (app.screen.width - sprite.width) / 2;
      sprite.y = (app.screen.height - sprite.height) / 2;

      app.stage.addChild(sprite);

      // Create procedural displacement map for water effect
      const displacementCanvas = document.createElement('canvas');
      displacementCanvas.width = 512;
      displacementCanvas.height = 512;
      const ctx = displacementCanvas.getContext('2d');

      if (ctx) {
        // Generate noise pattern for water displacement
        const imageData = ctx.createImageData(512, 512);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const value = Math.random() * 255;
          imageData.data[i] = value; // R
          imageData.data[i + 1] = value; // G
          imageData.data[i + 2] = value; // B
          imageData.data[i + 3] = 255; // A
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const displacementTexture = PIXI.Texture.from(displacementCanvas);
      displacementSprite = PIXI.Sprite.from(displacementTexture);
      displacementSprite.texture.source.wrapMode = 'repeat';
      displacementSprite.scale.set(2);

      app.stage.addChild(displacementSprite);

      // Create displacement filter
      displacementFilter = new PIXI.DisplacementFilter({
        sprite: displacementSprite,
        scale: 50, // Intensity of the distortion
      });

      sprite.filters = [displacementFilter];

      // Animation loop - create water wave effect
      let time = 0;
      const animate = () => {
        if (!isMounted || !displacementSprite) {
          return;
        }

        time += 0.01;

        // Move displacement map to create flowing water effect
        displacementSprite.x = Math.sin(time) * 20;
        displacementSprite.y = Math.cos(time * 0.8) * 20;

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    }).catch((error) => {
      console.error('Failed to load Pixi.js:', error);
    });

    // Cleanup
    return () => {
      isMounted = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
      role="img"
      aria-label={alt}
    />
  );
}
