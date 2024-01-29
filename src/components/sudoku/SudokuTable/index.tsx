import React from 'react';

import styles from './SudokuTable.module.css';

interface TableProps {
  currentBoard: number[][];
  startedBoard: number[][];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => void;
}

const SudokuTable: React.FC<TableProps> = ({ currentBoard, startedBoard, onInputChange }) => {
  return (
    <table className={`${styles.sudokuTable}`}>
      {currentBoard.map((row, rowIndex) => (
        <tr key={rowIndex} className={`${rowIndex % 3 === 2 ? styles.bottomBoarder : ''}`}>
          {row.map((value, colIndex) => (
            <td
              key={rowIndex * currentBoard.length + colIndex}
              className={`${styles.cell} ${colIndex % 3 === 2 ? styles.rightBoarder : ''}`}
            >
              <input
                className={`${styles.cellInput}`}
                type="number"
                onChange={(e) => onInputChange(e, rowIndex, colIndex)}
                value={value === 0 ? '' : value}
                disabled={startedBoard[rowIndex][colIndex] !== 0}
              />
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export default SudokuTable;
