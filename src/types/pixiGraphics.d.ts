interface Star extends Position {
  size: number;
  alpha: number;
  speed: number;
  angle: number;
}

interface SpinButtonProps extends Position {
  handleSpin: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
}

interface BetControlsProps extends Position {
  betAmount: number;
  onChangeBet: (amount: number) => void;
  disabled: boolean;
}

interface BalanceDisplayProps extends Position {
  balance: number;
  lastWin: number;
  isSpinning: boolean;
}

interface SlotMachineProps extends Dimension {
  onStateUpdate?: (state: SlotMachineState) => void;
}
