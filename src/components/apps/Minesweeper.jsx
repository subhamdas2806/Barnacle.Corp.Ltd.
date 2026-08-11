import React, { useState, useEffect } from 'react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export default function Minesweeper() {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING, WON, LOST
  const [minesLeft, setMinesLeft] = useState(MINES);
  const [timer, setTimer] = useState(0);

  const initBoard = () => {
    let newBoard = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        revealed: false,
        flagged: false,
        count: 0
      }))
    );

    // Place Mines
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighboring mine counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].count = count;
        }
      }
    }

    setBoard(newBoard);
    setGameState('PLAYING');
    setMinesLeft(MINES);
    setTimer(0);
  };

  useEffect(() => {
    initBoard();
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'PLAYING') {
      interval = setInterval(() => setTimer((t) => Math.min(999, t + 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const revealTile = (r, c) => {
    if (gameState !== 'PLAYING' || board[r][c].revealed || board[r][c].flagged) return;

    let newBoard = board.map((row) => row.map((tile) => ({ ...tile })));

    if (newBoard[r][c].isMine) {
      // Game Over
      newBoard.forEach((row) => row.forEach((t) => { if (t.isMine) t.revealed = true; }));
      setBoard(newBoard);
      setGameState('LOST');
      return;
    }

    const revealRecursive = (br, bc) => {
      if (br < 0 || br >= ROWS || bc < 0 || bc >= COLS || newBoard[br][bc].revealed || newBoard[br][bc].flagged) return;
      newBoard[br][bc].revealed = true;
      if (newBoard[br][bc].count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            revealRecursive(br + dr, bc + dc);
          }
        }
      }
    };

    revealRecursive(r, c);

    // Check Win
    let unrevealedNonMines = 0;
    for (let row of newBoard) {
      for (let tile of row) {
        if (!tile.isMine && !tile.revealed) unrevealedNonMines++;
      }
    }

    setBoard(newBoard);

    if (unrevealedNonMines === 0) {
      setGameState('WON');
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameState !== 'PLAYING' || board[r][c].revealed) return;

    let newBoard = board.map((row) => row.map((tile) => ({ ...tile })));
    const currentFlag = newBoard[r][c].flagged;
    newBoard[r][c].flagged = !currentFlag;

    setBoard(newBoard);
    setMinesLeft((m) => currentFlag ? m + 1 : m - 1);
  };

  return (
    <div style={{ background: 'var(--win-gray)', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <div className="win-outset" style={{ padding: 8, display: 'inline-block' }}>
        {/* Header Display */}
        <div className="win-inset-gray" style={{ padding: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="win-inset" style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold', width: 48, textAlign: 'center' }}>
            {minesLeft.toString().padStart(3, '0')}
          </div>

          <button className="win-outset-btn" style={{ width: 28, height: 28, fontSize: 16 }} onClick={initBoard}>
            {gameState === 'PLAYING' ? '🙂' : gameState === 'WON' ? '😎' : '😵'}
          </button>

          <div className="win-inset" style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold', width: 48, textAlign: 'center' }}>
            {timer.toString().padStart(3, '0')}
          </div>
        </div>

        {/* Minesweeper Grid */}
        <div className="win-inset-gray" style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 22px)`, gap: 1, padding: 2 }}>
          {board.map((row, r) =>
            row.map((tile, c) => (
              <button
                key={`${r}-${c}`}
                className={tile.revealed ? 'win-inset-gray' : 'win-outset-btn'}
                style={{
                  width: 22,
                  height: 22,
                  padding: 0,
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: tile.count === 1 ? 'blue' : tile.count === 2 ? 'green' : tile.count === 3 ? 'red' : 'darkblue'
                }}
                onClick={() => revealTile(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
              >
                {tile.revealed
                  ? tile.isMine
                    ? '💣'
                    : tile.count > 0
                    ? tile.count
                    : ''
                  : tile.flagged
                  ? '🚩'
                  : ''}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
