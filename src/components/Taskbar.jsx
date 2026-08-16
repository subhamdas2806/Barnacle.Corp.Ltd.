import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, MenuList, MenuListItem, Separator, Frame } from 'react95';
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
  HelpBook,
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
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 38,
          zIndex: 9999,
          background: '#c0c0c0',
          borderTop: '2px solid #ffffff',
          boxShadow: 'inset 0 1px 0 #dfdfdf',
          display: 'flex',
          alignItems: 'center',
          padding: '2px 4px'
        }}
      >
        {/* Start Button */}
        <Button
          active={isStartOpen}
          onClick={() => {
            playClickSound();
            setIsStartOpen(!isStartOpen);
          }}
          style={{
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            height: 30,
            marginRight: 6,
            padding: '0 6px'
          }}
        >
          <Shell3240 variant="16x16_4" style={{ width: 16, height: 16 }} />
          <span>Start</span>
        </Button>

        {/* Taskbar Running Apps List */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            flex: 1,
            overflowX: 'auto',
            height: '100%',
            alignItems: 'center'
          }}
        >
          {openApps.map((app) => {
            const IconComp = app.icon;
            const isActive = activeAppId === app.id && !app.minimized;
            return (
              <Button
                key={app.id}
                active={isActive}
                onClick={() => {
                  playClickSound();
                  onAppClick(app.id);
                }}
                style={{
                  height: 30,
                  minWidth: 120,
                  maxWidth: 180,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 8px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {IconComp && (
                  <IconComp style={{ width: 16, height: 16, flexShrink: 0 }} />
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.title}</span>
              </Button>
            );
          })}
        </div>

        {/* System Tray Clock & Sound Toggle */}
        <Frame
          variant="well"
          style={{
            height: 28,
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            background: '#c0c0c0',
            marginLeft: 6
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
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
        </Frame>
      </div>

      {/* Start Menu Dropdown */}
      {isStartOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 38,
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
