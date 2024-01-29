import React, { useEffect } from 'react';

import Button from '@/components/sudoku/Button';
import SudokuTable from '@/components/sudoku/SudokuTable';

export default function Sudoku() {
  const [startedBoard, setStartedBoard] = React.useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [currentBoard, setCurrentBoard] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedCurrentBoard = localStorage.getItem('currentBoard');

      return savedCurrentBoard ? JSON.parse(savedCurrentBoard) : startedBoard;
    }
    return startedBoard;
  });

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentBoard', JSON.stringify(currentBoard));
    }
  }, [currentBoard]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStartedBoard = localStorage.getItem('startedBoard');
      if (!savedStartedBoard) {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiURL}/sudoku/generate`)
          .then((response) => response.json())
          .then((data) => {
            setStartedBoard(data.startedBoard);
            localStorage.setItem('startedBoard', JSON.stringify(data.startedBoard));
            setCurrentBoard(data.startedBoard);
            localStorage.setItem('currentBoard', JSON.stringify(data.startedBoard));
            setLoading(false);
          })
          .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
          });
        return;
      }
      setStartedBoard(JSON.parse(savedStartedBoard));
      setLoading(false);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const inputValue = Number(e.target.value);

    const copiedCurrentBoard = JSON.parse(JSON.stringify(currentBoard));
    copiedCurrentBoard[row][col] = inputValue <= 9 && inputValue > 0 ? inputValue : 0;
    setCurrentBoard(copiedCurrentBoard);
  };

  const checkResult = () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiURL}/sudoku/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sudokuBoard: currentBoard }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isCorrect) {
          alert('Correct!');
        } else {
          alert('Incorrect!');
        }
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  };

  const resetBoard = () => {
    setCurrentBoard(startedBoard);
  };

  const restartBoard = () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiURL}/sudoku/generate`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('startedBoard', JSON.stringify(data.startedBoard));
        localStorage.setItem('currentBoard', JSON.stringify(data.startedBoard));
        setStartedBoard(data.startedBoard);
        setCurrentBoard(data.startedBoard);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SudokuTable
        currentBoard={currentBoard}
        startedBoard={startedBoard}
        onInputChange={onInputChange}
      />
      <div style={{ marginTop: '40px' }}>
        <Button color="teal" onClick={checkResult}>
          Check
        </Button>
        <Button color="sandybrown" onClick={resetBoard}>
          Reset
        </Button>
        <Button color="tomato" onClick={restartBoard}>
          Restart
        </Button>
      </div>
    </>
  );
}
