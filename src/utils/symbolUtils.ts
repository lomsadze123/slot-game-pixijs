const generateRandomSymbols = (count: number) => {
  return Array.from({ length: count * 3 }, () => Math.floor(Math.random() * 7));
};

export const generateInitialReelSymbols = (columns: number, rows: number) => {
  return Array(columns)
    .fill(null)
    .map(() => generateRandomSymbols(rows + 2));
};

export const getReelWinningPositions = (
  columnIndex: number,
  winningPositions: [number, number][]
) => {
  return winningPositions.filter(([colIndex]) => colIndex === columnIndex);
};
