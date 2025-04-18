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

    // Create a promise that resolves when spinning is complete
    return new Promise((resolve) => {
      // Simulate spin delay (would be replaced by animations)
      setTimeout(() => {
        // Generate new random positions
        this.state.reelPositions = this.state.reelPositions.map((reel) =>
          reel.map(() => Math.floor(Math.random() * this.totalSymbols))
        );

        // Calculate wins
        const win = this.calculateWin();
        this.state.lastWin = win;
        this.state.balance += win;
        this.state.isSpinning = false;

        resolve({ win });
      }, 1000);
    });
  }

  private calculateWin(): number {
    // Simple win calculation - checking middle row for matching symbols
    const middleRow = this.state.reelPositions.map((reel) => reel[1]);

    // Count consecutive matching symbols from left
    let matchCount = 1;
    let matchSymbol = middleRow[0];

    for (let i = 1; i < middleRow.length; i++) {
      if (middleRow[i] === matchSymbol) {
        matchCount++;
      } else {
        break;
      }
    }

    // Award win based on match count (3+ matches win)
    if (matchCount >= 3) {
      // Different symbols have different values (higher number = higher value)
      const multiplier = (matchSymbol + 1) * matchCount;
      return this.state.betAmount * multiplier;
    }

    return 0;
  }

  setBet(amount: number): void {
    if (!this.state.isSpinning && amount > 0) {
      this.state.betAmount = amount;
    }
  }
}
