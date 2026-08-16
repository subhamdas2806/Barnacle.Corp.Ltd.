import React, { useState } from 'react';

const TARGET = 'PIXEL';

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

  const restartGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setStatus('PLAYING');
  };

  const keyboard = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','DEL']
  ];

  const getTileBg = (word, idx) => {
    const char = word[idx];
    if (TARGET[idx] === char) return '#8ed98c'; // Vintage retro green tile matching screenshot
    if (TARGET.includes(char)) return '#ffd700'; // Yellow match
    return '#c0c0c0'; // Gray miss
  };

  return (
    <div
      style={{
        background: '#ffffff',
        height: '100%',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'var(--font-system)',
        overflow: 'auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Game Over / Win View (Matching Screenshot 1) */}
      {status === 'WON' ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-system)', fontSize: 32, fontWeight: 'bold', color: '#000000', margin: 0 }}>
            You win!
          </h2>
          <p style={{ fontSize: 16, color: '#333333', margin: 0 }}>
            Thanks for playing! Remember: the word is always "PIXEL"
          </p>

          {/* Green Answer Tiles */}
          <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
            {['P', 'I', 'X', 'E', 'L'].map((letter, idx) => (
              <div
                key={idx}
                className="win-inset"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#8ed98c',
                  border: '1px solid #558b53',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: '#000000'
                }}
              >
                {letter}
              </div>
            ))}
          </div>

          <button
            className="win-outset-btn"
            onClick={restartGame}
            style={{ padding: '6px 20px', fontSize: 15, fontFamily: 'var(--font-system)' }}
          >
            Restart Game
          </button>
        </div>
      ) : (
        <>
          <h2 style={{ fontFamily: 'var(--font-retro-header)', fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            Wordle
          </h2>

          {/* Word Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {[0, 1, 2, 3, 4, 5].map((rowIdx) => {
              const word = guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : '');
              const isSubmitted = rowIdx < guesses.length;

              return (
                <div key={rowIdx} style={{ display: 'flex', gap: 6 }}>
                  {[0, 1, 2, 3, 4].map((colIdx) => {
                    const char = word[colIdx] || '';
                    const bg = isSubmitted ? getTileBg(word, colIdx) : '#ffffff';
                    const textColor = '#000000';

                    return (
                      <div
                        key={colIdx}
                        className="win-inset"
                        style={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          fontWeight: 'bold',
                          backgroundColor: bg,
                          color: textColor,
                          fontFamily: 'var(--font-system)'
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

          {status === 'LOST' && (
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', color: '#cc0000', marginBottom: 6 }}>
                Game Over! The word was SCUM
              </div>
              <button className="win-outset-btn" onClick={restartGame} style={{ padding: '4px 16px' }}>
                Restart Game
              </button>
            </div>
          )}

          {/* On-Screen Keyboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginTop: 8 }}>
            {keyboard.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', gap: 4 }}>
                {row.map((k) => (
                  <button
                    key={k}
                    className="win-outset-btn"
                    style={{
                      minWidth: k.length > 1 ? 48 : 30,
                      height: 32,
                      fontSize: 12,
                      fontFamily: 'var(--font-system)'
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
        </>
      )}
    </div>
  );
}
