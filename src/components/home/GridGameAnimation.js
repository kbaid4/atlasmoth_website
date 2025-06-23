import React, { useRef, useEffect } from 'react';

const GridGameAnimation = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const requestRef = useRef(null);
  
  // Brand colors
  const COLORS = ['#FBF7BA', '#9D1F15', '#FF69B4', '#33CC33', '#6666CC'];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game variables
    const gridSize = 30;
    const cellGap = 2;
    let gridCells = [];
    let activeCells = [];
    let gameObjects = [];
    let timeSinceLastSpawn = 0;
    let gameSpeed = 1;
    let frame = 0;
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initGrid();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Initialize grid
    function initGrid() {
      gridCells = [];
      const numberOfCols = Math.ceil(canvas.width / gridSize);
      const numberOfRows = Math.ceil(canvas.height / gridSize);
      
      for (let y = 0; y < numberOfRows; y++) {
        for (let x = 0; x < numberOfCols; x++) {
          gridCells.push({
            x: x * gridSize,
            y: y * gridSize,
            width: gridSize - cellGap,
            height: gridSize - cellGap,
            active: false,
            energy: 0,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
          });
        }
      }
      
      // Start with some active cells
      for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * gridCells.length);
        gridCells[randomIndex].active = true;
        gridCells[randomIndex].energy = 100;
        activeCells.push(gridCells[randomIndex]);
      }
    }
    
    // Game object classes
    class GameObject {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = gridSize * 1.5;
        this.height = gridSize * 1.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = Math.random() * 2 + 1;
        this.type = Math.random() > 0.7 ? 'rotator' : 'bouncer';
        this.lifespan = 500 + Math.random() * 500;
        this.angle = 0;
      }
      
      update() {
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.type === 'rotator') {
          this.angle += 0.05;
        }
        
        // Bounce off edges
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
          this.speedX *= -1;
        }
        
        // Life reduction
        this.lifespan--;
        
        // Activate cells the object passes over
        const cellX = Math.floor(this.x / gridSize);
        const cellY = Math.floor(this.y / gridSize);
        const cellIndex = cellY * Math.ceil(canvas.width / gridSize) + cellX;
        
        if (gridCells[cellIndex]) {
          gridCells[cellIndex].active = true;
          gridCells[cellIndex].energy = Math.min(100, gridCells[cellIndex].energy + 30);
          
          if (!activeCells.includes(gridCells[cellIndex])) {
            activeCells.push(gridCells[cellIndex]);
          }
        }
      }
      
      draw() {
        ctx.save();
        
        // Calculate alpha based on remaining lifespan
        const alpha = Math.min(1, this.lifespan / 200);
        ctx.globalAlpha = alpha;
        
        if (this.type === 'rotator') {
          // Draw a rotating shape
          ctx.translate(this.x + this.width/2, this.y + this.height/2);
          ctx.rotate(this.angle);
          
          ctx.fillStyle = this.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          
          // Create a star shape
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const outerX = Math.cos(((i * 72) - 18) * Math.PI / 180) * this.width/2;
            const outerY = Math.sin(((i * 72) - 18) * Math.PI / 180) * this.width/2;
            const innerX = Math.cos(((i * 72) + 18) * Math.PI / 180) * this.width/4;
            const innerY = Math.sin(((i * 72) + 18) * Math.PI / 180) * this.width/4;
            
            if (i === 0) {
              ctx.moveTo(outerX, outerY);
            } else {
              ctx.lineTo(outerX, outerY);
            }
            ctx.lineTo(innerX, innerY);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Draw a bouncing pixel block
          ctx.fillStyle = this.color;
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          
          // Pixel-art style rounded block
          ctx.fillRect(this.x, this.y, this.width, this.height);
          
          // Add pixel-art style highlights
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(this.x + 4, this.y + 4, 6, 6);
          ctx.fillRect(this.x + this.width - 10, this.y + this.height - 10, 6, 6);
          
          // Add game-style border
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        
        ctx.restore();
      }
    }
    
    // Handle cell decay and propagation
    function updateCells() {
      // Process active cells
      for (let i = activeCells.length - 1; i >= 0; i--) {
        const cell = activeCells[i];
        
        // Decay energy over time
        cell.energy -= 0.5;
        
        // Occasionally propagate to neighbors
        if (Math.random() < 0.04 && cell.energy > 50) {
          const colSize = Math.ceil(canvas.width / gridSize);
          const rowSize = Math.ceil(canvas.height / gridSize);
          const cellIndex = Math.floor(cell.y / gridSize) * colSize + Math.floor(cell.x / gridSize);
          
          // Try to activate a neighbor
          const directions = [
            {x: 0, y: -1},  // up
            {x: 1, y: 0},   // right
            {x: 0, y: 1},   // down
            {x: -1, y: 0}   // left
          ];
          
          const randomDir = directions[Math.floor(Math.random() * directions.length)];
          const targetIndex = cellIndex + randomDir.x + (randomDir.y * colSize);
          
          if (gridCells[targetIndex] && !gridCells[targetIndex].active) {
            gridCells[targetIndex].active = true;
            gridCells[targetIndex].energy = 60;
            activeCells.push(gridCells[targetIndex]);
          }
        }
        
        // Remove inactive cells
        if (cell.energy <= 0) {
          cell.active = false;
          activeCells.splice(i, 1);
        }
      }
    }
    
    // Main draw function for grid
    function drawGrid() {
      // First draw inactive cells as a subtle background
      ctx.fillStyle = 'rgba(20, 20, 30, 0.1)';
      for (let i = 0; i < gridCells.length; i++) {
        const cell = gridCells[i];
        if (!cell.active) {
          ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
        }
      }
      
      // Then draw active cells with glowing effects
      for (let i = 0; i < activeCells.length; i++) {
        const cell = activeCells[i];
        const energyFactor = cell.energy / 100;
        
        ctx.globalAlpha = Math.min(0.8, energyFactor);
        ctx.fillStyle = cell.color;
        
        // Draw glow effect
        if (energyFactor > 0.5) {
          ctx.shadowBlur = 10 * energyFactor;
          ctx.shadowColor = cell.color;
        }
        
        // Draw the cell
        ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
    
    // Spawn new game objects
    function spawnGameObjects() {
      timeSinceLastSpawn++;
      
      if (timeSinceLastSpawn > 60) {
        if (Math.random() < 0.4 || gameObjects.length < 3) {
          // Spawn from a random side
          let x, y;
          const side = Math.floor(Math.random() * 4);
          
          switch(side) {
            case 0: // top
              x = Math.random() * canvas.width;
              y = -gridSize * 2;
              break;
            case 1: // right
              x = canvas.width + gridSize;
              y = Math.random() * canvas.height;
              break;
            case 2: // bottom
              x = Math.random() * canvas.width;
              y = canvas.height + gridSize;
              break;
            case 3: // left
              x = -gridSize * 2;
              y = Math.random() * canvas.height;
              break;
          }
          
          gameObjects.push(new GameObject(x, y));
          timeSinceLastSpawn = 0;
        }
      }
      
      // Remove dead objects
      for (let i = gameObjects.length - 1; i >= 0; i--) {
        if (gameObjects[i].lifespan <= 0 || 
            gameObjects[i].y > canvas.height + gridSize * 2) {
          gameObjects.splice(i, 1);
        }
      }
    }
    
    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Activate cells near mouse
      const mouseCol = Math.floor(mouseRef.current.x / gridSize);
      const mouseRow = Math.floor(mouseRef.current.y / gridSize);
      const colSize = Math.ceil(canvas.width / gridSize);
      
      // Activate a small area around the mouse
      for (let y = -2; y <= 2; y++) {
        for (let x = -2; x <= 2; x++) {
          const targetIndex = (mouseRow + y) * colSize + (mouseCol + x);
          if (gridCells[targetIndex]) {
            const distance = Math.sqrt(x*x + y*y);
            if (distance < 3) {
              if (!gridCells[targetIndex].active) {
                gridCells[targetIndex].active = true;
                gridCells[targetIndex].energy = 100 * (1 - distance/3);
                activeCells.push(gridCells[targetIndex]);
              } else {
                gridCells[targetIndex].energy = Math.min(100, gridCells[targetIndex].energy + 20);
              }
            }
          }
        }
      }
    };
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw grid
      drawGrid();
      updateCells();
      
      // Handle game objects
      spawnGameObjects();
      gameObjects.forEach(obj => {
        obj.update();
        obj.draw();
      });
      
      // Every 200 frames, increase game speed
      frame++;
      if (frame % 200 === 0) {
        gameSpeed = Math.min(2, gameSpeed + 0.1);
      }
      
      requestRef.current = requestAnimationFrame(animate);
    }
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <canvas 
        ref={canvasRef}
        className="w-full h-full" 
        style={{ pointerEvents: 'auto' }}
      />
    </div>
  );
};

export default GridGameAnimation;
