import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Monitor, Terminal, Gamepad2, FileText, Cpu, Power, RefreshCw, Palette } from 'lucide-react';
import { playClickSound, playWin95Startup, playErrorBeep } from '../utils/audio';

export default function Taskbar({ openApps, activeAppId, onAppClick, onLaunchApp, isMuted, setIsMuted }) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [showShutdown, setShowShutdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartItemClick = (appId) => {
    playClickSound();
    setIsStartOpen(false);
    onLaunchApp(appId);
  };

  const handleShutdown = () => {
    playErrorBeep();
    setShowShutdown(true);
  };

  return (
    <>
      <div className="taskbar">
        {/* Start Button */}
        <button
          className={`win-outset-btn start-btn ${isStartOpen ? 'active' : ''}`}
          onClick={() => {
            playClickSound();
            setIsStartOpen(!isStartOpen);
          }}
        >
          <div className="start-flag">
            <span style={{ backgroundColor: '#ff4b4b' }}></span>
            <span style={{ backgroundColor: '#52d052' }}></span>
            <span style={{ backgroundColor: '#0084ff' }}></span>
            <span style={{ backgroundColor: '#ffd700' }}></span>
          </div>
          <span>Start</span>
        </button>

        {/* Taskbar Active Apps */}
        <div className="taskbar-apps">
          {openApps.map((app) => {
            const IconComp = app.icon;
            return (
              <button
                key={app.id}
                className={`win-outset-btn taskbar-app-btn ${activeAppId === app.id && !app.minimized ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  onAppClick(app.id);
                }}
              >
                {IconComp && <IconComp size={14} />}
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="win-inset system-tray">
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => {
              const newMute = !isMuted;
              setIsMuted(newMute);
              if (!newMute) playWin95Startup();
            }}
            title={isMuted ? "Unmute Retro Sounds" : "Mute Retro Sounds"}
          >
            {isMuted ? <VolumeX size={14} color="#808080" /> : <Volume2 size={14} color="#000000" />}
          </button>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Start Menu Dropdown */}
      {isStartOpen && (
        <div className="start-menu">
          <div className="start-banner">
            Windows <span>95</span>
          </div>
          <div className="start-items">
            <div className="start-item" onClick={() => handleStartItemClick('mySystem')}>
              <Monitor size={18} color="#000080" />
              <span>DELTAOS Explorer</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('paint')}>
              <Palette size={18} color="#008080" />
              <span>Paint</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('doom')}>
              <Gamepad2 size={18} color="#800000" />
              <span>Doom (3D Shooter)</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('oregon')}>
              <Terminal size={18} color="#008000" />
              <span>The Oregon Trail</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('henordle')}>
              <Cpu size={18} color="#800080" />
              <span>Henordle (Wordle)</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('minesweeper')}>
              <Gamepad2 size={18} color="#008080" />
              <span>Minesweeper</span>
            </div>
            <div className="start-item" onClick={() => handleStartItemClick('credits')}>
              <FileText size={18} color="#444444" />
              <span>Credits & Readme</span>
            </div>

            <div className="start-divider"></div>

            <div className="start-item" onClick={handleShutdown}>
              <Power size={18} color="#cc0000" />
              <span>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* Shut Down Modal */}
      {showShutdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20000
          }}
        >
          <div className="win-window" style={{ width: 360, position: 'relative' }}>
            <div className="win-titlebar">
              <div className="win-title-left">
                <Power size={14} />
                <span>Shut Down Windows</span>
              </div>
              <button className="win-outset-btn win-btn-ctrl" onClick={() => setShowShutdown(false)}>
                ✕
              </button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Monitor size={48} color="#000080" />
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: 13 }}>Are you sure you want to exit DELTAOS?</p>
                  <p style={{ fontSize: 11, color: '#444', marginTop: 4 }}>
                    You can reboot the system anytime or return to your 3D desktop workspace.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  className="win-outset-btn"
                  style={{ padding: '4px 16px', fontWeight: 'bold' }}
                  onClick={() => window.location.reload()}
                >
                  Reboot
                </button>
                <button
                  className="win-outset-btn"
                  style={{ padding: '4px 16px' }}
                  onClick={() => setShowShutdown(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
