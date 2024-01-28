const checkRowCorrect = (puzzleArray: number[][], rowIndex: number) => {
  const row = puzzleArray[rowIndex];
  const rowSet = new Set(row);
  return rowSet.size === row.length;
};

const checkColCorrect = (puzzleArray: number[][], colIndex: number) => {
  const col = puzzleArray.map((row) => row[colIndex]);
  const colSet = new Set(col);
  return colSet.size === col.length;
};

const checkBoxCorrect = (puzzleArray: number[][], rowIndex: number, colIndex: number) => {
  const boxStartRow = rowIndex * 3;
  const boxEndRow = boxStartRow + 2;
  const boxStartCol = colIndex * 3;
  const boxEndCol = boxStartCol + 2;
  const values = [];
  for (let row = boxStartRow; row <= boxEndRow; row++) {
    for (let col = boxStartCol; col <= boxEndCol; col++) {
      values.push(puzzleArray[row][col]);
    }
  }
  const valuesSet = new Set(values);
  if (valuesSet.size !== values.length) {
    return false;
  }
  return true;
};

export const sudokuSolver = (sudokuBoard: number[][]) => {
  for (let index = 0; index < sudokuBoard.length; index++) {
    if (sudokuBoard[index].includes(0)) {
      return false;
    }

    if (!checkRowCorrect(sudokuBoard, index) || !checkColCorrect(sudokuBoard, index)) {
      return false;
    }
  }

  for (const rowIndex of [0, 1, 2]) {
    for (const colIndex of [0, 1, 2]) {
      if (!checkBoxCorrect(sudokuBoard, rowIndex, colIndex)) {
        return false;
      }
    }
  }

  return true;
};
