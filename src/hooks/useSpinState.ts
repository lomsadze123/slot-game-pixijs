import { useRef, useEffect } from "react";

export const useSpinState = (isSpinning: boolean) => {
  const spinningRef = useRef(isSpinning);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    if (isSpinning && !spinningRef.current) {
      isStoppingRef.current = false;
    }
    if (!isSpinning && spinningRef.current) {
      isStoppingRef.current = true;
    }
    spinningRef.current = isSpinning;
  }, [isSpinning]);

  return;
};
