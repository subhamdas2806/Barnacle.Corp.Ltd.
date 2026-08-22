import React, { useState, useEffect } from 'react';
import { Button, MenuList, MenuListItem, Separator, Frame } from 'react95';
import {
  Computer,
  Mspaint,
  Winmine1,
  FileText,
  MediaCd,
  FolderOpen,
  PowerOff,
  Mute,
  Unmute,
  MsDos,
  Shell3240
} from '@react95/icons';
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
      {/* Bottom Taskbar Container */}
      <div className="taskbar">
        {/* Start Button */}
        <button
          type="button"
          className={`win-task-btn start-btn ${isStartOpen ? 'pressed' : ''}`}
          onClick={() => {
            playClickSound();
            setIsStartOpen(!isStartOpen);
          }}
        >
          <Shell3240 variant="16x16_4" style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>Start</span>
        </button>

        {/* Taskbar Running Apps List */}
        <div className="taskbar-apps">
          {openApps.map((app) => {
            const IconComp = app.icon;
            const isActive = activeAppId === app.id && !app.minimized;
            return (
              <button
                key={app.id}
                type="button"
                className={`win-task-btn task-app-btn ${isActive ? 'pressed' : ''}`}
                onClick={() => {
                  playClickSound();
                  onAppClick(app.id);
                }}
              >
                {IconComp && (
                  <IconComp style={{ width: 16, height: 16, flexShrink: 0 }} />
                )}
                <span className="task-btn-label">{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* System Tray Clock & Sound Toggle */}
        <div className="system-tray">
          <button
            type="button"
            className="tray-btn"
            onClick={() => {
              const newMute = !isMuted;
              setIsMuted(newMute);
              if (!newMute) playWin95Startup();
            }}
            title={isMuted ? 'Unmute Retro Sounds' : 'Mute Retro Sounds'}
          >
            {isMuted ? (
              <Mute style={{ width: 16, height: 16 }} />
            ) : (
              <Unmute style={{ width: 16, height: 16 }} />
            )}
          </button>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Start Menu Dropdown */}
      {isStartOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            display: 'flex',
            zIndex: 10000,
            boxShadow: '3px 3px 10px rgba(0,0,0,0.5)'
          }}
        >
          <MenuList style={{ display: 'flex', padding: 2 }}>
            {/* Windows 95 vertical banner */}
            <div
              style={{
                width: 28,
                background: 'linear-gradient(180deg, #000080, #1084d0)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 15,
                letterSpacing: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '10px 4px',
                marginRight: 4
              }}
            >
              SCUM<span style={{ color: '#c0c0c0', marginLeft: 2 }}>OS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
              <MenuListItem onClick={() => handleStartItemClick('mySystem')}>
                <Computer style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>SCUMOS Explorer</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('photos')}>
                <MediaCd style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Photos Gallery</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('artwork')}>
                <FolderOpen style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Artworks Folder</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('paint')}>
                <Mspaint style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Paint</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('minesweeper')}>
                <Winmine1 style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Minesweeper</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('doom')}>
                <MsDos style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Doom</span>
              </MenuListItem>
              <MenuListItem onClick={() => handleStartItemClick('credits')}>
                <FileText style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Credits.txt</span>
              </MenuListItem>

              <Separator />

              <MenuListItem onClick={handleShutdown}>
                <PowerOff style={{ width: 20, height: 20, marginRight: 8 }} />
                <span>Shut Down...</span>
              </MenuListItem>
            </div>
          </MenuList>
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
          <div style={{ width: 360 }}>
            <Frame
              variant="window"
              style={{
                width: '100%',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div
                style={{
                  background: '#000080',
                  color: '#ffffff',
                  padding: '2px 6px',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PowerOff style={{ width: 16, height: 16 }} />
                  <span>Shut Down Windows</span>
                </div>
                <Button
                  size="sm"
                  square
                  onClick={() => setShowShutdown(false)}
                  style={{ width: 18, height: 18, minWidth: 18 }}
                >
                  ✕
                </Button>
              </div>

              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Computer style={{ width: 42, height: 42 }} />
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: 13 }}>Are you sure you want to exit SCUMOS?</p>
                    <p style={{ fontSize: 11, color: '#444', marginTop: 4 }}>
                      You can reboot the system anytime or return to your 3D desktop workspace.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Button
                    onClick={() => window.location.reload()}
                    style={{ padding: '4px 16px', fontWeight: 'bold' }}
                  >
                    Reboot
                  </Button>
                  <Button
                    onClick={() => setShowShutdown(false)}
                    style={{ padding: '4px 16px' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Frame>
          </div>
        </div>
      )}
    </>
  );
}
