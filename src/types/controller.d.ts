type SlotMachineState = {
  isSpinning: boolean;
  reelPositions: number[][];
  balance: number;
  betAmount: number;
  lastWin: number;
  winningPositions: [number, number][];
};
