"use client";

import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";

// ── Pixel Art Drawing Helpers ──────────────────────────────
function drawPixelRect(g: PIXI.Graphics, x: number, y: number, w: number, h: number, color: number) {
  g.rect(x, y, w, h);
  g.fill({ color });
}

// ── Cat Sprite Builder (16x16 grid) ────────────────────────
function buildCatSprite(scale: number, facingLeft: boolean, frame: number, isJumping: boolean): PIXI.Graphics {
  const g = new PIXI.Graphics();
  const s = scale;
  const c = {
    body: 0x6B7280,
    belly: 0xF5F5F4,
    eyes: 0x22C55E,
    nose: 0xFDA4AF,
    bandana: 0xE11D48,
    ear: 0x6B7280,
    earInner: 0xFDA4AF,
    tail: 0x6B7280,
    whisker: 0xD4D4D8,
  };

  const bobY = frame % 2 === 0 && !isJumping ? 0 : -s;
  const legOffset = frame % 2 === 0 || isJumping ? 0 : s;

  const mx = (x: number) => facingLeft ? (15 * s - x) : x;

  // Tail
  const tailWag = frame % 2 === 0 && !isJumping ? 0 : s;
  drawPixelRect(g, mx(0 * s) - (facingLeft ? 0 : s), 6 * s + bobY - tailWag, s, s, c.tail);
  drawPixelRect(g, mx(-1 * s) - (facingLeft ? -s : s), 5 * s + bobY - tailWag, s, s, c.tail);
  drawPixelRect(g, mx(-1 * s) - (facingLeft ? -s : s), 4 * s + bobY - tailWag, s, s, c.tail);

  // Body
  for (let bx = 3; bx <= 12; bx++) {
    drawPixelRect(g, mx(bx * s), 7 * s + bobY, s, s, c.body);
    drawPixelRect(g, mx(bx * s), 8 * s + bobY, s, s, bx >= 6 && bx <= 9 ? c.belly : c.body);
    drawPixelRect(g, mx(bx * s), 9 * s + bobY, s, s, bx >= 5 && bx <= 10 ? c.belly : c.body);
  }

  // Head
  for (let hx = 4; hx <= 12; hx++) {
    drawPixelRect(g, mx(hx * s), 3 * s + bobY, s, s, c.body);
    drawPixelRect(g, mx(hx * s), 4 * s + bobY, s, s, c.body);
    drawPixelRect(g, mx(hx * s), 5 * s + bobY, s, s, c.body);
    drawPixelRect(g, mx(hx * s), 6 * s + bobY, s, s, c.body);
  }

  // Ears
  drawPixelRect(g, mx(4 * s), 2 * s + bobY, s, s, c.ear);
  drawPixelRect(g, mx(5 * s), 2 * s + bobY, s, s, c.ear);
  drawPixelRect(g, mx(5 * s), 1 * s + bobY, s, s, c.ear);
  drawPixelRect(g, mx(11 * s), 2 * s + bobY, s, s, c.ear);
  drawPixelRect(g, mx(10 * s), 2 * s + bobY, s, s, c.ear);
  drawPixelRect(g, mx(10 * s), 1 * s + bobY, s, s, c.ear);

  // Inner ear
  drawPixelRect(g, mx(5 * s), 2 * s + bobY, s, s, c.earInner);
  drawPixelRect(g, mx(10 * s), 2 * s + bobY, s, s, c.earInner);

  // Bandana
  for (let bx = 4; bx <= 12; bx++) {
    drawPixelRect(g, mx(bx * s), 6 * s + bobY, s, s, c.bandana);
  }

  // Eyes
  drawPixelRect(g, mx(6 * s), 4 * s + bobY, s, s, c.eyes);
  drawPixelRect(g, mx(10 * s), 4 * s + bobY, s, s, c.eyes);

  // Eye shine
  drawPixelRect(g, mx(6 * s), 4 * s + bobY, Math.floor(s * 0.4), Math.floor(s * 0.4), 0xFFFFFF);
  drawPixelRect(g, mx(10 * s), 4 * s + bobY, Math.floor(s * 0.4), Math.floor(s * 0.4), 0xFFFFFF);

  // Nose
  drawPixelRect(g, mx(8 * s), 5 * s + bobY, s, s, c.nose);

  // Legs (tuck in if jumping)
  const jumpLegOffset = isJumping ? -2 * s : 0;
  
  // Front legs
  drawPixelRect(g, mx(4 * s), 10 * s + legOffset + jumpLegOffset, s, s * 2, c.body);
  drawPixelRect(g, mx(5 * s), 10 * s + legOffset + jumpLegOffset, s, s * 2, c.body);
  // Back legs
  drawPixelRect(g, mx(10 * s), 10 * s - legOffset + jumpLegOffset, s, s * 2, c.body);
  drawPixelRect(g, mx(11 * s), 10 * s - legOffset + jumpLegOffset, s, s * 2, c.body);

  // Paws
  drawPixelRect(g, mx(4 * s), 12 * s + legOffset + jumpLegOffset, s * 2, s, c.belly);
  drawPixelRect(g, mx(10 * s), 12 * s - legOffset + jumpLegOffset, s * 2, s, c.belly);

  return g;
}

