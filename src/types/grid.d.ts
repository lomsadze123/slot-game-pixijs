interface ReelGrid extends Position {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  isSpinning: boolean;
  reelPositions: number[][];
  spinDelay?: number;
  winningPositions: [number, number][];
}

interface ReelSymbolContainer extends Dimension {
  symbolCount: number;
  isSpinning: Boolean;
  symbols: number[];
  reelIndex: number;
  targetPositions?: number[];
  winningPositions: [number, number][];
  anyWinningSymbolsInGame: boolean;
}

interface SymbolContainer extends Dimension {
  symbolType: number;
  isWinning: boolean;
}
