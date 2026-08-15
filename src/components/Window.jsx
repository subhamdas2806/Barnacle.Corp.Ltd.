import React, { useState, useEffect, useRef } from 'react';
import {
  Window as R95Window,
  WindowHeader,
  WindowContent,
  Button
} from 'react95';

export default function Window({
  id,
  title,
  icon: IconComponent,
  children,
  onClose,
  onMinimize,
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
    // The container is #root — get its bounding rect
    const root = document.getElementById('root');
    if (!root) return { width: window.innerWidth, height: window.innerHeight };
    const rect = root.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  };

  const clampPos = (x, y) => {
    const { width: cw, height: ch } = getContainerBounds();
    const TASKBAR_HEIGHT = 32;
    const clampedX = Math.max(0, Math.min(x, cw - defaultSize.width));
    const clampedY = Math.max(0, Math.min(y, ch - TASKBAR_HEIGHT - 24)); // keep titlebar visible
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
      {/* Actual Window */}
      <div
        ref={windowRef}
        onMouseDown={() => onFocus(id)}
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: defaultSize.width,
          height: defaultSize.height,
          zIndex: zIndex,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <R95Window
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <WindowHeader
            active={isActive}
            onMouseDown={handleMouseDown}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: 'move'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
              {IconComponent && (
                <IconComponent style={{ width: 16, height: 16, flexShrink: 0 }} />
              )}
              <span style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }} onMouseDown={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                square
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize(id);
                }}
                style={{ fontWeight: 'bold', width: 22, height: 22, minWidth: 22 }}
              >
                _
              </Button>
              <Button
                size="sm"
                square
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(id);
                }}
                style={{ fontWeight: 'bold', width: 22, height: 22, minWidth: 22 }}
              >
                ✕
              </Button>
            </div>
          </WindowHeader>

          <WindowContent
            style={{
              flex: 1,
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {children}
          </WindowContent>
        </R95Window>
      </div>

      {/* Windows 95 Wireframe Ghost Dragging Box */}
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
