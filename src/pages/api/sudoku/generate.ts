import type { NextApiRequest, NextApiResponse } from 'next';

import { newStartingBoard } from '@/controllers/sudoku/generaterController';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SudokuBoard | ResponseData>
) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const numberOfHoles = Number(process.env.NEXT_PUBLIC_GENERATE_SUDOKU_HOLES);
  const startedBoard = newStartingBoard(numberOfHoles);
  res.status(200).json({
    startedBoard: startedBoard || [],
  });
}
