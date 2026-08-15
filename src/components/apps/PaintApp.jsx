import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Paintbrush, Eraser, PaintBucket, Type, Slash, Square, Circle, Scissors, Pipette, SprayCan } from 'lucide-react';

const COLORS = [
  '#000000', '#787878', '#790000', '#787900', '#007900', '#007978', '#000078', '#790079',
  '#787938', '#003838', '#0078f8', '#003878', '#3800f8', '#783800',
  '#ffffff', '#bbbbbb', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff78', '#00ff78', '#78ffff', '#7878ff', '#ff0078', '#ff7838'
];

// Flood-fill using scanline algorithm
function floodFill(ctx, startX, startY, fillColor) {
  const canvas = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const toIdx = (x, y) => (y * canvas.width + x) * 4;

  const target = data.slice(toIdx(startX, startY), toIdx(startX, startY) + 4);
  const fill = hexToRgba(fillColor);

  if (target[0] === fill[0] && target[1] === fill[1] && target[2] === fill[2]) return;

  const matchTarget = (x, y) => {
    const i = toIdx(x, y);
    return data[i] === target[0] && data[i+1] === target[1] && data[i+2] === target[2];
  };
  const setFill = (x, y) => {
    const i = toIdx(x, y);
    data[i] = fill[0]; data[i+1] = fill[1]; data[i+2] = fill[2]; data[i+3] = 255;
  };

  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
    if (!matchTarget(x, y)) continue;
    setFill(x, y);
    stack.push([x+1, y], [x-1, y], [x, y+1], [x, y-1]);
  }
  ctx.putImageData(imageData, 0, 0);
}

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b, 255];
}

function getPixelColor(ctx, x, y) {
  const data = ctx.getImageData(x, y, 1, 1).data;
  return `#${[data[0],data[1],data[2]].map(v => v.toString(16).padStart(2,'0')).join('')}`;
}

