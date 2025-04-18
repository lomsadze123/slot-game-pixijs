interface ReelGrid extends Position {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  isSpinning: boolean;
  reelPositions: number[][];
}

interface ReelSymbolContainer extends Dimension {
  symbolCount: number;
  isSpinning: Boolean;
  symbols: number[];
}

interface SymbolContainer extends Dimension {
  symbolType: number;
}
