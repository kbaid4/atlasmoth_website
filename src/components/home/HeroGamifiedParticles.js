import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const COLORS = ['#FBF7BA', '#9D1F15', '#FF69B4', '#33CC33', '#6666CC'];
const SHAPES = ['circle', 'square', 'triangle', 'star', 'pixel'];
const PARTICLE_COUNT = 22;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomShape() {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Helper to render different shapes
function Shape({ shape, color, size }) {
  switch (shape) {
    case 'circle':
      return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: color, boxShadow: `0 0 16px ${color}88` }} />
      );
    case 'square':
      return (
        <div style={{ width: size, height: size, background: color, boxShadow: `0 0 10px ${color}88` }} />
      );
    case 'triangle':
      return (
        <div style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
          filter: `drop-shadow(0 0 8px ${color}88)`
        }} />
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}>
          <polygon points="12,2 15,10 24,10 17,15 19,24 12,19 5,24 7,15 0,10 9,10" fill={color} />
        </svg>
      );
    case 'pixel':
      return (
        <div style={{ width: size, height: size, background: color, boxShadow: `2px 2px 0px #222, 0 0 10px ${color}88` }} />
      );
    default:
      return null;
  }
}

// Individual particle component
const GamifiedParticle = ({ mouse, shape, color, size, initialLeft, initialTop }) => {
  const controls = useAnimation();

  useEffect(() => {
    // Initial random animation
    function randomize() {
      const x = randomBetween(-10, 100);
      const y = randomBetween(-10, 100);
      const rotate = randomBetween(-180, 180);
      const scale = randomBetween(0.7, 1.6);
      controls.start({
        x: `${x}vw`,
        y: `${y}vh`,
        rotate,
        scale,
        transition: {
          duration: randomBetween(3, 7),
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: randomBetween(0, 2)
        }
      });
    }
    randomize();
  }, [controls]);

  useEffect(() => {
    if (!mouse) return;
    // On mouse move, animate to new position
    const { mx, my } = mouse;
    controls.start({
      x: `calc(${randomBetween(-10, 100)}vw + ${(mx - 0.5) * randomBetween(-40, 40)}px)`,
      y: `calc(${randomBetween(-10, 100)}vh + ${(my - 0.5) * randomBetween(-40, 40)}px)`,
      rotate: randomBetween(-180, 180),
      scale: randomBetween(0.7, 1.6),
      transition: {
        duration: randomBetween(1.5, 2.5),
        ease: 'easeInOut'
      }
    });
    // eslint-disable-next-line
  }, [mouse]);

  return (
    <motion.div
      animate={controls}
      initial={false}
      style={{
        position: 'absolute',
        left: initialLeft,
        top: initialTop,
        zIndex: 1,
        opacity: 0.85,
        mixBlendMode: 'screen',
      }}
    >
      <Shape shape={shape} color={color} size={size} />
    </motion.div>
  );
};

const HeroGamifiedParticles = () => {
  const containerRef = useRef(null);
  const [mouse, setMouse] = React.useState(null);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      setMouse({ mx, my });
    };
    const refCurrent = containerRef.current;
    refCurrent.addEventListener('mousemove', handleMouseMove);
    return () => refCurrent.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const shape = getRandomShape();
        const color = getRandomColor();
        const size = randomBetween(24, 64);
        const initialLeft = `${randomBetween(0, 90)}vw`;
        const initialTop = `${randomBetween(0, 90)}vh`;
        return (
          <GamifiedParticle
            key={i}
            mouse={mouse}
            shape={shape}
            color={color}
            size={size}
            initialLeft={initialLeft}
            initialTop={initialTop}
          />
        );
      })}
    </div>
  );
};

export default HeroGamifiedParticles;
