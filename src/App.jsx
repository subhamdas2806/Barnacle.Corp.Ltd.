import React, { useState, useEffect } from 'react';
import { styleReset } from 'react95';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import original from 'react95/dist/themes/original';
import {
  Computer,
  Mspaint,
  Winmine1,
  FileText,
  Progman13,
  HelpBook,
  Progman24,
  Appwiz1500,
  CdMusic
} from '@react95/icons';

const DoomIcon = () => (
  <img src="/doom-icon.png" width={34} height={34} style={{ imageRendering: 'pixelated', display: 'block' }} alt="Doom" />
);

import Window from './components/Window';
import Taskbar from './components/Taskbar';
import MySystem from './components/apps/MySystem';
import DoomGame from './components/apps/DoomGame';
import OregonTrail from './components/apps/OregonTrail';
import Henordle from './components/apps/Henordle';
import Minesweeper from './components/apps/Minesweeper';
import NotepadCredits from './components/apps/NotepadCredits';
import PaintApp from './components/apps/PaintApp';
import EmbeddedPortfolio from './components/EmbeddedPortfolio';
import PhotosApp from './components/apps/PhotosApp';
import ArtApp from './components/apps/ArtApp';
import MusicApp from './components/apps/MusicApp';
import { playClickSound, playWin95Startup, playErrorBeep } from './utils/audio';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  body {
    font-family: 'ms_sans_serif', 'Segoe UI', Tahoma, sans-serif;
  }
`;

const DESKTOP_APPS = [
  { id: 'mySystem', title: 'My System', icon: Computer, component: MySystem, defaultPos: { x: 30, y: 20 }, defaultSize: { width: 680, height: 480 } },
  { id: 'photos', title: 'Photos', icon: Progman13, component: PhotosApp, defaultPos: { x: 50, y: 30 }, defaultSize: { width: 640, height: 480 } },
  { id: 'artwork', title: 'Artbook', icon: HelpBook, component: ArtApp, defaultPos: { x: 70, y: 40 }, defaultSize: { width: 640, height: 480 } },
  { id: 'paint', title: 'Paint', icon: Mspaint, component: PaintApp, defaultPos: { x: 90, y: 50 }, defaultSize: { width: 640, height: 460 } },
  { id: 'minesweeper', title: 'Minesweeper', icon: Winmine1, component: Minesweeper, defaultPos: { x: 120, y: 60 }, defaultSize: { width: 280, height: 340 } },
  { id: 'doom', title: 'Doom', icon: DoomIcon, component: DoomGame, defaultPos: { x: 60, y: 20 }, defaultSize: { width: 660, height: 470 } },
  { id: 'oregon', title: 'Oregon Trail', icon: Progman24, component: OregonTrail, defaultPos: { x: 160, y: 50 }, defaultSize: { width: 540, height: 420 } },
  { id: 'henordle', title: 'Wordle', icon: Appwiz1500, component: Henordle, defaultPos: { x: 180, y: 20 }, defaultSize: { width: 440, height: 580 } },
  { id: 'music', title: 'Music Player', icon: CdMusic, component: MusicApp, defaultPos: { x: 200, y: 30 }, defaultSize: { width: 380, height: 520 } },
  { id: 'credits', title: 'Credits.txt', icon: FileText, component: NotepadCredits, defaultPos: { x: 100, y: 80 }, defaultSize: { width: 480, height: 380 } }
];

export default function App() {
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <InnerApp />
    </ThemeProvider>
  );
}

function InnerApp() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [openApps, setOpenApps] = useState([
    { id: 'mySystem', title: 'My System', icon: Computer, minimized: false }
  ]);
  const [activeAppId, setActiveAppId] = useState('mySystem');
  const [topZIndex, setTopZIndex] = useState(10);
  const [appZIndices, setAppZIndices] = useState({ mySystem: 10 });
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isEmbedded = currentPath.startsWith('/embed') || window.location.search.includes('embed=true') || window.location.hash === '#embed';

  if (isEmbedded) {
    return <EmbeddedPortfolio />;
  }

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
    <div className="desktop-container aspect-contained" onClick={() => setSelectedIcon(null)}>
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
                {IconComp && <IconComp style={{ width: 34, height: 34 }} />}
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
            onMaximize={() => {}}
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
