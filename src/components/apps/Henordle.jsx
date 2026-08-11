import React, { useState } from 'react';

const WORDS = ['DELTA', 'RUSTC', 'NEAT', 'BUILD', 'EMU80', 'GAMES', 'STACK', 'PATCH', 'DEBUGS', 'MODEL'];
const TARGET = 'DELTA';

export default function Henordle() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [status, setStatus] = useState('PLAYING');

  const handleKeyPress = (char) => {
    if (status !== 'PLAYING') return;
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => (prev + char).toUpperCase());
    }
  };

  const handleDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleEnter = () => {
    if (currentGuess.length !== 5) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    if (currentGuess === TARGET) {
      setStatus('WON');
    } else if (newGuesses.length >= 6) {
      setStatus('LOST');
    }
    setCurrentGuess('');
  };

  const keyboard = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','DEL']
  ];

  const getTileBg = (word, idx) => {
    const char = word[idx];
    if (TARGET[idx] === char) return '#52d052'; // Green match
    if (TARGET.includes(char)) return '#ffd700'; // Yellow match
    return '#808080'; // Gray miss
  };

  return (
    <div style={{ background: 'var(--win-gray)', height: '100%', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
        HENORDLE v1.0
      </h2>

      {/* Word Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {[0, 1, 2, 3, 4, 5].map((rowIdx) => {
          const word = guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : '');
          const isSubmitted = rowIdx < guesses.length;

          return (
            <div key={rowIdx} style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3, 4].map((colIdx) => {
                const char = word[colIdx] || '';
                const bg = isSubmitted ? getTileBg(word, colIdx) : '#ffffff';
                const textColor = isSubmitted ? '#ffffff' : '#000000';

                return (
                  <div
                    key={colIdx}
                    className="win-inset"
                    style={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      backgroundColor: bg,
                      color: textColor
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Game Over Message */}
      {status === 'WON' && <div style={{ fontWeight: 'bold', color: '#008000', marginBottom: 8 }}>🎉 EXCELLENT! YOU GUESSED DELTA!</div>}
      {status === 'LOST' && <div style={{ fontWeight: 'bold', color: '#cc0000', marginBottom: 8 }}>💀 GAME OVER! THE WORD WAS DELTA</div>}

      {/* On-Screen Keyboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {keyboard.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: 4 }}>
            {row.map((k) => (
              <button
                key={k}
                className="win-outset-btn"
                style={{
                  minWidth: k.length > 1 ? 46 : 28,
                  height: 32,
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
                onClick={() => {
                  if (k === 'ENTER') handleEnter();
                  else if (k === 'DEL') handleDelete();
                  else handleKeyPress(k);
                }}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
