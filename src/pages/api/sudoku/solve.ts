import type { NextApiRequest, NextApiResponse } from 'next';

import { sudokuSolver } from '@/controllers/sudoku/solverController';

type GameResult = {
  isCorrect: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameResult | ResponseData>
) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const body = req.body.sudokuBoard;
  const gameResult = sudokuSolver(body);

  res.status(200).json({
    isCorrect: gameResult,
  });
}
