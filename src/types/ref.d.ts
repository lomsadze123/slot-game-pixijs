interface SlotMachineRef {
  spin: () => Promise<{ win: number }>;
  getState: () => any;
}
