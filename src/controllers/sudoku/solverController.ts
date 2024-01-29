const isValidSudokuBoard = (sudokuBoard: number[][]) => {
  if (sudokuBoard.length !== 9) return false;
  for (const row of sudokuBoard) {
    if (row.length !== 9) return false;
  }
  return true;
};

const checkRowCorrect = (sudokuBoard: number[][], rowIndex: number) => {
  const row = sudokuBoard[rowIndex];
  const rowSet = new Set(row);
  return rowSet.size === row.length;
};

const checkColCorrect = (sudokuBoard: number[][], colIndex: number) => {
  const col = sudokuBoard.map((row) => row[colIndex]);
  const colSet = new Set(col);
  return colSet.size === col.length;
};

const checkBoxCorrect = (sudokuBoard: number[][], rowBoxIndex: number, colBoxIndex: number) => {
  const boxStartRow = rowBoxIndex * 3;
  const boxEndRow = boxStartRow + 2;
  const boxStartCol = colBoxIndex * 3;
  const boxEndCol = boxStartCol + 2;
  const values = [];
  for (let row = boxStartRow; row <= boxEndRow; row++) {
    for (let col = boxStartCol; col <= boxEndCol; col++) {
      values.push(sudokuBoard[row][col]);
    }
  }
  const valuesSet = new Set(values);
  if (valuesSet.size !== values.length) {
    return false;
  }
  return true;
};

// TODO: should add unit tests
export const sudokuSolver = (sudokuBoard: number[][]) => {
  if (!isValidSudokuBoard(sudokuBoard)) {
    return false;
  }

  for (let index = 0; index < sudokuBoard.length; index++) {
    if (sudokuBoard[index].includes(0)) {
      return false;
    }

    if (!checkRowCorrect(sudokuBoard, index) || !checkColCorrect(sudokuBoard, index)) {
      return false;
    }
  }

  for (const rowBoxIndex of [0, 1, 2]) {
    for (const colBoxIndex of [0, 1, 2]) {
      if (!checkBoxCorrect(sudokuBoard, rowBoxIndex, colBoxIndex)) {
        return false;
      }
    }
  }

  return true;
};
