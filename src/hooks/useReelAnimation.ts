import { useCallback, useState, useRef } from "react";
import { Easing, removeAll, Tween } from "@tweenjs/tween.js";

export const useReelAnimation = ({
  symbolHeight,
  symbolCount,
  reelIndex,
  startDelayPerReel,
  targetPositions,
  symbols,
}: ReelSymbolHookProps) => {
  const [offset, setOffset] = useState(0);
  const spinningRef = useRef(false);
  const stoppingRef = useRef(false);
  const totalSpins = useRef(0);
  const finalPositionsRef = useRef<number[] | null>(null);
  const activeSymbolsRef = useRef<number[]>([...symbols]);

  const baseDuration = 700 / 15; // 15 is the spin speed

  // Calculate the remaining spins needed to align with target positions
  const calculateRemainingSpins = useCallback(() => {
    if (!targetPositions || !targetPositions.length) return 5; // Default if no target positions

    // Maintain a minimum number of spins for visual effect
    return 2 + reelIndex + Math.floor(Math.random() * 2); // Add slight randomness
  }, [targetPositions, reelIndex]);

  // Prepare the reel to show the final positions when stopping
  const prepareStopPositions = useCallback(() => {
    if (!targetPositions || !Array.isArray(targetPositions)) {
      // If no target positions, just continue with random results
      return;
    }

    // Create a sequence that will show the target symbols after remaining spins
    const targetSequence = [...targetPositions];

    // Add random symbols at the end for the "buffer zone"
    for (let i = 0; i < symbolCount; i++) {
      targetSequence.push(Math.floor(Math.random() * 8));
    }

    finalPositionsRef.current = targetSequence;
  }, [targetPositions, symbolCount]);

  // Normal spinning animation - faster movement with dynamic easing
  const spinOneSymbol = useCallback(() => {
    if (!spinningRef.current) return;
    totalSpins.current++;

    // Calculate dynamic duration - faster at start, gradual slowdown near end
    let duration = baseDuration;

    if (stoppingRef.current) {
      // Create a more dramatic and visible slowdown effect
      const slowdownFactor = Math.min(2.5, 1 + (totalSpins.current % 5) * 0.4);
      duration *= slowdownFactor;
    }

    const from = { y: 0 };
    const to = { y: -symbolHeight };

    // Use a more dynamic easing function for faster spinning
    const easingFunction = !stoppingRef.current
      ? Easing.Quadratic.InOut // Faster during normal spinning
      : Easing.Back.Out; // More dramatic when stopping

    new Tween(from)
      .to(to, duration)
      .easing(easingFunction)
      .onUpdate(() => setOffset(from.y))
      .onComplete(() => {
        setOffset(0);
        // Move first symbol to end
        activeSymbolsRef.current = [
          ...activeSymbolsRef.current.slice(1),
          activeSymbolsRef.current[0],
        ];

        // For the stopping sequence, gradually decrease speed
        if (spinningRef.current) {
          if (stoppingRef.current) {
            // Check if we've reached the point where we need to show final positions
            const remainingSpins =
              calculateRemainingSpins() - totalSpins.current;

            if (remainingSpins <= 0 && finalPositionsRef.current) {
              performFinalStop();
            } else {
              spinOneSymbol();
            }
          } else {
            spinOneSymbol(); // Continue spinning at normal speed
          }
        }
      })
      .start();
  }, [baseDuration, symbolHeight, calculateRemainingSpins]);

  // Execute the final stop with precise alignment and more bounce
  const performFinalStop = useCallback(() => {
    if (!finalPositionsRef.current) return;

    // Switch to the final target sequence
    activeSymbolsRef.current = [...finalPositionsRef.current];

    // Enhanced bounce effect when stopping
    const from = { y: -symbolHeight * 0.3 };
    const to = { y: 0 };

    new Tween(from)
      .to(to, 300)
      .easing(Easing.Elastic.Out)
      .onUpdate(() => setOffset(from.y))
      .onComplete(() => {
        setOffset(0);
        spinningRef.current = false;
        stoppingRef.current = false;
        finalPositionsRef.current = null;
      })
      .start();
  }, [symbolHeight]);

  const startSpinning = useCallback(() => {
    if (spinningRef.current) return;

    spinningRef.current = true;
    stoppingRef.current = false;
    totalSpins.current = 0;
    finalPositionsRef.current = null;

    // Cancel any existing animations
    removeAll();

    setTimeout(() => {
      const bounce = { y: 0 };

      // First small anticipation pull up movement
      new Tween(bounce)
        .to({ y: symbolHeight * 0.05 }, 120)
        .easing(Easing.Sinusoidal.InOut)
        .onUpdate(() => setOffset(bounce.y))
        .onComplete(() => {
          // Second stronger downward movement
          new Tween(bounce)
            .to({ y: -symbolHeight * 0.25 }, 160)
            .easing(Easing.Quadratic.Out)
            .onUpdate(() => setOffset(bounce.y))
            .onComplete(() => {
              // Small bounce back up
              new Tween(bounce)
                .to({ y: -symbolHeight * 0.1 }, 90)
                .easing(Easing.Sinusoidal.In)
                .onUpdate(() => setOffset(bounce.y))
                .onComplete(() => {
                  // Final settling movement
                  new Tween(bounce)
                    .to({ y: 0 }, 70)
                    .easing(Easing.Back.Out)
                    .onUpdate(() => setOffset(bounce.y))
                    .onComplete(() => {
                      // Start actual spinning with a tiny delay
                      setTimeout(() => {
                        spinOneSymbol();
                      }, 30);
                    })
                    .start();
                })
                .start();
            })
            .start();
        })
        .start();
    }, reelIndex * startDelayPerReel);
  }, [symbolHeight, startDelayPerReel, reelIndex, spinOneSymbol]);

  const stopSpinning = useCallback(() => {
    if (!spinningRef.current || stoppingRef.current) return;
    stoppingRef.current = true;
    // Prepare the final positions that will be shown
    prepareStopPositions();
  }, [prepareStopPositions]);

  const getVisibleSymbols = useCallback(() => {
    // We need symbolCount + 2 symbols to ensure smooth scrolling (one extra above and below the visible area)
    const visibleSymbols = [];
    for (let i = 0; i < symbolCount + 2; i++) {
      visibleSymbols.push(
        activeSymbolsRef.current[i % activeSymbolsRef.current.length]
      );
    }
    return visibleSymbols;
  }, [symbolCount]);

  const setInitialSymbols = useCallback((symbols: number[]) => {
    activeSymbolsRef.current = [...symbols];
  }, []);

  return {
    offset,
    spinningRef,
    stoppingRef,
    startSpinning,
    stopSpinning,
    getVisibleSymbols,
    setInitialSymbols,
    totalSpins,
  };
};