// ── Main Scene Component ──────────────────────────────────
export default function PixelCatScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 2) return;

    let isMounted = true;
    let app: PIXI.Application;

    const initScene = async () => {
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        antialias: false,
        resolution: Math.min(window.devicePixelRatio, 2),
        autoDensity: true,
      });

      if (!isMounted) {
        app.destroy(true);
        return;
      }

      appRef.current = app;
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
      }

      const scale = 3;
      const catWidth = 16 * scale;
      const catHeight = 13 * scale;

      const catContainer = new PIXI.Container();
      app.stage.addChild(catContainer);

      const cat = {
        state: "falling" as "idle" | "walking" | "jumping" | "falling" | "sitting" | "playing",
        x: window.innerWidth * 0.5,
        y: -50,
        vx: 0,
        vy: 0,
        targetX: null as number | null,
        targetY: null as number | null,
        facingLeft: false,
        frame: 0,
        frameTimer: 0,
        stateTimer: 0,
        isGrounded: false,
      };

      let currentCatGraphics: PIXI.Graphics | null = null;

      function updateCatSprite() {
        if (currentCatGraphics) {
          catContainer.removeChild(currentCatGraphics);
          currentCatGraphics.destroy();
        }
        currentCatGraphics = buildCatSprite(scale, cat.facingLeft, cat.frame, !cat.isGrounded && cat.state !== "sitting");
        catContainer.addChild(currentCatGraphics);
      }

      catContainer.x = cat.x;
      catContainer.y = cat.y;
      updateCatSprite();

      // Mouse tracking
      let mouseX = -100;
      let mouseY = -100;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      window.addEventListener("mousemove", handleMouseMove);

      // Jump helper
      const jumpTo = (targetX: number, targetY: number) => {
        cat.state = "jumping";
        cat.isGrounded = false;
        
        // Calculate physics to reach target
        const dx = targetX - cat.x;
        const dy = targetY - cat.y;
        
        // Pick a fixed jump time, e.g. 40 frames
        const jumpFrames = 40 + Math.random() * 20; 
        
        cat.vx = dx / jumpFrames;
        // dy = vy*t + 0.5*g*t^2 => vy = (dy - 0.5*g*t^2)/t
        const gravity = 0.5;
        cat.vy = (dy - 0.5 * gravity * jumpFrames * jumpFrames) / jumpFrames;
        
        cat.facingLeft = cat.vx < 0;
      };

      // ── Main Game Loop ────────────────────────────────────
      app.ticker.add(() => {
        cat.stateTimer++;
        cat.frameTimer++;

        // Get platforms dynamically based on current scroll position
        const platforms: { x: number, y: number, w: number, h: number }[] = [];
        
        // The ground is always a platform
        platforms.push({
          x: -100,
          y: window.innerHeight - 2, // 2px floor
          w: window.innerWidth + 200,
          h: 10
        });

        // Add DOM elements as platforms
        const titleEl = document.getElementById("smory-title");
        const ctaEl = document.getElementById("smory-cta");

        if (titleEl) {
          const rect = titleEl.getBoundingClientRect();
          platforms.push({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
        }
        if (ctaEl) {
          const rect = ctaEl.getBoundingClientRect();
          platforms.push({ x: rect.left, y: rect.top, w: rect.width, h: rect.height });
        }

        // Apply physics
        const gravity = 0.5;
        if (!cat.isGrounded) {
          cat.vy += gravity;
        }

        const prevY = cat.y;
        cat.y += cat.vy;
        cat.x += cat.vx;

        // Screen bounds X
        if (cat.x < 0) {
          cat.x = 0;
          cat.vx *= -1;
          cat.facingLeft = false;
        } else if (cat.x > window.innerWidth - catWidth) {
          cat.x = window.innerWidth - catWidth;
          cat.vx *= -1;
          cat.facingLeft = true;
        }

        // Collision detection
        cat.isGrounded = false;
        
        // Only check collision when falling
        if (cat.vy >= 0) {
          for (const p of platforms) {
            // Check horizontal overlap
            if (cat.x + catWidth > p.x && cat.x < p.x + p.w) {
              // Check vertical overlap (was above, now below or on)
              const catBottomPrev = prevY + catHeight;
              const catBottomNow = cat.y + catHeight;
              
              if (catBottomPrev <= p.y + 10 && catBottomNow >= p.y) {
                cat.y = p.y - catHeight;
                cat.vy = 0;
                cat.vx = 0;
                cat.isGrounded = true;
                if (cat.state === "jumping" || cat.state === "falling") {
                  cat.state = "idle";
                  cat.stateTimer = 0;
                }
                break;
              }
            }
          }
        }

        if (!cat.isGrounded && cat.vy > 0 && cat.state !== "jumping") {
          cat.state = "falling";
        }

        // Animation frames
        if (cat.state === "walking") {
          if (cat.frameTimer >= 6) {
            cat.frameTimer = 0;
            cat.frame = (cat.frame + 1) % 4;
          }
        } else {
          cat.frame = 0;
        }

        // ── State Machine AI ────────────────────────────────
        switch (cat.state) {
          case "idle": {
            // Check distance to mouse
            const distToMouse = Math.hypot(mouseX - (cat.x + catWidth/2), mouseY - (cat.y + catHeight/2));
            
            if (distToMouse < 100 && Math.random() < 0.05) {
              // Play with cursor!
              cat.state = "playing";
              cat.stateTimer = 0;
              cat.facingLeft = mouseX < cat.x + catWidth/2;
            } else if (cat.stateTimer > 60 + Math.random() * 120) {
              const roll = Math.random();
              if (roll < 0.4) {
                // Walk around on current platform
                let currentPlatform = platforms.find(p => Math.abs((p.y - catHeight) - cat.y) < 2 && cat.x + catWidth > p.x && cat.x < p.x + p.w);
                if (!currentPlatform) currentPlatform = platforms[0]; // fallback to floor
                
                // Pick a random spot on the platform
                cat.targetX = currentPlatform.x + Math.random() * (currentPlatform.w - catWidth);
                cat.targetX = Math.max(0, Math.min(cat.targetX, window.innerWidth - catWidth));
                cat.facingLeft = cat.targetX < cat.x;
                cat.state = "walking";
              } else if (roll < 0.7) {
                // Jump to a different platform (prefer visible ones)
                const visiblePlatforms = platforms.filter(p => p.y > 50 && p.y < window.innerHeight - 50);
                const targetPlatform = visiblePlatforms.length > 0 
                  ? visiblePlatforms[Math.floor(Math.random() * visiblePlatforms.length)] 
                  : platforms[0];
                const jumpTargetX = targetPlatform.x + Math.random() * (targetPlatform.w - catWidth);
                const jumpTargetY = targetPlatform.y - catHeight;
                jumpTo(jumpTargetX, jumpTargetY);
              } else {
                // Sit down
                cat.state = "sitting";
                cat.stateTimer = 0;
              }
            }
            break;
          }

          case "walking": {
            if (cat.targetX !== null) {
              const dx = cat.targetX - cat.x;
              const moveSpeed = 2;
              if (Math.abs(dx) > moveSpeed) {
                cat.x += dx > 0 ? moveSpeed : -moveSpeed;
                cat.facingLeft = dx < 0;
              } else {
                cat.x = cat.targetX;
                cat.targetX = null;
                cat.state = "idle";
                cat.stateTimer = 0;
              }
              
              // Fall off edges
              let onPlatform = false;
              for (const p of platforms) {
                if (Math.abs((p.y - catHeight) - cat.y) < 5 && cat.x + catWidth > p.x && cat.x < p.x + p.w) {
                  onPlatform = true;
                  break;
                }
              }
              if (!onPlatform) {
                cat.isGrounded = false;
                cat.state = "falling";
                cat.targetX = null;
              }
            }
            break;
          }

          case "sitting": {
            // Just chill
            if (cat.stateTimer > 200) {
              cat.state = "idle";
              cat.stateTimer = 0;
            }
            break;
          }

          case "playing": {
            // Jump toward mouse slightly
            if (cat.stateTimer === 1) {
              cat.vy = -5;
              cat.vx = cat.facingLeft ? -2 : 2;
              cat.isGrounded = false;
            }
            if (cat.isGrounded && cat.stateTimer > 10) {
              cat.state = "idle";
              cat.stateTimer = 0;
              cat.vx = 0;
            }
            break;
          }
        }

        // Update position
        catContainer.x = cat.x;
        catContainer.y = cat.y;
        
        // Add a slight rotation when jumping/falling
        if (!cat.isGrounded) {
          catContainer.rotation = cat.vx * 0.05;
        } else {
          catContainer.rotation = 0;
        }

        updateCatSprite();
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      // Save listener to remove later
      (app as any)._customResizeHandler = handleResize;
      (app as any)._customMouseHandler = handleMouseMove;
    };

    initScene();

    return () => {
      isMounted = false;
      if (app) {
        if ((app as any)._customResizeHandler) {
          window.removeEventListener("resize", (app as any)._customResizeHandler);
        }
        if ((app as any)._customMouseHandler) {
          window.removeEventListener("mousemove", (app as any)._customMouseHandler);
        }
        try {
          app.destroy(true);
        } catch (e) {
          console.warn("PixiJS destroy cleanup:", e);
        }
      }
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
