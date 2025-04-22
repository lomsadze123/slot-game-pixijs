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

interface ReelSymbol {
  reelIndex: number;
  symbolCount: number;
  targetPositions?: number[];
}

type ReelSymbolsAndDimensions = ReelSymbol & Dimension;

interface ReelSymbolContainer extends ReelSymbolsAndDimensions {
  isSpinning: Boolean;
  symbols: number[];
  winningPositions: [number, number][];
  anyWinningSymbolsInGame: boolean;
}

interface SymbolContainer extends Dimension {
  symbolType: number;
  isWinning: boolean;
}

interface ReelSymbolHookProps extends ReelSymbol {
  symbolHeight: number;
  startDelayPerReel: number;
  symbols: number[];
}

interface SpinningRef {
  spinningRef: React.RefObject<boolean>;
  stoppingRef: React.RefObject<boolean>;
}

interface AnimationFrameRef extends SpinningRef {
  isSpinning: Boolean;
  reelIndex: number;
  stopDelayPerReel: number;
  startSpinning: () => void;
  stopSpinning: () => void;
}

interface SpinOneSymbolParams extends SpinningRef {
  totalSpins: React.RefObject<number>;
  baseDuration: number;
  symbolHeight: number;
  activeSymbolsRef: React.RefObject<number[]>;
  setOffset: (offset: number) => void;
  calculateRemainingSpins: () => number;
  finalPositionsRef: React.RefObject<number[] | null>;
  performFinalStop: () => void;
}