export default function PaintApp() {
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState('pencil');
  const [activeColor, setActiveColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasSnapshot, setCanvasSnapshot] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null); // {x,y,w,h}
  const airbrushRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) * (canvas.width / rect.width)),
      y: Math.floor((e.clientY - rect.top) * (canvas.height / rect.height))
    };
  };

  const startDraw = (e) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    setIsDrawing(true);
    setStartPos(coords);
    setCanvasSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = activeTool === 'eraser' ? secondaryColor : activeColor;
      ctx.lineWidth = activeTool === 'eraser' ? brushSize * 5 : activeTool === 'brush' ? brushSize * 3 : 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (activeTool === 'bucket') {
      floodFill(ctx, coords.x, coords.y, activeColor);
      setIsDrawing(false);
    } else if (activeTool === 'pipette') {
      const color = getPixelColor(ctx, coords.x, coords.y);
      if (e.button === 2) setSecondaryColor(color);
      else setActiveColor(color);
      setIsDrawing(false);
    } else if (activeTool === 'airbrush') {
      // Start interval spray
      const spray = () => {
        const c = canvasRef.current;
        if (!c) return;
        const cx = c.getContext('2d');
        const r = brushSize * 6;
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * r;
          const sx = coords.x + radius * Math.cos(angle);
          const sy = coords.y + radius * Math.sin(angle);
          cx.fillStyle = activeColor;
          cx.fillRect(sx, sy, 1, 1);
        }
      };
      spray();
      airbrushRef.current = { x: coords.x, y: coords.y };
    } else if (activeTool === 'text') {
      const text = window.prompt('Enter text:', 'Hello');
      if (text) {
        ctx.font = `${Math.max(16, brushSize * 6)}px "VT323", monospace`;
        ctx.fillStyle = activeColor;
        ctx.fillText(text, coords.x, coords.y);
      }
      setIsDrawing(false);
    }
  };

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'airbrush') {
      const r = brushSize * 6;
      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * r;
        ctx.fillStyle = activeColor;
        ctx.fillRect(coords.x + radius * Math.cos(angle), coords.y + radius * Math.sin(angle), 1, 1);
      }
    } else if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'circle' || activeTool === 'select') {
      if (canvasSnapshot) ctx.putImageData(canvasSnapshot, 0, 0);
      ctx.beginPath();

      if (activeTool === 'select') {
        // Draw selection rectangle with dashed border, no fill
        const w = coords.x - startPos.x;
        const h = coords.y - startPos.y;
        ctx.setLineDash([4, 2]);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
        ctx.setLineDash([]);
        setSelectionBox({ x: startPos.x, y: startPos.y, w, h });
      } else if (activeTool === 'line') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = brushSize;
        ctx.setLineDash([]);
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = brushSize;
        ctx.setLineDash([]);
        const w = coords.x - startPos.x;
        const h = coords.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (activeTool === 'circle') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = brushSize;
        ctx.setLineDash([]);
        const rx = Math.abs(coords.x - startPos.x) / 2;
        const ry = Math.abs(coords.y - startPos.y) / 2;
        const cx = Math.min(startPos.x, coords.x) + rx;
        const cy = Math.min(startPos.y, coords.y) + ry;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [isDrawing, activeTool, startPos, canvasSnapshot, brushSize, activeColor]);

  const stopDraw = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.setLineDash([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSelectionBox(null);
  };

  const tools = [
    { id: 'select',   icon: <Scissors size={14} />,     title: 'Select' },
    { id: 'eraser',   icon: <Eraser size={14} />,       title: 'Eraser' },
    { id: 'bucket',   icon: <PaintBucket size={14} />,  title: 'Fill Bucket' },
    { id: 'pipette',  icon: <Pipette size={14} />,      title: 'Pick Color (click=fg, right-click=bg)' },
    { id: 'pencil',   icon: <Pencil size={14} />,       title: 'Pencil' },
    { id: 'brush',    icon: <Paintbrush size={14} />,   title: 'Brush' },
    { id: 'airbrush', icon: <SprayCan size={14} />,     title: 'Airbrush' },
    { id: 'text',     icon: <Type size={14} />,         title: 'Text' },
    { id: 'line',     icon: <Slash size={14} />,        title: 'Line' },
    { id: 'rect',     icon: <Square size={14} />,       title: 'Rectangle' },
    { id: 'circle',   icon: <Circle size={14} />,       title: 'Ellipse' },
  ];

  const cursorStyle = () => {
    if (activeTool === 'pipette') return 'crosshair';
    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'airbrush') return 'crosshair';
    if (activeTool === 'eraser') return 'cell';
    if (activeTool === 'text') return 'text';
    return 'crosshair';
  };

  return (
    <div style={{ background: 'var(--win-gray)', height: '100%', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {/* Top Menu Bar */}
      <div style={{ display: 'flex', gap: 12, padding: '2px 8px', fontSize: 11, borderBottom: '1px solid #808080', background: 'var(--win-gray)', flexShrink: 0 }}>
        <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
        <span style={{ cursor: 'pointer' }}><u>E</u>dit</span>
        <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
        <span style={{ cursor: 'pointer' }}><u>I</u>mage</span>
        <span style={{ cursor: 'pointer' }}><u>C</u>olors</span>
        <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
        <span style={{ cursor: 'pointer', marginLeft: 'auto', color: '#000080', fontWeight: 'bold' }} onClick={clearCanvas}>Clear</span>
      </div>

      {/* Main Workspace (Tools + Canvas) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 4, gap: 4, minHeight: 0 }}>
        {/* Left Toolbar Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
          <div className="win-inset-gray" style={{ padding: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`win-outset-btn ${activeTool === tool.id ? 'active' : ''}`}
                style={{ width: 25, height: 25, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setActiveTool(tool.id)}
                title={tool.title}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* Brush Thickness Selector */}
          <div className="win-inset-gray" style={{ width: 54, height: 64, padding: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
            {[1, 2, 4, 6].map((size) => (
              <div
                key={size}
                onClick={() => setBrushSize(size)}
                title={`Size ${size}`}
                style={{
                  width: 38,
                  height: size * 2 + 2,
                  backgroundColor: brushSize === size ? '#000080' : '#000000',
                  cursor: 'pointer',
                  borderRadius: 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Canvas Scroll Container */}
        <div className="win-inset" style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 8 }}>
          <canvas
            ref={canvasRef}
            width={620}
            height={400}
            style={{
              background: '#ffffff',
              cursor: cursorStyle(),
              boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              display: 'block'
            }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onContextMenu={(e) => {
              e.preventDefault();
              if (activeTool === 'pipette') {
                const coords = getCanvasCoords(e);
                const ctx = canvasRef.current.getContext('2d');
                setSecondaryColor(getPixelColor(ctx, coords.x, coords.y));
              }
            }}
          />
        </div>
      </div>

      {/* Bottom Color Palette Bar */}
      <div className="win-inset-gray" style={{ padding: 4, display: 'flex', alignItems: 'center', gap: 8, height: 42, flexShrink: 0 }}>
        {/* Active Foreground & Background Indicator */}
        <div className="win-inset" style={{ width: 34, height: 34, position: 'relative', background: '#c0c0c0', flexShrink: 0 }}>
          <div
            style={{ width: 18, height: 18, backgroundColor: secondaryColor, position: 'absolute', bottom: 2, right: 2, border: '1px solid #000', cursor: 'pointer' }}
            title="Secondary (BG) color — right-click swatches to set"
          />
          <div
            style={{ width: 18, height: 18, backgroundColor: activeColor, position: 'absolute', top: 2, left: 2, border: '1px solid #000', zIndex: 2, cursor: 'pointer' }}
            title="Primary (FG) color — left-click swatches to set"
          />
        </div>

        {/* 28 Win95 Color Swatches */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 16px)', gap: 1 }}>
          {COLORS.map((c, i) => (
            <div
              key={i}
              style={{
                width: 15, height: 15, backgroundColor: c,
                border: activeColor === c ? '2px solid #000000' : '1px solid #808080',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
              onClick={() => setActiveColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setSecondaryColor(c); }}
              title={c}
            />
          ))}
        </div>

        {/* Tool hint */}
        <div style={{ fontSize: 11, color: '#444', marginLeft: 8 }}>
          {activeTool === 'pipette' && 'Click canvas to pick FG color • Right-click for BG'}
          {activeTool === 'text' && 'Click canvas to place text'}
          {activeTool === 'select' && 'Drag to select region'}
          {activeTool === 'bucket' && 'Click to flood-fill'}
        </div>
      </div>
    </div>
  );
}
