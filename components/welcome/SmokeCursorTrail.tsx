"use client";

import * as PIXI from "pixi.js";
import { useRef, useEffect } from "react";

/**
 * SmokeCursorTrail
 * 
 * Renders a full-viewport PixiJS canvas that spawns fading pixel smoke
 * particles wherever the user moves their cursor. Completely non-interactive
 * (pointer-events: none) — purely atmospheric.
 */
export default function SmokeCursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip on low-end devices
    if ((navigator.hardwareConcurrency || 2) < 2) return;
    // Skip on touch-only devices (no cursor to trail)
    if (window.matchMedia("(hover: none)").matches) return;

    let isMounted = true;

    const init = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: false,
        resizeTo: window,
        resolution: 1, // Keep low res for performance
      });

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
      }

      // Create pixel smoke texture
      const gfx = new PIXI.Graphics();
      gfx.rect(0, 0, 4, 4);
      gfx.fill({ color: 0xA1A1AA, alpha: 0.5 });
      const texture = app.renderer.generateTexture(gfx);

      interface Trail {
        sprite: PIXI.Sprite;
        life: number;
        maxLife: number;
        vx: number;
        vy: number;
      }

      const trails: Trail[] = [];
      let mouseX = -100;
      let mouseY = -100;
      let lastSpawnX = -100;
      let lastSpawnY = -100;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      window.addEventListener("mousemove", onMouseMove);

      app.ticker.add(() => {
        // Spawn new particles if mouse has moved enough
        const dx = mouseX - lastSpawnX;
        const dy = mouseY - lastSpawnY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 8 && mouseX > 0) {
          lastSpawnX = mouseX;
          lastSpawnY = mouseY;

          // Spawn 1-2 particles
          const count = 1 + (dist > 30 ? 1 : 0);
          for (let i = 0; i < count; i++) {
            const sprite = new PIXI.Sprite(texture);
            sprite.x = mouseX + (Math.random() - 0.5) * 8;
            sprite.y = mouseY + (Math.random() - 0.5) * 8;
            sprite.alpha = 0.35;
            sprite.scale.set(0.6 + Math.random() * 0.6);
            app.stage.addChild(sprite);

            trails.push({
              sprite,
              life: 0,
              maxLife: 40 + Math.random() * 30,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -(0.3 + Math.random() * 0.5),
            });
          }
        }

        // Update existing particles
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.life++;
          t.sprite.x += t.vx;
          t.sprite.y += t.vy;
          t.sprite.alpha = Math.max(0, 0.35 * (1 - t.life / t.maxLife));
          t.sprite.scale.set(t.sprite.scale.x + 0.008);

          if (t.life >= t.maxLife) {
            app.stage.removeChild(t.sprite);
            t.sprite.destroy();
            trails.splice(i, 1);
          }
        }

        // Cap particle count for performance
        while (trails.length > 80) {
          const oldest = trails.shift()!;
          app.stage.removeChild(oldest.sprite);
          oldest.sprite.destroy();
        }
      });

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
      };
    };

    let cleanupFn: (() => void) | undefined;
    init().then((fn) => {
      cleanupFn = fn;
    });

    return () => {
      isMounted = false;
      cleanupFn?.();
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[50] pointer-events-none"
      aria-hidden="true"
    />
  );
}
