import React, { useRef, useEffect, useState } from 'react';

export default function DoomGame() {
  const canvasRef = useRef(null);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(50);
  const [score, setScore] = useState(0);
  const [isFiring, setIsFiring] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Simple 2D Map (1 = Wall, 0 = Empty)
    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
      [1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1],
      [1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,0,1,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    // Player state
    let player = {
      x: 3.5,
      y: 3.5,
      angle: 0,
      fov: Math.PI / 3
    };

    const keys = {};

    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const render = () => {
      // Movement controls
      const moveSpeed = 0.04;
      const rotSpeed = 0.03;

      if (keys['a'] || keys['arrowleft']) player.angle -= rotSpeed;
      if (keys['d'] || keys['arrowright']) player.angle += rotSpeed;

      let dx = 0, dy = 0;
      if (keys['w'] || keys['arrowup']) {
        dx += Math.cos(player.angle) * moveSpeed;
        dy += Math.sin(player.angle) * moveSpeed;
      }
      if (keys['s'] || keys['arrowdown']) {
        dx -= Math.cos(player.angle) * moveSpeed;
        dy -= Math.sin(player.angle) * moveSpeed;
      }

      // Simple collision checking
      if (map[Math.floor(player.y)][Math.floor(player.x + dx)] === 0) player.x += dx;
      if (map[Math.floor(player.y + dy)][Math.floor(player.x)] === 0) player.y += dy;

      // Draw Ceiling & Floor
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#222222';
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = '#444444';
      ctx.fillRect(0, h / 2, w, h / 2);

      // Raycasting
      const numRays = w;
      const halfFov = player.fov / 2;

      for (let i = 0; i < numRays; i++) {
        const rayAngle = (player.angle - halfFov) + (i / numRays) * player.fov;
        let distance = 0;
        let hitWall = false;

        const sin = Math.sin(rayAngle);
        const cos = Math.cos(rayAngle);

        while (!hitWall && distance < 16) {
          distance += 0.05;
          const checkX = Math.floor(player.x + cos * distance);
          const checkY = Math.floor(player.y + sin * distance);

          if (checkX < 0 || checkX >= 16 || checkY < 0 || checkY >= 9) {
            hitWall = true;
            distance = 16;
          } else if (map[checkY][checkX] > 0) {
            hitWall = true;
          }
        }

        // Correct fish-eye effect
        const correctedDist = distance * Math.cos(rayAngle - player.angle);
        const wallHeight = Math.min(h, (h / correctedDist));

        // Wall shading based on distance
        const colorVal = Math.max(20, Math.min(200, 255 - correctedDist * 16));
        ctx.fillStyle = `rgb(${colorVal * 0.8}, ${colorVal * 0.2}, ${colorVal * 0.2})`;
        ctx.fillRect(i, (h - wallHeight) / 2, 1, wallHeight);
      }

      // Draw Retro Crosshair / Gun
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w / 2 - 2, h / 2 - 2, 4, 4);

      // Draw Weapon Sprite at bottom
      ctx.fillStyle = isFiring ? '#ff6600' : '#888888';
      ctx.fillRect(w / 2 - 20, h - 60, 40, 60);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isFiring]);

  const handleShoot = () => {
    if (ammo <= 0) return;
    setIsFiring(true);
    setAmmo((prev) => prev - 1);
    setScore((prev) => prev + 100);
    setTimeout(() => setIsFiring(false), 120);
  };

  return (
    <div style={{ background: '#000', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-code)' }}>
        <span>HEALTH: <strong style={{ color: '#ff4b4b' }}>{health}%</strong></span>
        <span>AMMO: <strong style={{ color: '#ffd700' }}>{ammo}</strong></span>
        <span>SCORE: <strong style={{ color: '#52d052' }}>{score}</strong></span>
      </div>

      <canvas
        ref={canvasRef}
        width={480}
        height={300}
        onClick={handleShoot}
        style={{ border: '2px solid #555', cursor: 'crosshair', maxWidth: '100%' }}
      />

      <div style={{ marginTop: 8, fontSize: 11, color: '#aaa', textAlign: 'center' }}>
        Use <strong>WASD / Arrow Keys</strong> to move & rotate. Click screen or press Space to Fire!
      </div>
    </div>
  );
}
