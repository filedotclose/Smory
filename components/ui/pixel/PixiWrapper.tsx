"use client";

import * as PIXI from "pixi.js";
import React, { useRef, useEffect } from "react";

interface PixiWrapperProps {
  type: "smoke" | "sparks" | "stars" | "dust";
  density: number;
}

export default function PixiWrapper({ type, density }: PixiWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resizeTo: window,
      });

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
      }

      // Create texture based on type
      const graphics = new PIXI.Graphics();
      if (type === "sparks" || type === "stars") {
        graphics.rect(0, 0, 4, 4);
        graphics.fill({ color: 0xE11D48, alpha: 0.6 }); // Marlboro Red
      } else {
        graphics.rect(0, 0, 6, 6);
        graphics.fill({ color: 0xA1A1AA, alpha: 0.3 }); // Ash Gray
      }

      // In Pixi v8 generateTexture takes an object or renderer
      const texture = app.renderer.generateTexture(graphics);
      
      const particles: { sprite: PIXI.Sprite, speed: number, xOff: number }[] = [];

      for (let i = 0; i < density; i++) {
        const sprite = new PIXI.Sprite(texture);
        sprite.x = Math.random() * app.screen.width;
        sprite.y = Math.random() * app.screen.height;
        sprite.scale.set(Math.random() * 0.5 + 0.5);
        sprite.alpha = Math.random();
        
        app.stage.addChild(sprite);
        
        particles.push({
          sprite,
          speed: type === "smoke" ? 0.2 : type === "sparks" ? 1.5 : 0.5,
          xOff: Math.random() * 100,
        });
      }

      app.ticker.add(() => {
        particles.forEach((p) => {
          p.sprite.y -= p.speed;
          if (p.sprite.y < -10) {
            p.sprite.y = app.screen.height + 10;
            p.sprite.x = Math.random() * app.screen.width;
          }

          if (type === "smoke" || type === "stars") {
            p.sprite.alpha = Math.abs(Math.sin(Date.now() / 1000 + p.xOff)) * 0.5 + 0.1;
          }
        });
      });
    };

    initPixi();

    return () => {
      isMounted = false;
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, [type, density]);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}
