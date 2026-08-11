import React, { useState } from 'react';
import { Monitor, Gamepad2, Terminal, Cpu, FileText, Trash2, Palette } from 'lucide-react';
import Window from './components/Window';
import Taskbar from './components/Taskbar';
import MySystem from './components/apps/MySystem';
import DoomGame from './components/apps/DoomGame';
import OregonTrail from './components/apps/OregonTrail';
import Henordle from './components/apps/Henordle';
import Minesweeper from './components/apps/Minesweeper';
import NotepadCredits from './components/apps/NotepadCredits';
import PaintApp from './components/apps/PaintApp';
import { playClickSound, playWin95Startup, playErrorBeep } from './utils/audio';

const DESKTOP_APPS = [
  { id: 'mySystem', title: 'My System', icon: Monitor, component: MySystem, defaultPos: { x: 60, y: 40 }, defaultSize: { width: 780, height: 560 } },
  { id: 'paint', title: 'Paint', icon: Palette, component: PaintApp, defaultPos: { x: 100, y: 70 }, defaultSize: { width: 720, height: 530 } },
  { id: 'oregon', title: 'The Oregon Trail', icon: Terminal, component: OregonTrail, defaultPos: { x: 140, y: 100 }, defaultSize: { width: 560, height: 460 } },
  { id: 'doom', title: 'Doom', icon: Gamepad2, component: DoomGame, defaultPos: { x: 180, y: 60 }, defaultSize: { width: 520, height: 420 } },
  { id: 'henordle', title: 'Henordle', icon: Cpu, component: Henordle, defaultPos: { x: 220, y: 100 }, defaultSize: { width: 440, height: 480 } },
  { id: 'minesweeper', title: 'Minesweeper', icon: Gamepad2, component: Minesweeper, defaultPos: { x: 260, y: 120 }, defaultSize: { width: 280, height: 340 } },
  { id: 'credits', title: 'Credits.txt', icon: FileText, component: NotepadCredits, defaultPos: { x: 140, y: 140 }, defaultSize: { width: 500, height: 400 } },
  { id: 'trash', title: 'Recycle Bin', icon: Trash2, isSystemBin: true }
];

export default function App() {
  const [openApps, setOpenApps] = useState([
    { id: 'mySystem', title: 'My System', icon: Monitor, minimized: false }
  ]);
  const [activeAppId, setActiveAppId] = useState('mySystem');
  const [topZIndex, setTopZIndex] = useState(10);
  const [appZIndices, setAppZIndices] = useState({ mySystem: 10 });
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleLaunchApp = (appId) => {
    if (!isMuted) playClickSound();

    if (appId === 'trash') {
      if (!isMuted) playErrorBeep();
      alert("Recycle Bin is empty.");
      return;
    }

    const appDef = DESKTOP_APPS.find((a) => a.id === appId);
    if (!appDef) return;

    setOpenApps((prev) => {
      const exists = prev.find((a) => a.id === appId);
      if (exists) {
        return prev.map((a) => (a.id === appId ? { ...a, minimized: false } : a));
      }
      return [...prev, { id: appDef.id, title: appDef.title, icon: appDef.icon, minimized: false }];
    });

    focusApp(appId);
  };

  const focusApp = (appId) => {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setAppZIndices((prev) => ({ ...prev, [appId]: nextZ }));
    setActiveAppId(appId);
  };

  const handleCloseApp = (appId) => {
    if (!isMuted) playClickSound();
    setOpenApps((prev) => prev.filter((a) => a.id !== appId));
    if (activeAppId === appId) {
      const remaining = openApps.filter((a) => a.id !== appId);
      if (remaining.length > 0) {
        focusApp(remaining[remaining.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };

  const handleMinimizeApp = (appId) => {
    if (!isMuted) playClickSound();
    setOpenApps((prev) => prev.map((a) => (a.id === appId ? { ...a, minimized: true } : a)));
    if (activeAppId === appId) {
      const activeList = openApps.filter((a) => a.id !== appId && !a.minimized);
      if (activeList.length > 0) {
        focusApp(activeList[activeList.length - 1].id);
      } else {
        setActiveAppId(null);
      }
    }
  };

  const handleTaskbarAppClick = (appId) => {
    const app = openApps.find((a) => a.id === appId);
    if (!app) return;

    if (activeAppId === appId && !app.minimized) {
      handleMinimizeApp(appId);
    } else {
      setOpenApps((prev) => prev.map((a) => (a.id === appId ? { ...a, minimized: false } : a)));
      focusApp(appId);
    }
  };

  return (
    <div className="desktop-container" onClick={() => setSelectedIcon(null)}>
      {/* Desktop Grid Icons */}
      <div className="desktop-icons">
        {DESKTOP_APPS.map((app) => {
          const IconComp = app.icon;
          const isSelected = selectedIcon === app.id;
          return (
            <div
              key={app.id}
              className={`desktop-icon ${isSelected ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcon(app.id);
              }}
              onDoubleClick={() => handleLaunchApp(app.id)}
            >
              <div className="icon-img">
                <IconComp size={34} color={app.id === 'trash' ? '#666' : '#ffffff'} />
              </div>
              <div className="icon-title">{app.title}</div>
            </div>
          );
        })}
      </div>

      {/* Render Open Windows */}
      {openApps.map((appState) => {
        if (appState.minimized) return null;
        const appDef = DESKTOP_APPS.find((a) => a.id === appState.id);
        if (!appDef || !appDef.component) return null;

        const AppComponent = appDef.component;

        return (
          <Window
            key={appDef.id}
            id={appDef.id}
            title={appDef.title}
            icon={appDef.icon}
            onClose={handleCloseApp}
            onMinimize={handleMinimizeApp}
            onFocus={focusApp}
            isActive={activeAppId === appDef.id}
            zIndex={appZIndices[appDef.id] || 1}
            defaultPos={appDef.defaultPos}
            defaultSize={appDef.defaultSize}
          >
            <AppComponent />
          </Window>
        );
      })}

      {/* Bottom Taskbar */}
      <Taskbar
        openApps={openApps}
        activeAppId={activeAppId}
        onAppClick={handleTaskbarAppClick}
        onLaunchApp={handleLaunchApp}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    </div>
  );
}
