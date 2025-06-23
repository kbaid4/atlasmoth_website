import React, { useRef, useEffect } from 'react';

// Canvas animation component using HTML5 Canvas for advanced effects
const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const particlesRef = useRef([]);
  const requestRef = useRef(null);
  
  const COLORS = ['#FBF7BA', '#9D1F15', '#FF69B4', '#33CC33', '#6666CC'];
  const PARTICLE_COUNT = 60;
  const MAX_CONNECTIONS = 5;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_INFLUENCE_RADIUS = 180;
  const MOUSE_PUSH_FACTOR = 3;

  // Initialize the particles and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particle class with more advanced properties
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.depth = Math.random() * 5 + 1; // Simulated z-position for 3D effect
        this.originalSize = this.size;
        
        // Game-like properties
        this.energy = Math.random() * 100;
        this.growthDirection = Math.random() > 0.5 ? 1 : -1;
        this.growthSpeed = Math.random() * 0.03 + 0.01;
        this.maxSize = this.originalSize * (1.2 + Math.random() * 0.5);
        this.minSize = this.originalSize * 0.6;
        this.pulseRate = Math.random() * 0.02 + 0.005;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.02;
        
        // For connection drawing
        this.connections = 0;
      }
      
      update() {
        // Interact with mouse
        if (mouseRef.current.x && mouseRef.current.y) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < MOUSE_INFLUENCE_RADIUS) {
            const force = (MOUSE_INFLUENCE_RADIUS - distance) / MOUSE_INFLUENCE_RADIUS;
            const angle = Math.atan2(dy, dx);
            this.speedX += Math.cos(angle) * force * MOUSE_PUSH_FACTOR * 0.01;
            this.speedY += Math.sin(angle) * force * MOUSE_PUSH_FACTOR * 0.01;
            
            // Energize particles near mouse
            this.energy = Math.min(this.energy + 0.5, 100);
          }
        }

        // Movement with momentum and boundaries
        this.x += this.speedX;
        this.y += this.speedY;

        // Damping (slow down over time)
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Add some natural random movement
        this.speedX += (Math.random() - 0.5) * 0.04;
        this.speedY += (Math.random() - 0.5) * 0.04;
        
        // Apply max speed limit
        const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (speed > 2) {
          this.speedX = (this.speedX / speed) * 2;
          this.speedY = (this.speedY / speed) * 2;
        }
        
        // Boundary check with bounce
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX * 0.6;
          this.x = Math.max(0, Math.min(canvas.width, this.x));
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY * 0.6;
          this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        // Energy dynamics (particles gain/lose energy over time)
        this.energy = Math.max(0, this.energy - 0.05);
        
        // Size pulsing for "breathing" effect
        this.size += this.growthDirection * this.growthSpeed;
        if (this.size > this.maxSize || this.size < this.minSize) {
          this.growthDirection *= -1;
        }
        
        // Rotation for non-circular particles
        this.angle += this.angularSpeed;
        
        // Reset connection count for the next frame
        this.connections = 0;
      }
      
      draw(ctx) {
        const energyFactor = this.energy / 100;
        const glowSize = 10 + energyFactor * 15;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw glow effect based on energy
        if (energyFactor > 0.2) {
          ctx.beginPath();
          ctx.shadowBlur = glowSize;
          ctx.shadowColor = this.color;
          ctx.fillStyle = this.color;
          ctx.globalAlpha = 0.3 * energyFactor;
          ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }

        // Draw main particle
        const shapeIndex = Math.floor(this.originalSize) % 5; // Use size to determine shape type
        
        ctx.fillStyle = this.color;
        
        switch(shapeIndex) {
          case 0: // Circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1: // Square
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            break;
          case 2: // Diamond
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 1.2);
            ctx.lineTo(this.size, 0);
            ctx.lineTo(0, this.size * 1.2);
            ctx.lineTo(-this.size, 0);
            ctx.closePath();
            ctx.fill();
            break;
          case 3: // Triangle
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 1.3);
            ctx.lineTo(this.size * 1.2, this.size * 0.8);
            ctx.lineTo(-this.size * 1.2, this.size * 0.8);
            ctx.closePath();
            ctx.fill();
            break;
          case 4: // Pixel (small square with "pixelated" border)
            ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 1;
            ctx.strokeRect(-this.size, -this.size, this.size * 2, this.size * 2);
            break;
        }
        
        // Add sparkle effect for highly energized particles
        if (energyFactor > 0.7) {
          const sparkleSize = this.size * 0.8;
          ctx.strokeStyle = 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 1;
          
          // Draw sparkle lines
          ctx.beginPath();
          ctx.moveTo(-sparkleSize * 1.5, 0);
          ctx.lineTo(sparkleSize * 1.5, 0);
          ctx.moveTo(0, -sparkleSize * 1.5);
          ctx.lineTo(0, sparkleSize * 1.5);
          ctx.stroke();
        }
        
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
    particlesRef.current = particles;

    // Draw connections between nearby particles
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        if (particleA.connections >= MAX_CONNECTIONS) continue;
        
        for (let j = i + 1; j < particles.length; j++) {
          const particleB = particles[j];
          if (particleB.connections >= MAX_CONNECTIONS) continue;
          
          const dx = particleA.x - particleB.x;
          const dy = particleA.y - particleB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < CONNECTION_DISTANCE) {
            // Blend the colors of connected particles
            const colorA = particleA.color;
            const colorB = particleB.color;
            
            // Create a gradient for more interesting connections
            const gradient = ctx.createLinearGradient(
              particleA.x, particleA.y, particleB.x, particleB.y
            );
            gradient.addColorStop(0, colorA);
            gradient.addColorStop(1, colorB);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.min(
              2, 
              (1 - distance / CONNECTION_DISTANCE) * 3
            );
            ctx.globalAlpha = (1 - distance / CONNECTION_DISTANCE) * 0.8;
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            particleA.connections++;
            particleB.connections++;
            
            if (particleA.connections >= MAX_CONNECTIONS || 
                particleB.connections >= MAX_CONNECTIONS) {
              break;
            }
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw all particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Draw connections between nearby particles
      drawConnections();
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    animate();

    // Mouse interactions
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const handleTouch = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);

    // Clean up
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 opacity-70">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default CanvasAnimation;
