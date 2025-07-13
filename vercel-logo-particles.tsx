import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { AWS_LOGO_PATH } from './aws-logo-path'

interface ParticleComponentProps {
  theme?: 'light' | 'dark'
  type?: 'text' | 'icon' | 'image'
  iconPath?: string
  imageSrc?: string // for image mode
  size?: number // for icon/image size
}

export default function Component({ theme = 'dark', type = 'text', iconPath, imageSrc, size }: ParticleComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Inject Orbiton font from Google Fonts if not already present
    if (!document.getElementById('orbiton-font')) {
      const link = document.createElement('link')
      link.id = 'orbiton-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Orbiton:wght@700&display=swap'
      document.head.appendChild(link)
    }
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768) // Set mobile breakpoint
    }

    // For icon/image mode, use a fixed size
    if ((type === 'icon' || type === 'image') && size) {
      canvas.width = size
      canvas.height = size
    } else {
      updateCanvasSize()
    }

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isAWS: boolean
    }[] = []

    let textImageData: ImageData | null = null

    function createTextImage(callback?: () => void) {
      if (!ctx || !canvas) return 0
      ctx.save()
      if (type === 'image' && imageSrc) {
        // Draw image as mask for particles
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.src = imageSrc
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // Fit image to canvas
          ctx.save()
          ctx.globalAlpha = 1
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          ctx.restore()
          textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          if (callback) callback()
        }
        return 1
      } else if (type === 'icon' && iconPath) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = theme === 'dark' ? 'white' : 'black'
        ctx.save()
        // Center and scale icon
        const iconBox = size || 160
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.scale(iconBox / 24, iconBox / 24) // Assume 24x24 viewBox
        ctx.translate(-12, -12)
        const path = new Path2D(iconPath)
        ctx.fill(path)
        ctx.restore()
      } else {
        ctx.fillStyle = theme === 'dark' ? 'white' : 'black'
        // Draw text as before
        const fontSize = isMobile ? 48 : 120
        ctx.font = `bold ${fontSize}px Orbiton, monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const text = 'RAYYAN SHAIKH'

        const x = canvas.width / 2
        const y = canvas.height / 2
        ctx.fillText(text, x, y)
      }
      ctx.restore()
      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (callback) callback()
      return 1
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null
      const data = textImageData.data
      for (let attempt = 0; attempt < 200; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)
        const idx = (y * canvas.width + x) * 4
        if (type === 'image') {
          // Use brightness threshold for JPEGs and color for PNGs
          let r = data[idx]
          let g = data[idx + 1]
          let b = data[idx + 2]
          const a = data[idx + 3]
          const avg = (r + g + b) / 3
          if (a > 128 && avg < 250) { // allow more detail
            if (theme === 'light') {
              r = Math.min(Math.round(r * 0.8), 170)
              g = Math.min(Math.round(g * 0.8), 170)
              b = Math.min(Math.round(b * 0.8), 170)
              // Only force dark if all channels are still very light
              if (r > 160 && g > 160 && b > 160) {
                r = 30; g = 30; b = 30;
              }
            }
            return {
              x: x,
              y: y,
              baseX: x,
              baseY: y,
              size: Math.random() * 1 + 0.5,
              color: `rgba(${r},${g},${b},${a/255})`,
              scatteredColor: `red`,
              isAWS: false,
              life: Math.random() * 100 + 50
            }
          }
        } else {
          if (data[idx + 3] > 128) {
            return {
              x: x,
              y: y,
              baseX: x,
              baseY: y,
              size: Math.random() * 1 + 0.5,
              color: theme === 'dark' ? 'white' : 'black',
              scatteredColor: theme === 'dark' ? 'white' : 'black',
              isAWS: false,
              life: Math.random() * 100 + 50
            }
          }
        }
      }
      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = type === 'icon' || type === 'image' ? 30000 : 9000
      let particleCount: number
      if (type === 'icon' || type === 'image') {
        particleCount = baseParticleCount
      } else if (canvas) {
        particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      } else {
        particleCount = baseParticleCount
      }
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    function drawGrid() {
      if (!ctx || !canvas) return;
      const gridSize = 40;
      ctx.save();
      ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawVignette() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const gradient = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.3,
        w / 2, h / 2, Math.max(w, h) * 0.5
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, theme === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.10)');
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = theme === 'dark' ? 'black' : 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      if (type !== 'icon' && type !== 'image') drawGrid();
      if (type !== 'icon' && type !== 'image') drawVignette();

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (type === 'icon' || type === 'image') {
          // No interaction, always draw at base position
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.fillStyle = p.color
        } else {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
            const force = (maxDistance - distance) / maxDistance
            const angle = Math.atan2(dy, dx)
            const moveX = Math.cos(angle) * force * 60
            const moveY = Math.sin(angle) * force * 60
            p.x = p.baseX - moveX
            p.y = p.baseY - moveY
            ctx.fillStyle = p.scatteredColor
          } else {
            p.x += (p.baseX - p.x) * 0.1
            p.y += (p.baseY - p.y) * 0.1
            ctx.fillStyle = p.color
          }
        }
        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = type === 'icon' || type === 'image' ? 30000 : 9000
      let targetParticleCount: number
      if (type === 'icon' || type === 'image') {
        targetParticleCount = baseParticleCount
      } else if (canvas) {
        targetParticleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      } else {
        targetParticleCount = baseParticleCount
      }
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    // For image mode, wait for image to load before creating particles
    if (type === 'image' && imageSrc) {
      createTextImage(() => {
        createInitialParticles(1)
        animate(1)
      })
    } else {
      const scale = createTextImage()
      createInitialParticles(scale)
      animate(scale)
    }

    const handleResize = () => {
      if ((type === 'icon' || type === 'image') && size) {
        canvas.width = size
        canvas.height = size
      } else {
        updateCanvasSize()
      }
      if (type === 'image' && imageSrc) {
        createTextImage(() => {
          particles = []
          createInitialParticles(1)
        })
      } else {
        const newScale = createTextImage()
        particles = []
        createInitialParticles(newScale)
      }
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    // Only add event listeners for text mode
    if (type !== 'icon' && type !== 'image') {
      window.addEventListener('resize', handleResize)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
      canvas.addEventListener('mouseleave', handleMouseLeave)
      canvas.addEventListener('touchstart', handleTouchStart)
      canvas.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (type !== 'icon' && type !== 'image') {
        window.removeEventListener('resize', handleResize)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('touchmove', handleTouchMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
        canvas.removeEventListener('touchstart', handleTouchStart)
        canvas.removeEventListener('touchend', handleTouchEnd)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, theme, type, iconPath, imageSrc, size])

  return (
    <div className={type === 'icon' || type === 'image' ? '' : 'relative w-full h-dvh flex flex-col items-center justify-center'} style={type === 'icon' || type === 'image' ? {} : { background: theme === 'dark' ? '#000' : '#fff' }}>
      <canvas 
        ref={canvasRef} 
        className={type === 'icon' || type === 'image' ? 'w-full h-full' : 'w-full h-full absolute top-0 left-0 touch-none'}
        aria-label="Interactive particle effect with rayyan shaikh text"
      />
    </div>
  )
}
