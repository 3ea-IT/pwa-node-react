import React, { useState } from 'react';
import './TicTacToe.css';

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const checkWin = (board) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const checkDraw = (board) => {
    return board.every((cell) => cell !== null);
  };

  const handleClick = (index) => {
    if (board[index] || isGameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const winner = checkWin(newBoard);

    if (winner) {
      setIsGameOver(true);
      setTimeout(() => alert(`${winner} wins!`), 100);
      return;
    }

    if (checkDraw(newBoard)) {
      setIsGameOver(true);
      setTimeout(() => alert(`It's a draw!`), 100);
      return;
    }

    setIsXNext(!isXNext);

    if (!isXNext) {
      setTimeout(playAI, 500); // Trigger AI move
    }
  };

  const getBestMove = (board) => {
    const cellRank = [3, 2, 3, 2, 4, 2, 3, 2, 3];

    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) {
        cellRank[i] -= 99;
      }
    }

    for (let combo of winningCombos) {
      const [a, b, c] = combo;

      if (board[a] === board[b] && board[a] !== null && board[c] === null) {
        cellRank[c] += 10;
      }
      if (board[a] === board[c] && board[a] !== null && board[b] === null) {
        cellRank[b] += 10;
      }
      if (board[b] === board[c] && board[b] !== null && board[a] === null) {
        cellRank[a] += 10;
      }
    }

    let bestCell = -1;
    let highest = -999;

    for (let i = 0; i < board.length; i++) {
      if (cellRank[i] > highest && board[i] === null) {
        highest = cellRank[i];
        bestCell = i;
      }
    }

    return bestCell;
  };

  const playAI = () => {
    if (isGameOver) return;

    const newBoard = [...board];
    const move = getBestMove(newBoard);
    if (move === -1) return;

    newBoard[move] = 'O';
    setBoard(newBoard);

    const winner = checkWin(newBoard);
    if (winner) {
      setIsGameOver(true);
      setTimeout(() => alert(`${winner} wins!`), 100);
      return;
    }

    if (checkDraw(newBoard)) {
      setIsGameOver(true);
      setTimeout(() => alert(`It's a draw!`), 100);
    } else {
      setIsXNext(true); // Switch back to X
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsGameOver(false);
  };

  return (
    <div className="wrapper-tictactoe">
      <h1 className="tic">Tic Tac Toe</h1>
      <div className="board-tic">
        {board.map((cell, index) => (
          <div
            key={index}
            className="square-tic"
            onClick={() => {
              if (isXNext && !isGameOver) handleClick(index);
            }}
          >
            {cell}
          </div>
        ))}
      </div>
      <button className="reset-tic" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
