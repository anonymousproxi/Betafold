'use client'
import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    class Particle {
      x: number = 0; y: number = 0; vx: number = 0; vy: number = 0;
      r: number = 0; alpha: number = 0; color: string = '';
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.r = Math.random() * 1.5 + 0.3
        this.alpha = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.6 ? '#6366f1' : Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4'
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset()
      }
      draw() {
        if(!ctx) return;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.globalAlpha = this.alpha; ctx.fill();
      }
    }

    class NodeObj {
      x: number = 0; y: number = 0; vx: number = 0; vy: number = 0;
      r: number = 0; pulse: number = 0; color: string = '';
      constructor() {
        this.x = Math.random() * W
        this.y = Math.random() * H
        this.vx = (Math.random() - 0.5) * 0.15
        this.vy = (Math.random() - 0.5) * 0.15
        this.r = Math.random() * 2 + 1
        this.pulse = Math.random() * Math.PI * 2
        this.color = Math.random() > 0.5 ? '#6366f1' : '#8b5cf6'
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.pulse += 0.02;
        if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
        if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
      }
      draw() {
        if(!ctx) return;
        const pr = this.r + Math.sin(this.pulse) * 0.5;
        ctx.beginPath(); ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
        ctx.fillStyle = this.color; ctx.globalAlpha = 0.6; ctx.fill();
      }
    }

    const particles: Particle[] = []
    const nodes: NodeObj[] = []
    for (let i = 0; i < 80; i++) particles.push(new Particle())
    for (let i = 0; i < 40; i++) nodes.push(new NodeObj())

    function drawConnections() {
      if(!ctx) return;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x; const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 160) {
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = '#6366f1'; ctx.globalAlpha = (1 - dist / 160) * 0.12;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
    }

    let animationId: number;
    function animate() {
      if(!ctx) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      ctx.globalAlpha = 1;
      drawConnections();
      nodes.forEach(n => { n.update(); n.draw(); });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <div className="bg-canvas"><canvas ref={canvasRef} /></div>
      <div className="grid-overlay"></div>
      <div className="vignette"></div>
    </>
  )
}
