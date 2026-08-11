import React, { useState, useRef, useEffect } from 'react';

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
  defaultPos = { x: 100, y: 40 },
  defaultSize = { width: 740, height: 520 }
}) {
  const [pos, setPos] = useState(defaultPos);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState({ pos, size });

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    onFocus(id);
    if (e.target.closest('.win-titlebar') && !e.target.closest('.win-controls')) {
      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging.current && !isMaximized) {
        setPos({
          x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 32 - 25, e.clientY - dragOffset.current.y))
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized, size.width, size.height]);

  const toggleMaximize = () => {
    if (isMaximized) {
      setPos(preMaxState.pos);
      setSize(preMaxState.size);
      setIsMaximized(false);
    } else {
      setPreMaxState({ pos, size });
      setPos({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 32
      });
      setIsMaximized(true);
    }
  };

  return (
    <div
      className="win-window"
      style={{
        left: isMaximized ? 0 : `${pos.x}px`,
        top: isMaximized ? 0 : `${pos.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 32px)' : `${size.height}px`,
        zIndex: zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Authentic Win95 Title Bar */}
      <div className={`win-titlebar ${!isActive ? 'inactive' : ''}`}>
        <div className="win-title-left">
          {IconComponent && <IconComponent size={13} style={{ flexShrink: 0 }} />}
          <span>{title}</span>
        </div>
        <div className="win-controls">
          <button className="win-btn-ctrl" onClick={() => onMinimize(id)} title="Minimize">
            _
          </button>
          <button className="win-btn-ctrl" onClick={toggleMaximize} title={isMaximized ? "Restore" : "Maximize"}>
            {isMaximized ? '❐' : '☐'}
          </button>
          <button className="win-btn-ctrl" onClick={() => onClose(id)} title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Window Body Container with Recessed Bevel */}
      <div className="win-body">
        {children}
      </div>
    </div>
  );
}
