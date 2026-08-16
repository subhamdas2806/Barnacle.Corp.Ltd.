import React, { useState } from 'react';

export default function OregonTrail() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, WON, LOST
  const [milesLeft, setMilesLeft] = useState(2000);
  const [food, setFood] = useState(500);
  const [health, setHealth] = useState(100);
  const [log, setLog] = useState(['Welcome to The Oregon Trail (Win95 Retro Edition)!', 'Press "Begin Journey" to set out from Independence, Missouri.']);

  const addLog = (msg) => {
    setLog((prev) => [msg, ...prev.slice(0, 8)]);
  };

  const handleStart = () => {
    setGameState('PLAYING');
    setMilesLeft(2000);
    setFood(500);
    setHealth(100);
    setLog(['You set out on the Oregon Trail!', '2000 miles to Willamette Valley.']);
  };

  const handleTravel = () => {
    if (food <= 0) {
      addLog('❌ You have no food left! Your party is starving.');
      setHealth((h) => {
        const nh = h - 25;
        if (nh <= 0) setGameState('LOST');
        return Math.max(0, nh);
      });
      return;
    }

    const milesTraveled = Math.floor(Math.random() * 40) + 30;
    const foodConsumed = Math.floor(Math.random() * 25) + 20;

    const newMiles = Math.max(0, milesLeft - milesTraveled);
    const newFood = Math.max(0, food - foodConsumed);

    setMilesLeft(newMiles);
    setFood(newFood);

    addLog(`🚩 Traveled ${milesTraveled} miles. Consumed ${foodConsumed} lbs of food.`);

    // Random trail event
    const rand = Math.random();
    if (rand < 0.25) {
      addLog('🌊 You reached a river crossing! Safely ferried across.');
    } else if (rand < 0.4) {
      addLog('🌧️ Heavy rains slow down your wagon.');
    } else if (rand < 0.5) {
      addLog('🐍 A rattlesnake bit your oxen! Lost some time.');
      setHealth((h) => Math.max(0, h - 10));
    }

    if (newMiles === 0) {
      setGameState('WON');
      addLog('🎉 CONGRATULATIONS! You have successfully reached Oregon Valley!');
    }
  };

  const handleHunt = () => {
    const foodGained = Math.floor(Math.random() * 80) + 40;
    setFood((f) => f + foodGained);
    addLog(`🎯 You went hunting and secured ${foodGained} lbs of bison meat!`);
  };

  const handleRest = () => {
    setHealth((h) => Math.min(100, h + 20));
    setFood((f) => Math.max(0, f - 15));
    addLog('⛺ You rested for 3 days. Health improved!');
  };

  return (
    <div style={{ background: '#000', color: '#52d052', fontFamily: 'var(--font-code)', height: '100%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 20, textAlign: 'center', marginBottom: 12, borderBottom: '1px solid #52d052', paddingBottom: 4 }}>
          THE OREGON TRAIL
        </h2>

        {gameState === 'START' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ marginBottom: 16 }}>Embark on the epic 2,000-mile journey across America.</p>
            <button className="win-outset-btn" style={{ padding: '8px 24px', fontWeight: 'bold' }} onClick={handleStart}>
              Begin Journey
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="win-inset" style={{ background: '#111', color: '#fff', padding: 10 }}>
              <div>MILES LEFT: <strong>{milesLeft} mi</strong></div>
              <div>FOOD: <strong>{food} lbs</strong></div>
              <div>HEALTH: <strong>{health}%</strong></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="win-outset-btn" style={{ padding: 6 }} onClick={handleTravel}>
                1. Continue on Trail
              </button>
              <button className="win-outset-btn" style={{ padding: 6 }} onClick={handleHunt}>
                2. Hunt for Supply
              </button>
              <button className="win-outset-btn" style={{ padding: 6 }} onClick={handleRest}>
                3. Rest & Recover
              </button>
            </div>
          </div>
        )}

        {(gameState === 'WON' || gameState === 'LOST') && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <h3 style={{ fontSize: 22, color: gameState === 'WON' ? '#52d052' : '#ff4b4b', marginBottom: 12 }}>
              {gameState === 'WON' ? '🎉 YOU REACHED OREGON!' : '💀 YOUR PARTY DIED ON THE TRAIL'}
            </h3>
            <button className="win-outset-btn" style={{ padding: '6px 20px' }} onClick={handleStart}>
              Try Again
            </button>
          </div>
        )}

        {/* Trail Log Display */}
        <div className="win-inset" style={{ background: '#000', color: '#52d052', padding: 10, height: 140, overflowY: 'auto', fontSize: 12 }}>
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>
        The Oregon Trail — ScumOS Win95 Edition
      </div>
    </div>
  );
}
