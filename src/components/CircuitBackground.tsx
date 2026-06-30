/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

interface CircuitTrace {
  points: { x: number; y: number }[];
  pulseProgress: number;
  pulseSpeed: number;
  width: number;
  color: string;
}

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize particles (glowing connection nodes and drifting points)
    const particles: Particle[] = [];
    const maxParticles = 40;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25, // very slow movement
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Static/Semi-static circuit nodes we can draw branches from
    const circuits: CircuitTrace[] = [];
    const totalTraces = 12;

    const createTrace = (): CircuitTrace => {
      const points: { x: number; y: number }[] = [];
      let startX = Math.random() * width;
      let startY = Math.random() * height;
      points.push({ x: startX, y: startY });

      // Create a branching path with 90 or 45 degree bends
      let currentX = startX;
      let currentY = startY;
      const length = 3 + Math.floor(Math.random() * 3);
      const segmentLen = 40 + Math.random() * 60;

      for (let j = 0; j < length; j++) {
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0) {
          currentX += segmentLen;
        } else if (dir === 1) {
          currentX -= segmentLen;
        } else if (dir === 2) {
          currentY += segmentLen;
        } else {
          currentY -= segmentLen;
        }
        // Keep within bounds
        currentX = Math.max(10, Math.min(width - 10, currentX));
        currentY = Math.max(10, Math.min(height - 10, currentY));
        points.push({ x: currentX, y: currentY });
      }

      return {
        points,
        pulseProgress: Math.random(),
        pulseSpeed: 0.002 + Math.random() * 0.004,
        width: Math.random() * 0.8 + 0.4,
        color: Math.random() > 0.5 ? '#782DFF' : '#FF20BE', // TECHCON theme purple/pink
      };
    };

    for (let i = 0; i < totalTraces; i++) {
      circuits.push(createTrace());
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      // Very clean darkish or light background clearing.
      // Since it's a "Pure White Background" with very soft overlays, let's clear to transparent so CSS background dominates.
      ctx.clearRect(0, 0, width, height);

      // Draw subtle circuit lines (opacity 0.04 - 0.08)
      ctx.lineWidth = 0.5;
      circuits.forEach((trace) => {
        if (trace.points.length < 2) return;

        ctx.strokeStyle = trace.color;
        ctx.globalAlpha = 0.06; // extremely subtle
        ctx.beginPath();
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        for (let i = 1; i < trace.points.length; i++) {
          ctx.lineTo(trace.points[i].x, trace.points[i].y);
        }
        ctx.stroke();

        // Draw circuit nodes (dots at junctions)
        ctx.fillStyle = trace.color;
        trace.points.forEach((pt, idx) => {
          if (idx === 0 || idx === trace.points.length - 1) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Draw flowing pulse along the trace
        trace.pulseProgress += trace.pulseSpeed;
        if (trace.pulseProgress > 1) {
          trace.pulseProgress = 0;
        }

        // Calculate current position of the flowing pulse
        const totalSegments = trace.points.length - 1;
        const currentSegmentDouble = trace.pulseProgress * totalSegments;
        const currentSegmentIndex = Math.floor(currentSegmentDouble);
        const segmentProgress = currentSegmentDouble - currentSegmentIndex;

        if (currentSegmentIndex < totalSegments) {
          const startPt = trace.points[currentSegmentIndex];
          const endPt = trace.points[currentSegmentIndex + 1];
          const pulseX = startPt.x + (endPt.x - startPt.x) * segmentProgress;
          const pulseY = startPt.y + (endPt.y - startPt.y) * segmentProgress;

          // Draw the glow pulse
          ctx.globalAlpha = 0.35; // slightly brighter for the flowing node
          ctx.fillStyle = trace.color === '#782DFF' ? '#782DFF' : '#FF20BE';
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Add subtle outer bloom
          ctx.shadowBlur = 8;
          ctx.shadowColor = trace.color;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Draw flowing network particles
      ctx.shadowBlur = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.phase += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.3 + 0.7 * Math.abs(Math.sin(p.phase)));

        ctx.globalAlpha = currentAlpha * 0.12; // super soft
        ctx.fillStyle = '#782DFF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby points to form web/neural network nodes
        particles.forEach((other) => {
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.strokeStyle = '#209CFF';
            ctx.globalAlpha = (1 - dist / 100) * 0.04; // ultra light connection
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="circuit-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
    />
  );
}
