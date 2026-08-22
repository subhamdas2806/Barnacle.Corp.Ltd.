import React, { useState, useEffect, useRef } from 'react';

export default function Window({
  id,
  title,
  icon: IconComponent,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  isActive,
  zIndex,
  defaultPos = { x: 80, y: 30 },
  defaultSize = { width: 680, height: 480 }
}) {
  const [pos, setPos] = useState(defaultPos);
  const [isDragging, setIsDragging] = useState(false);
  const [ghostPos, setGhostPos] = useState(defaultPos);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const windowRef = useRef(null);

  const getContainerBounds = () => {
    const root = document.getElementById('root');
    if (!root) return { width: window.innerWidth, height: window.innerHeight };
    const rect = root.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  const clampPos = (x, y) => {
    const { width: cw, height: ch } = getContainerBounds();
    const TASKBAR_HEIGHT = 32;
    const clampedX = Math.max(0, Math.min(x, cw - defaultSize.width));
    const clampedY = Math.max(0, Math.min(y, ch - TASKBAR_HEIGHT - 24));
    return { x: clampedX, y: clampedY };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    onFocus(id);
    setIsDragging(true);
    setGhostPos(pos);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: pos.x,
      posY: pos.y
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const rawX = dragStartRef.current.posX + deltaX;
      const rawY = dragStartRef.current.posY + deltaY;
      const clamped = clampPos(rawX, rawY);
      setGhostPos(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setPos(ghostPos);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, ghostPos]);

  return (
    <>
      <div
        ref={windowRef}
        className="win-window"
        onMouseDown={() => onFocus(id)}
        style={{
          left: pos.x,
          top: pos.y,
          width: defaultSize.width,
          height: defaultSize.height,
          zIndex: zIndex
        }}
      >
        <div
          className={`win-titlebar ${isActive ? 'active' : 'inactive'}`}
          onMouseDown={handleMouseDown}
        >
          <div className="win-title-left">
            {IconComponent && <IconComponent className="win-title-icon" />}
            <span className="win-title-text">{title}</span>
          </div>
          <div className="win-controls" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="win-btn-ctrl"
              aria-label="Minimize"
              onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            >
              <span className="win-glyph win-glyph-minimize" />
            </button>
            <button
              type="button"
              className="win-btn-ctrl"
              aria-label="Maximize"
              disabled
            >
              <span className="win-glyph win-glyph-maximize" />
            </button>
            <button
              type="button"
              className="win-btn-ctrl"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); onClose(id); }}
            >
              <svg
                className="win-glyph win-glyph-close"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                shapeRendering="crispEdges"
                aria-hidden="true"
              >
                <path
                  fill="#000000"
                  d="M0 0h2v1H0zM6 0h2v1H6zM0 1h2v1H0zM6 1h2v1H6zM1 2h2v1H1zM5 2h2v1H5zM1 3h2v1H1zM5 3h2v1H5zM2 4h4v1H2zM2 5h4v1H2zM1 6h2v1H1zM5 6h2v1H5zM1 7h2v1H1zM5 7h2v1H5z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="win-body">
          {children}
        </div>
      </div>

      {isDragging && (
        <div
          style={{
            position: 'absolute',
            left: ghostPos.x,
            top: ghostPos.y,
            width: defaultSize.width,
            height: defaultSize.height,
            border: '3px dotted #000000',
            boxShadow: 'inset 0 0 0 1px #ffffff',
            pointerEvents: 'none',
            zIndex: 99999
          }}
        />
      )}
    </>
  );
}
