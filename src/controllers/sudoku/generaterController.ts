const BLANK_BOARD = [
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

function shuffle(array: number[]) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const rowSafe = (puzzleArray: number[][], emptyCell: Cell, num: number) => {
  return puzzleArray[emptyCell.rowIndex].indexOf(num) === -1;
};
const colSafe = (puzzleArray: number[][], emptyCell: Cell, num: number) => {
  return !puzzleArray.some((row) => row[emptyCell.colIndex] == num);
};

const boxSafe = (puzzleArray: number[][], emptyCell: Cell, num: number) => {
  const boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3);
  const boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3);
  let safe = true;

  for (const boxRow of [0, 1, 2]) {
    for (const boxCol of [0, 1, 2]) {
      if (puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num) {
        safe = false;
      }
    }
  }
  return safe;
};

const safeToPlace = (puzzleArray: number[][], emptyCell: Cell, num: number) => {
  return (
    rowSafe(puzzleArray, emptyCell, num) &&
    colSafe(puzzleArray, emptyCell, num) &&
    boxSafe(puzzleArray, emptyCell, num)
  );
};

const nextEmptyCell = (puzzleArray: number[][]) => {
  let emptyCell: Cell = { rowIndex: -1, colIndex: -1 };

  puzzleArray.forEach((row, rowIndex) => {
    if (emptyCell.colIndex !== -1) return;
    let firstZero = row.find((col) => col === 0);
    if (firstZero === undefined) return;
    emptyCell.rowIndex = rowIndex;
    emptyCell.colIndex = row.indexOf(firstZero);
  });

  if (emptyCell.colIndex !== -1) return emptyCell;
  return false;
};

const fillPuzzle = (startingBoard: number[][], counter: number = 0): number[][] | false => {
  const emptyCell: Cell | false = nextEmptyCell(startingBoard);
  if (!emptyCell) return startingBoard;

  const boardCopy = JSON.parse(JSON.stringify(startingBoard));

  // Shuffled [0 - 9 ] array fills board randomly each pass
  for (const num of shuffle(numArray)) {
    // counter is a global variable tracking the number of iterations performed in generating a puzzle
    // Most puzzles generate in < 500ms, but occassionally random generation could run in to
    // heavy backtracking and result in a long wait. Best to abort this attempt and restart.
    // 20_000_000 iteration maximum is approximately 1.3 sec runtime.
    // See initializer function for more
    counter++;
    if (counter > 20000000) throw new Error('Recursion Timeout');

    if (safeToPlace(boardCopy, emptyCell, num)) {
      boardCopy[emptyCell.rowIndex][emptyCell.colIndex] = num; // If safe to place number, place it
      // Recursively call the fill function to place num in next empty cell
      const result = fillPuzzle(boardCopy, counter);
      if (result) return result;

      // If we were unable to place the future num, that num was wrong. Reset it and try next value
      boardCopy[emptyCell.rowIndex][emptyCell.colIndex] = 0;
    }
  }
  return false; // If unable to place any number, return false, which triggers previous round to go to next num
};

const pokeHoles = (startingBoard: number[][], holes: number) => {
  let removedValues = 0;
  const copiedBoard = JSON.parse(JSON.stringify(startingBoard));

  while (removedValues < holes) {
    const val = Math.floor(Math.random() * 81); // Value between 0-81
    const randomRowIndex = Math.floor(val / 9); // Integer 0-8 for row index
    const randomColIndex = val % 9;

    if (copiedBoard[randomRowIndex][randomColIndex] === 0) continue; // If cell already empty, restart loop

    removedValues++;
    copiedBoard[randomRowIndex][randomColIndex] = 0; // "poke a hole" in the board at the coords
  }
  return copiedBoard;
};

export const newStartingBoard = (holes: number): number[][] | false => {
  try {
    const solvedBoard = fillPuzzle(BLANK_BOARD);

    if (solvedBoard) {
      return pokeHoles(solvedBoard, holes);
    }
    return false;
  } catch (error) {
    return newStartingBoard(holes);
  }
};
