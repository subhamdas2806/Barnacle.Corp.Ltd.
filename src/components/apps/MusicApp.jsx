import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Slider } from 'react95';

// Load all MP3s from /public/music via Vite glob
const musicModules = import.meta.glob('/public/music/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
});

function buildPlaylist() {
  return Object.entries(musicModules).map(([path, url]) => {
    const filename = path.split('/').pop();
    const name = filename.replace(/\.mp3$/i, '');
    return { filename, name, url };
  });
}

function fmt(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MusicApp() {
  const audioRef = useRef(null);
  const [playlist] = useState(buildPlaylist);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80); // 0–100 for Range

  const track = playlist[trackIdx] || null;

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    audio.src = track.url;
    audio.load();
    if (playing) audio.play().catch(() => {});
    setCurrentTime(0);
    setDuration(0);
  }, [trackIdx, track]);

  // Sync volume (Range gives 0-100, audio needs 0-1)
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    setTrackIdx((i) => (i + 1) % playlist.length);
  }, [playlist]);

  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setTrackIdx((i) => (i === 0 ? playlist.length - 1 : i - 1));
  }, [playlist]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => handleNext();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [handleNext]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--win-gray)',
      userSelect: 'none',
    }}>
      <audio ref={audioRef} preload="metadata" />

      {/* LCD Display */}
      <div style={{
        background: '#1a2a1a',
        margin: 8,
        padding: '10px 14px',
        border: '2px solid',
        borderColor: '#404040 #c0c0c0 #c0c0c0 #404040',
        boxShadow: 'inset 1px 1px #000',
      }}>
        <div style={{ fontFamily: 'monospace', color: '#00e000' }}>
          <div style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
            {track ? `${playing ? '▶' : '■'} ${track.name}` : '── NO TRACKS LOADED ──'}
          </div>
          <div style={{ fontSize: 11, color: '#00a000', marginBottom: 6 }}>
            {track ? `Track ${trackIdx + 1} / ${playlist.length}` : 'Drop .mp3 files into /public/music/'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, letterSpacing: 2, color: '#00ff44', fontFamily: '"VT323", monospace' }}>
            <span>{fmt(currentTime)}</span>
            <span style={{ color: '#007700', fontSize: 12, alignSelf: 'center' }}>{playing ? '▶▶' : '■■'}</span>
            <span style={{ color: '#007700' }}>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      {/* Progress bar (seekable) */}
      <div style={{ padding: '0 8px', marginBottom: 8 }}>
        <div
          onClick={handleSeek}
          style={{
            height: 14,
            background: '#000',
            border: '2px solid',
            borderColor: '#404040 #dfdfdf #dfdfdf #404040',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${progressPct}%`,
            background: playing
              ? 'repeating-linear-gradient(90deg,#00d000 0px,#00d000 3px,#001400 3px,#001400 4px)'
              : 'repeating-linear-gradient(90deg,#007800 0px,#007800 3px,#001400 3px,#001400 4px)',
            transition: 'width 0.1s linear',
          }} />
        </div>
      </div>

      {/* 3 Transport Buttons: Prev | Play-Pause | Next */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 8px', marginBottom: 10 }}>
        <button
          className="win-outset-btn"
          onClick={handlePrev}
          disabled={!track}
          style={{ width: 60, height: 38, fontSize: 20, cursor: track ? 'pointer' : 'default' }}
          title="Previous"
        >⏮</button>

        <button
          className="win-outset-btn"
          onClick={handlePlayPause}
          disabled={!track}
          style={{ width: 72, height: 38, fontSize: 22, cursor: track ? 'pointer' : 'default' }}
          title={playing ? 'Pause' : 'Play'}
        >{playing ? '⏸' : '▶'}</button>

        <button
          className="win-outset-btn"
          onClick={handleNext}
          disabled={!track}
          style={{ width: 60, height: 38, fontSize: 20, cursor: track ? 'pointer' : 'default' }}
          title="Next"
        >⏭</button>
      </div>

      {/* Volume — react95 Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', marginBottom: 8, overflow: 'hidden', height: 50 }}>
        <span style={{ fontSize: 11, color: '#444', flexShrink: 0, width: 34 }}>VOL</span>
        <div style={{ flex: 1, position: 'relative', top: 8, paddingTop: 4 }}>
          <Slider
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(val) => setVolume(Number(val))}
            size="100%"
          />
        </div>
        <span style={{ fontSize: 11, color: '#444', width: 34, textAlign: 'right', flexShrink: 0 }}>
          {volume}%
        </span>
      </div>

      {/* Playlist */}
      <div style={{
        flex: 1,
        margin: '0 8px 8px',
        border: '2px solid',
        borderColor: '#808080 #dfdfdf #dfdfdf #808080',
        boxShadow: 'inset 1px 1px #000',
        background: '#ffffff',
        overflow: 'auto',
        minHeight: 0,
      }}>
        {playlist.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#888', fontSize: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
            <div>No MP3 files found.</div>
            <div style={{ marginTop: 6, fontSize: 11 }}>
              Add <strong>.mp3</strong> files to:<br />
              <code style={{ background: '#f0f0f0', padding: '2px 4px' }}>public/music/</code>
            </div>
          </div>
        ) : (
          playlist.map((t, idx) => {
            const isActive = idx === trackIdx;
            return (
              <div
                key={idx}
                onClick={() => setTrackIdx(idx)}
                onDoubleClick={() => {
                  setTrackIdx(idx);
                  setTimeout(() => audioRef.current?.play().catch(() => {}), 50);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  background: isActive ? '#000080' : 'transparent',
                  color: isActive ? '#ffffff' : '#000',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: 13,
                }}
              >
                <span style={{ fontSize: 11, opacity: 0.7, width: 18, flexShrink: 0 }}>
                  {isActive && playing ? '▶' : idx + 1}
                </span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.name}
                </span>
                <span style={{ fontSize: 10, opacity: 0.5, flexShrink: 0 }}>MP3</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
