import React, { useEffect, useRef, useState } from 'react';
import './Tetris.css';

const Tetris = () => {
  const canvasRef = useRef(null);
  const grid = 32;
  const X = 10;
  const Y = 20;

  const tetrominos = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  };

  const colors = {
    I: 'cyan',
    J: 'blue',
    L: 'orange',
    O: 'yellow',
    S: 'green',
    Z: 'red',
    T: 'purple',
  };

  const [playfield, setPlayfield] = useState(
    Array.from({ length: Y }, () => Array(X).fill(null))
  );

  const [tetromino, setTetromino] = useState({
    name: 'T',
    matrix: tetrominos.T,
    row: -2,
    col: Math.floor(X / 2) - 1,
  });

  const [gameOver, setGameOver] = useState(false);
  const [rAF, setRAF] = useState(null);

  const rotate = (matrix) => {
    return matrix.map((row, i) =>
      row.map((_, j) => matrix[matrix.length - 1 - j][i])
    );
  };

  const isValidMove = (matrix, row, col) => {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (
          matrix[r][c] &&
          (row + r < 0 ||
            row + r >= Y ||
            col + c < 0 ||
            col + c >= X ||
            playfield[row + r][col + c])
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const placeTetromino = () => {
    const newPlayfield = [...playfield];
    tetromino.matrix.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
          if (tetromino.row + r < 0) {
            setGameOver(true);
            cancelAnimationFrame(rAF);
          }
          newPlayfield[tetromino.row + r][tetromino.col + c] = tetromino.name;
        }
      });
    });

    clearRows(newPlayfield);
    setTetromino({
      name: 'I',
      matrix: tetrominos.I,
      row: -2,
      col: Math.floor(X / 2) - 1,
    });
  };

  const clearRows = (newPlayfield) => {
    for (let r = Y - 1; r >= 0; r--) {
      if (newPlayfield[r].every((cell) => cell !== null)) {
        for (let row = r; row > 0; row--) {
          newPlayfield[row] = [...newPlayfield[row - 1]];
        }
        newPlayfield[0] = Array(X).fill(null);
        r++;
      }
    }
    setPlayfield(newPlayfield);
  };

  const moveTetromino = (dir) => {
    const col = tetromino.col + dir;
    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      setTetromino({ ...tetromino, col });
    }
  };

  const dropTetromino = () => {
    const row = tetromino.row + 1;
    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      placeTetromino();
      return;
    }
    setTetromino({ ...tetromino, row });
  };

  const rotateTetromino = () => {
    const rotatedMatrix = rotate(tetromino.matrix);
    if (isValidMove(rotatedMatrix, tetromino.row, tetromino.col)) {
      setTetromino({ ...tetromino, matrix: rotatedMatrix });
    }
  };

  const loop = () => {
    if (!gameOver) {
      dropTetromino();
      setRAF(requestAnimationFrame(loop));
    }
  };

  const startGame = () => {
    setGameOver(false);
    setPlayfield(Array.from({ length: Y }, () => Array(X).fill(null)));
    setRAF(requestAnimationFrame(loop));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') moveTetromino(-1);
      if (e.key === 'ArrowRight') moveTetromino(1);
      if (e.key === 'ArrowDown') dropTetromino();
      if (e.key === 'ArrowUp') rotateTetromino();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tetromino, playfield, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    playfield.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          context.fillStyle = colors[cell];
          context.fillRect(c * grid, r * grid, grid - 1, grid - 1);
        }
      });
    });

    tetromino.matrix.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
          context.fillStyle = colors[tetromino.name];
          context.fillRect(
            (tetromino.col + c) * grid,
            (tetromino.row + r) * grid,
            grid - 1,
            grid - 1
          );
        }
      });
    });
  });

  return (
    <div className="tetris-container">
      <canvas
        ref={canvasRef}
        width={X * grid}
        height={Y * grid}
        style={{ border: '2px solid black' }}
      ></canvas>
      {gameOver && <div className="game-over">Game Over</div>}
      <button class="tetris-button" onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Tetris;
