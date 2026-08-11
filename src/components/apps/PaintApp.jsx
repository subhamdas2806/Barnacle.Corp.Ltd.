import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Paintbrush, Eraser, PaintBucket, Type, Slash, Square, Circle, Scissors, ZoomIn, Pipette, SprayCan } from 'lucide-react';

const COLORS = [
  '#000000', '#787878', '#790000', '#787900', '#007900', '#007978', '#000078', '#790079', '#787938', '#003838', '#0078f8', '#003878', '#3800f8', '#783800',
  '#ffffff', '#bbbbbb', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff78', '#00ff78', '#78ffff', '#7878ff', '#ff0078', '#ff7838'
];

export default function PaintApp() {
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState('pencil');
  const [activeColor, setActiveColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasSnapshot, setCanvasSnapshot] = useState(null);

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

    // Save snapshot for shape preview
    setCanvasSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = activeTool === 'eraser' ? secondaryColor : activeColor;
      ctx.lineWidth = activeTool === 'eraser' ? brushSize * 4 : activeTool === 'brush' ? brushSize * 2 : 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (activeTool === 'bucket') {
      // Simple canvas fill
      ctx.fillStyle = activeColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (activeTool === 'line' || activeTool === 'rect' || activeTool === 'circle') {
      // Restore previous state before drawing preview shape
      if (canvasSnapshot) {
        ctx.putImageData(canvasSnapshot, 0, 0);
      }
      ctx.beginPath();
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = brushSize;

      if (activeTool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        const w = coords.x - startPos.x;
        const h = coords.y - startPos.y;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (activeTool === 'circle') {
        const rx = Math.abs(coords.x - startPos.x) / 2;
        const ry = Math.abs(coords.y - startPos.y) / 2;
        const cx = Math.min(startPos.x, coords.x) + rx;
        const cy = Math.min(startPos.y, coords.y) + ry;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ background: 'var(--win-gray)', height: '100%', display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
      {/* Top Menu Bar */}
      <div style={{ display: 'flex', gap: 12, padding: '2px 8px', fontSize: 11, borderBottom: '1px solid #808080', background: 'var(--win-gray)' }}>
        <span style={{ cursor: 'pointer' }}><u>F</u>ile</span>
        <span style={{ cursor: 'pointer' }}><u>E</u>dit</span>
        <span style={{ cursor: 'pointer' }}><u>V</u>iew</span>
        <span style={{ cursor: 'pointer' }}><u>I</u>mage</span>
        <span style={{ cursor: 'pointer' }}><u>C</u>olors</span>
        <span style={{ cursor: 'pointer' }}><u>H</u>elp</span>
        <span style={{ cursor: 'pointer' }} onClick={clearCanvas}><u>C</u>lear</span>
      </div>

      {/* Main Workspace (Tools + Canvas) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 4, gap: 4 }}>
        {/* Left Toolbar Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="win-inset-gray" style={{ padding: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <button className={`win-outset-btn ${activeTool === 'select' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('select')} title="Select"><Scissors size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'eraser' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('eraser')} title="Eraser"><Eraser size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'bucket' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('bucket')} title="Fill Bucket"><PaintBucket size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'pipette' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('pipette')} title="Pick Color"><Pipette size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'pencil' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('pencil')} title="Pencil"><Pencil size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'brush' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('brush')} title="Brush"><Paintbrush size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'airbrush' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('airbrush')} title="Airbrush"><SprayCan size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'text' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('text')} title="Text"><Type size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'line' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('line')} title="Line"><Slash size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'rect' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('rect')} title="Rectangle"><Square size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'circle' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('circle')} title="Ellipse"><Circle size={14} /></button>
            <button className={`win-outset-btn ${activeTool === 'zoom' ? 'active' : ''}`} style={{ width: 25, height: 25, padding: 0 }} onClick={() => setActiveTool('zoom')} title="Magnifier"><ZoomIn size={14} /></button>
          </div>

          {/* Sub-option Thickness Box */}
          <div className="win-inset-gray" style={{ width: 54, height: 64, padding: 4, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
            {[1, 2, 4, 6].map((size) => (
              <div
                key={size}
                onClick={() => setBrushSize(size)}
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
        <div className="win-inset" style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
          <canvas
            ref={canvasRef}
            width={640}
            height={420}
            style={{ background: '#ffffff', cursor: activeTool === 'pencil' || activeTool === 'brush' ? 'crosshair' : 'default', boxShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>

      {/* Bottom Color Palette Bar */}
      <div className="win-inset-gray" style={{ padding: 4, display: 'flex', alignItems: 'center', gap: 8, height: 42 }}>
        {/* Active Foreground & Background Indicator */}
        <div className="win-inset" style={{ width: 32, height: 32, position: 'relative', background: '#c0c0c0' }}>
          <div style={{ width: 16, height: 16, backgroundColor: secondaryColor, position: 'absolute', bottom: 3, right: 3, border: '1px solid #000' }} />
          <div style={{ width: 16, height: 16, backgroundColor: activeColor, position: 'absolute', top: 3, left: 3, border: '1px solid #000', zIndex: 2 }} />
        </div>

        {/* 28 Win95 Color Swatches */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 15px)', gap: 1 }}>
          {COLORS.map((c, i) => (
            <div
              key={i}
              className="win-outset-btn"
              style={{ width: 15, height: 15, backgroundColor: c, border: '1px solid #808080', cursor: 'pointer' }}
              onClick={() => setActiveColor(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSecondaryColor(c);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
