import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

// Word pills + symbol pills that fall and pile up on the hero wordmark.
const PILL_LABELS = ['Brand', 'Web', 'Photo', '*', '✳', '✱', '+', '→', '◆', '●', '™', '❋'];

const WALL_THICKNESS = 80;
const WALL_HEIGHT = 4000;
const GROUND_WIDTH = 20000;
const GROUND_HEIGHT = 40;

export default function HeroPhysicsPills({ titleEl }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !titleEl) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const { Engine, Composite, Bodies, Body, Mouse, MouseConstraint } = Matter;

    let engine = null;
    let rafId = 0;
    let leftWall = null;
    let rightWall = null;
    let ground = null;
    let pills = [];
    let resizeTimer = 0;
    let observer = null;
    const listeners = [];

    const teardown = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = 0;
      if (observer) observer.disconnect();
      observer = null;
      listeners.splice(0).forEach((off) => off());
      pills = [];
      Array.from(container.children).forEach((child) => child.remove());
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        engine = null;
      }
    };

    // Keep the collision floor pinned to the top edge of the H1 so pills land on the wordmark.
    const readBounds = () => {
      const cRect = container.getBoundingClientRect();
      const tRect = titleEl.getBoundingClientRect();
      return {
        width: cRect.width,
        height: cRect.height,
        groundTop: Math.max(0, tRect.top - cRect.top),
      };
    };

    const build = () => {
      teardown();

      const { width, height, groundTop } = readBounds();
      if (!width || !height) return;

      engine = Engine.create({ gravity: { x: 0, y: 1 } });
      const world = engine.world;

      leftWall = Bodies.rectangle(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, WALL_HEIGHT, { isStatic: true });
      rightWall = Bodies.rectangle(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, WALL_HEIGHT, { isStatic: true });
      ground = Bodies.rectangle(width / 2, groundTop + GROUND_HEIGHT / 2, GROUND_WIDTH, GROUND_HEIGHT, { isStatic: true });
      Composite.add(world, [leftWall, rightWall, ground]);

      pills = PILL_LABELS.map((label) => {
        const el = document.createElement('div');
        const isSymbol = !/[A-Za-z]/.test(label);
        el.className = isSymbol ? 'hero-pill hero-pill--symbol' : 'hero-pill';
        el.textContent = label;
        container.appendChild(el);

        const w = el.offsetWidth || 60;
        const h = el.offsetHeight || 32;
        const x = w + Math.random() * Math.max(1, width - w * 2);
        const y = -60 - Math.random() * 460;
        const body = Bodies.rectangle(x, y, w, h, {
          chamfer: { radius: h / 2 },
          restitution: 0.16,
          friction: 0.35,
          frictionStatic: 0.6,
          frictionAir: 0.02,
          density: 0.0015,
          slop: 0.02,
        });
        Body.setAngle(body, (Math.random() - 0.5) * 0.9);
        Composite.add(world, body);
        return { el, body };
      });

      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { angularStiffness: 0, stiffness: 0.2, render: { visible: false } },
      });
      mouseConstraint.render.visible = false;
      Composite.add(world, mouseConstraint);

      // Let the page scroll on touch/wheel instead of being captured by Matter's mouse.
      const domEl = mouse.element;
      ['mousewheel', 'DOMMouseScroll', 'touchstart', 'touchmove', 'touchend'].forEach((ev) => {
        if (typeof mouse[ev] === 'function') domEl.removeEventListener(ev, mouse[ev]);
      });

      const onTouchStart = (e) => mouse.mousedown(e);
      const onTouchMove = (e) => { if (mouseConstraint.body) mouse.mousemove(e); };
      const onTouchEnd = (e) => { if (mouseConstraint.body) mouse.mouseup(e); };
      const onLeave = (e) => mouse.mouseup(e);
      domEl.addEventListener('touchstart', onTouchStart, { passive: true });
      domEl.addEventListener('touchmove', onTouchMove);
      domEl.addEventListener('touchend', onTouchEnd);
      container.addEventListener('mouseleave', onLeave);
      listeners.push(() => {
        domEl.removeEventListener('touchstart', onTouchStart);
        domEl.removeEventListener('touchmove', onTouchMove);
        domEl.removeEventListener('touchend', onTouchEnd);
        container.removeEventListener('mouseleave', onLeave);
      });

      const loop = () => {
        Engine.update(engine, 1000 / 60);
        for (let i = 0; i < pills.length; i += 1) {
          const { el, body } = pills[i];
          el.style.left = `${body.position.x}px`;
          el.style.top = `${body.position.y}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
          if (el.style.visibility !== 'visible') el.style.visibility = 'visible';
        }
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    // Reposition the static bounds without re-dropping the pills (font refit, resize, etc.).
    const updateBounds = () => {
      if (!engine || !ground) return;
      const { width, height, groundTop } = readBounds();
      if (!width || !height) return;
      Body.setPosition(leftWall, { x: -WALL_THICKNESS / 2, y: height / 2 });
      Body.setPosition(rightWall, { x: width + WALL_THICKNESS / 2, y: height / 2 });
      Body.setPosition(ground, { x: width / 2, y: groundTop + GROUND_HEIGHT / 2 });
      pills.forEach(({ body }) => {
        const maxX = Math.max(20, width - 20);
        const nextX = Math.min(Math.max(body.position.x, 20), maxX);
        if (nextX !== body.position.x) Body.setPosition(body, { x: nextX, y: body.position.y });
      });
    };

    const scheduleBoundsUpdate = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateBounds, 150);
    };

    build();

    observer = new ResizeObserver(scheduleBoundsUpdate);
    observer.observe(container);
    observer.observe(titleEl);
    window.addEventListener('resize', scheduleBoundsUpdate);
    listeners.push(() => window.removeEventListener('resize', scheduleBoundsUpdate));

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { if (engine) updateBounds(); });
    }

    return teardown;
  }, [titleEl]);

  return <div ref={containerRef} className="hero-pills-layer" aria-hidden="true" />;
}
