export default class SlotMachineController {
  private state: SlotMachineState;
  private symbolsPerReel: number[];
  private totalSymbols = 8; // Total different symbol types

  constructor(columns: number, rows: number) {
    // Set up initial state
    this.symbolsPerReel = Array(columns).fill(20); // Each reel has 20 possible symbol positions

    // Initialize positions (each position represents which symbol is shown)
    const reelPositions = Array(columns)
      .fill(0)
      .map(() =>
        Array(rows)
          .fill(0)
          .map(() => Math.floor(Math.random() * this.totalSymbols))
      );

    this.state = {
      isSpinning: false,
      reelPositions,
      balance: 1000,
      betAmount: 20,
      lastWin: 0,
      winningPositions: [],
    };
  }

  getState(): SlotMachineState {
    return { ...this.state };
  }

  spin(): Promise<{ win: number }> {
    if (this.state.isSpinning || this.state.balance < this.state.betAmount) {
      return Promise.reject("Cannot spin now");
    }

    // Deduct bet amount
    this.state.balance -= this.state.betAmount;
    this.state.isSpinning = true;

    // Reset winning positions
    this.state.winningPositions = [];

    // Create a promise that resolves when spinning is complete
    return new Promise((resolve) => {
      // Generate new random positions immediately but don't update UI yet
      const newPositions = this.state.reelPositions.map((reel) =>
        reel.map(() => Math.floor(Math.random() * this.totalSymbols))
      );

      // Store the new positions to be used after animation completes
      this.state.reelPositions = newPositions;

      // Start animation - when complete, resolve the promise
      setTimeout(() => {
        const { win, winningPositions } = this.calculateWin();
        this.state.lastWin = win;
        this.state.balance += win;
        this.state.isSpinning = false;
        this.state.winningPositions = winningPositions;

        resolve({ win });
      }, 1000);
    });
  }

  private calculateWin(): {
    win: number;
    winningPositions: [number, number][];
  } {
    // Simple win calculation - checking middle row for matching symbols
    const middleRow = this.state.reelPositions.map((reel) => reel[1]);
    const winningPositions: [number, number][] = [];

    // Count consecutive matching symbols from left
    let matchCount = 1;
    let matchSymbol = middleRow[0];

    // Add first position
    winningPositions.push([0, 1]); // [reelIndex, rowIndex]

    for (let i = 1; i < middleRow.length; i++) {
      if (middleRow[i] === matchSymbol) {
        matchCount++;
        winningPositions.push([i, 1]); // Add position to winning positions
      } else {
        break;
      }
    }

    // Award win based on match count (3+ matches win)
    if (matchCount >= 3) {
      // Different symbols have different values (higher number = higher value)
      const multiplier = (matchSymbol + 1) * matchCount;
      return {
        win: this.state.betAmount * multiplier,
        winningPositions,
      };
    }

    // No win
    return {
      win: 0,
      winningPositions: [],
    };
  }

  setBet(amount: number): void {
    if (!this.state.isSpinning && amount > 0) {
      this.state.betAmount = amount;
    }
  }
}
