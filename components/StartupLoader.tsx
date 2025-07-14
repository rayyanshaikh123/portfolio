"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Particle type
interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export default function StartupLoader() {
  const [loading, setLoading] = useState(true);
  const [cuttingOut, setCuttingOut] = useState(false);
  const [cutoutWidth, setCutoutWidth] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize particles only once (very dense, crashed-screen look)
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const numParticles = Math.floor((width * height) / 500); // extremely dense
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      const radius = 0.7 + Math.random() * 0.7; // small pixel size
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 2.2,
        dy: (Math.random() - 0.5) * 2.2,
        radius,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Animate particles and wipe
  useEffect(() => {
    let animationFrame: number;
    let running = true;
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      // Move and draw particles
      for (const p of particlesRef.current) {
        // Move
        p.x += p.dx;
        p.y += p.dy;
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;
        // Only draw if outside the vertical band (wipe)
        if (cuttingOut) {
          const bandWidth = cutoutWidth;
          const bandX = (width - bandWidth) / 2;
          if (p.x > bandX && p.x < bandX + bandWidth) continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        const gray = Math.floor(Math.random() * 255);
        ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (running && (!cuttingOut || cutoutWidth < width + 100)) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [cuttingOut, cutoutWidth]);

  // Start cutout after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => setCuttingOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Animate cutout width (vertical wipe with ease-out)
  useEffect(() => {
    if (!cuttingOut) return;
    let animationFrame: number;
    let running = true;
    let start: number | null = null;
    const duration = 700; // ms
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const width = window.innerWidth;
      // Ease-out cubic
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const newWidth = eased * (width + 100);
      setCutoutWidth(newWidth);
      if (t < 1 && running) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setLoading(false), 350); // allow fade-out
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [cuttingOut]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: loading ? "auto" : "none",
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh", display: "block" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 