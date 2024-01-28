import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import React, { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// TODO: restructure the code
function SudokuTable() {
  const [initialData, setInitialData] = React.useState([
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

  const [sudokuArr, setSudokuArr] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('sudokuArr');

      return savedData ? JSON.parse(savedData) : initialData;
    }
    return initialData;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sudokuArr', JSON.stringify(sudokuArr));
    }
  }, [sudokuArr]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedInitialData = localStorage.getItem('initialData');
      if (!savedInitialData) {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiURL}/sudoku/generate`)
          .then((response) => response.json())
          .then((data) => {
            setInitialData(data.startedBoard);
            localStorage.setItem('initialData', JSON.stringify(data.startedBoard));
            setSudokuArr(data.startedBoard);
            localStorage.setItem('sudokuArr', JSON.stringify(data.startedBoard));
          })
          .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
          });
        return;
      }
      setInitialData(JSON.parse(savedInitialData));
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = Number(e.target.value);

    const newSudokuArr = sudokuArr.map((arr: number[]) => [...arr]);
    newSudokuArr[row][col] = value <= 9 && value > 0 ? value : 0;
    setSudokuArr(newSudokuArr);
  };

  const checkResult = () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const sudokuArr = localStorage.getItem('sudokuArr');
    fetch(`${apiURL}/sudoku/solve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sudokuBoard: JSON.parse(sudokuArr ? sudokuArr : '') }),
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

  const recreateBoard = () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiURL}/sudoku/generate`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('initialData', JSON.stringify(data.startedBoard));
        localStorage.setItem('sudokuArr', JSON.stringify(data.startedBoard));
        setInitialData(data.startedBoard);
        setSudokuArr(data.startedBoard);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  };

  const reset = () => {
    setSudokuArr(initialData);
  };

  return (
    <>
      <table className={`${styles.sudokuTable}`}>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rowIndex) => {
            return (
              <tr key={rowIndex} className={`${rowIndex % 3 === 2 ? styles.bottomBoarder : ''}`}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, colIndex) => (
                  <td
                    key={colIndex + rowIndex}
                    className={`${styles.cell} ${colIndex % 3 === 2 ? styles.rightBoarder : ''}`}
                  >
                    <input
                      className={`${styles.cellInput}`}
                      type="number"
                      value={
                        sudokuArr[rowIndex][colIndex] === 0 ? '' : sudokuArr[rowIndex][colIndex]
                      }
                      onChange={(e) => onInputChange(e, row, col)}
                      disabled={initialData[rowIndex][colIndex] !== 0}
                    ></input>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '40px' }}>
        <button onClick={checkResult} className={`${styles.checkButton}`}>
          Check
        </button>
        <button onClick={reset} className={`${styles.resetButton}`}>
          Reset
        </button>
        <button onClick={recreateBoard} className={`${styles.restartButton}`}>
          Restart
        </button>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1 style={{ marginBottom: '40px' }}>SUDOKU</h1>
        <SudokuTable />
      </main>
    </>
  );
}
