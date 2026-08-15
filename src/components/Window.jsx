import React from 'react';
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
  return (
    <div
      onMouseDown={() => onFocus(id)}
      style={{
        position: 'absolute',
        left: defaultPos.x,
        top: defaultPos.y,
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
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
            cursor: 'move'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            {IconComponent && typeof IconComponent === 'function' ? (
              <IconComponent style={{ width: 16, height: 16 }} />
            ) : null}
            <span style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>{title}</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
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
  );
}
