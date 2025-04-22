import { useState, useEffect } from "react";

export const useBalanceAnimation = (actualBalance: number) => {
  const [displayBalance, setDisplayBalance] = useState(actualBalance);

  useEffect(() => {
    // Animate balance changes
    if (displayBalance !== actualBalance) {
      const diff = actualBalance - displayBalance;
      const step = Math.max(1, Math.abs(diff) / 20);
      const timer = setTimeout(() => {
        if (Math.abs(actualBalance - displayBalance) <= step) {
          setDisplayBalance(Math.round(actualBalance));
        } else {
          setDisplayBalance((prev) =>
            Math.round(diff > 0 ? prev + step : prev - step)
          );
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [actualBalance, displayBalance]);

  return Math.round(displayBalance);
};
