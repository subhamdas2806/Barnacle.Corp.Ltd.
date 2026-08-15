import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DOOM } from 'wasm-doom';

const SCREEN_W = 640;
const SCREEN_H = 400;

export default function DoomGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const doomRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | running | error
  const [errorMsg, setErrorMsg] = useState('');

  const startDoom = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || doomRef.current) return;

    setStatus('loading');

    try {
      const ctx = canvas.getContext('2d');

      const doom = new DOOM({
        screenWidth: SCREEN_W,
        screenHeight: SCREEN_H,
        keyboardTarget: containerRef.current || document.documentElement,
        onFrameRender: ({ screen }) => {
          // screen is a Uint8ClampedArray of the native 640x400 RGBA buffer
          const frame = new ImageData(
            new Uint8ClampedArray(screen.buffer, screen.byteOffset, SCREEN_W * SCREEN_H * 4),
            SCREEN_W,
            SCREEN_H
          );
          ctx.putImageData(frame, 0, 0);
        },
      });

      doomRef.current = doom;
      await doom.start();
      setStatus('running');
    } catch (err) {
      console.error('Doom failed to start:', err);
      setErrorMsg(err?.message || 'Failed to load Doom WASM');
      setStatus('error');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      doomRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      style={{
        background: '#000000',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        userSelect: 'none',
        position: 'relative',
      }}
      // Make the container focusable so keyboard events work
      onClick={() => containerRef.current?.focus()}
    >
      {/* Game Canvas — always mounted so ctx is available when doom starts */}
      <canvas
        ref={canvasRef}
        width={SCREEN_W}
        height={SCREEN_H}
        style={{
          display: status === 'running' ? 'block' : 'none',
          imageRendering: 'pixelated',
          maxWidth: '100%',
          maxHeight: '100%',
          cursor: 'none',
        }}
      />

      {/* Idle / Start Screen */}
      {status === 'idle' && (
        <div style={{ textAlign: 'center', color: '#ff4444' }}>
          <div style={{
            fontFamily: 'var(--font-retro-header)',
            fontSize: 52,
            fontWeight: 900,
            color: '#ff0000',
            textShadow: '3px 3px 0 #880000, 6px 6px 0 #440000',
            letterSpacing: 6,
            marginBottom: 8
          }}>
            DOOM
          </div>
          <div style={{ color: '#c0c0c0', fontSize: 14, marginBottom: 24, fontFamily: 'var(--font-system)' }}>
            WebAssembly Edition · 640×400 · Native Render
          </div>
          <button
            className="win-outset-btn"
            style={{
              padding: '8px 32px',
              fontSize: 16,
              fontFamily: 'var(--font-system)',
              cursor: 'pointer',
              background: '#c0c0c0',
              letterSpacing: 1,
            }}
            onClick={startDoom}
          >
            ▶  RUN DOOM
          </button>
          <div style={{ marginTop: 16, fontSize: 11, color: '#666', fontFamily: 'var(--font-system)' }}>
            Uses WASD / Arrow Keys · Ctrl = Shoot · Space = Use · Shift = Run
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {status === 'loading' && (
        <div style={{ textAlign: 'center', color: '#ff4444' }}>
          <div style={{
            fontFamily: 'var(--font-retro-header)',
            fontSize: 52,
            fontWeight: 900,
            color: '#ff0000',
            textShadow: '3px 3px 0 #880000',
            letterSpacing: 6,
            marginBottom: 16
          }}>
            DOOM
          </div>
          <div style={{ color: '#c0c0c0', fontSize: 13, fontFamily: 'var(--font-system)', animation: 'none' }}>
            Loading WebAssembly module…
          </div>
          <div style={{ marginTop: 12, color: '#888', fontSize: 11, fontFamily: 'var(--font-system)' }}>
            Fetching doom.wasm from CDN
          </div>
        </div>
      )}

      {/* Error Screen */}
      {status === 'error' && (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ color: '#ff4444', fontSize: 18, fontWeight: 'bold', marginBottom: 8, fontFamily: 'var(--font-system)' }}>
            Failed to load Doom
          </div>
          <div style={{ color: '#888', fontSize: 12, fontFamily: 'var(--font-system)', marginBottom: 16 }}>
            {errorMsg}
          </div>
          <button
            className="win-outset-btn"
            style={{ padding: '4px 16px', fontFamily: 'var(--font-system)' }}
            onClick={() => { doomRef.current = null; setStatus('idle'); setErrorMsg(''); }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Running — controls hint */}
      {status === 'running' && (
        <div style={{
          position: 'absolute',
          bottom: 4,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 10,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-system)',
          pointerEvents: 'none',
        }}>
          Click window to focus · WASD/Arrows = Move · Ctrl = Shoot · Space = Use · Esc = Menu
        </div>
      )}
    </div>
  );
}
