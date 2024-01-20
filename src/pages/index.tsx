import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

import React from 'react';

const initialData = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, 6, -1, -1, -1, 8],
  [-1, -1, -1, -1, -1, -1, 4, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, 3, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 7],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 4, -1, -1, -1, -1, 8, -1, -1],
  [-1, -1, 1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, 7, -1, -1, -1, -1, -1],
];

function SudokuTable() {
  const [sudokuArr, setSudokuArr] = React.useState(initialData);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = Number(e.target.value);

    const newSudokuArr = [...sudokuArr];
    newSudokuArr[row][col] = value < 9 && value > 0 ? value : -1;
    setSudokuArr(newSudokuArr);
  };

  return (
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
                      sudokuArr[rowIndex][colIndex] === -1 ? '' : sudokuArr[rowIndex][colIndex]
                    }
                    onChange={(e) => onInputChange(e, row, col)}
                    disabled={initialData[rowIndex][colIndex] !== -1}
                  ></input>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ButtonGroup() {
  return (
    <div style={{ marginTop: '40px' }}>
      <button className={`${styles.checkButton}`}>Check</button>
      <button className={`${styles.solveButton}`}>Solve</button>
      <button className={`${styles.resetButton}`}>Reset</button>
    </div>
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
        <SudokuTable></SudokuTable>
        <ButtonGroup></ButtonGroup>
      </main>
    </>
  );
}
