const BLANK_SUDOKU_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const shuffle = (array: number[]): number[] => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const rowSafe = (sudokuBoard: number[][], emptyCell: Cell, num: number): boolean => {
  return sudokuBoard[emptyCell.rowIndex].indexOf(num) === -1;
};
const colSafe = (sudokuBoard: number[][], emptyCell: Cell, num: number): boolean => {
  return !sudokuBoard.some((row) => row[emptyCell.colIndex] == num);
};

const boxSafe = (sudokuBoard: number[][], emptyCell: Cell, num: number): boolean => {
  const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
  const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
  let safe = true;

  for (const boxRow of [0, 1, 2]) {
    for (const boxCol of [0, 1, 2]) {
      if (sudokuBoard[boxStartRow + boxRow][boxStartCol + boxCol] == num) {
        safe = false;
      }
    }
  }
  return safe;
};

const safeToPlace = (sudokuBoard: number[][], emptyCell: Cell, num: number): boolean => {
  return (
    rowSafe(sudokuBoard, emptyCell, num) &&
    colSafe(sudokuBoard, emptyCell, num) &&
    boxSafe(sudokuBoard, emptyCell, num)
  );
};

const nextEmptyCell = (sudokuBoard: number[][]) => {
  let emptyCell: Cell = { rowIndex: -1, colIndex: -1 };

  for (let rowIndex = 0; rowIndex < sudokuBoard.length; rowIndex++) {
    const row = sudokuBoard[rowIndex];
    if (emptyCell.colIndex !== -1) break;
    let firstZero = row.find((col) => col === 0);
    if (firstZero === undefined) continue;
    emptyCell.rowIndex = rowIndex;
    emptyCell.colIndex = row.indexOf(firstZero);
  }

  if (emptyCell.colIndex !== -1) return emptyCell;
  return false;
};

const fillValuesInSudokuBoard = (
  sudokuBoard: number[][],
  counter: number = 0
): number[][] | false => {
  const emptyCell: Cell | false = nextEmptyCell(sudokuBoard);
  if (!emptyCell) return sudokuBoard;

  for (const num of shuffle(numArray)) {
    // For preventing infinite recursion
    counter++;
    if (counter > 10000000) throw new Error('Infinite recursion');

    if (safeToPlace(sudokuBoard, emptyCell, num)) {
      const copiedSudokuBoard = JSON.parse(JSON.stringify(sudokuBoard));
      copiedSudokuBoard[emptyCell.rowIndex][emptyCell.colIndex] = num;

      const result = fillValuesInSudokuBoard(copiedSudokuBoard, counter);
      if (result) return result;

      copiedSudokuBoard[emptyCell.rowIndex][emptyCell.colIndex] = 0;
    }
  }
  return false;
};

const pokeHoles = (sudokuBoard: number[][], holes: number): number[][] => {
  let removedValues = 0;
  const copiedSudokuBoard = JSON.parse(JSON.stringify(sudokuBoard));

  while (removedValues < holes) {
    const val = Math.floor(Math.random() * 81);
    const randomRowIndex = Math.floor(val / 9);
    const randomColIndex = val % 9;

    if (copiedSudokuBoard[randomRowIndex][randomColIndex] === 0) continue;
    removedValues++;
    copiedSudokuBoard[randomRowIndex][randomColIndex] = 0;
  }

  return copiedSudokuBoard;
};

export const createStartedBoard = (holes: number): number[][] | false => {
  try {
    const solvedSudokuBoard = fillValuesInSudokuBoard(BLANK_SUDOKU_BOARD);

    if (solvedSudokuBoard) {
      return pokeHoles(solvedSudokuBoard, holes);
    }
    return false;
  } catch (error) {
    return createStartedBoard(holes);
  }
};
