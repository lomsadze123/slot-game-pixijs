interface SlotMachineRef {
  spin: () => Promise<{ win: number }>;
  getState: () => any;
  setBet: (amount: number) => void;
}
