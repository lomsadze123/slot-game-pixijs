import { Container, Graphics } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js";
import { useCallback, useState, useEffect, useRef } from "react";
import Symbol from "./Symbol";
import { Easing, removeAll, Tween, update } from "@tweenjs/tween.js";

const Reel = ({
  x,
  y,
  width,
  height,
  symbolCount,
  isSpinning,
  symbols,
  reelIndex,
  targetPositions,
  winningPositions = [],
  anyWinningSymbolsInGame,
}: ReelSymbolContainer) => {
  const [offset, setOffset] = useState(0);
  const maskRef = useRef<GraphicsType>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeSymbolsRef = useRef<number[]>([...symbols]);
  const spinningRef = useRef(false);
  const stoppingRef = useRef(false);
  const totalSpins = useRef(0);
  const reelHasWinningSymbolsRef = useRef(false);

  // Store the target positions we need to transition to when stopping
  const finalPositionsRef = useRef<number[] | null>(null);

  const spinSpeed = 15;

  const symbolHeight = height / symbolCount;

  // Animation timing constants
  const startDelayPerReel = 120;
  const stopDelayPerReel = 200;
  const baseDuration = 700 / spinSpeed;

  const hasWinningSymbols = winningPositions.length > 0;

  // Keep track of winning state for animations
  useEffect(() => {
    reelHasWinningSymbolsRef.current = hasWinningSymbols;
  }, [hasWinningSymbols]);

  const drawMask = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(0xffffff);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [width, height]
  );

  const drawReelBackground = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(0x333333, 0.2);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();
    },
    [width, height]
  );

  const drawWinEffect = useCallback(
    (g: GraphicsType) => {
      g.clear();

      if (isSpinning || !anyWinningSymbolsInGame) {
        return;
      }

      // If this reel has no winning positions, blur the entire reel
      if (winningPositions.length === 0) {
        g.beginFill(0x000000, 0.7);
        g.drawRect(0, 0, width, height);
        g.endFill();
        return;
      }

      // For reels with winning positions, blur only the non-winning rows
      const winningRows = winningPositions.map(([_, rowIndex]) => rowIndex);

      // Draw blur for each row that is not winning
      for (let rowIndex = 0; rowIndex < symbolCount; rowIndex++) {
        if (!winningRows.includes(rowIndex)) {
          const rowY = rowIndex * symbolHeight;
          g.beginFill(0x000000, 0.7);
          g.drawRect(0, rowY, width, symbolHeight);
          g.endFill();
        }
      }
    },
    [
      width,
      height,
      isSpinning,
      winningPositions,
      anyWinningSymbolsInGame,
      symbolCount,
      symbolHeight,
    ]
  );

  const animate = useCallback((time: number) => {
    update(time);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

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
        // Reset position and cycle symbols
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
    const from = { y: -symbolHeight * 0.3 }; // Increased bounce height
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

  // Handle spin state changes with sequential stopping
  useEffect(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    if (isSpinning && !spinningRef.current) {
      startSpinning();
    } else if (!isSpinning && spinningRef.current && !stoppingRef.current) {
      setTimeout(() => {
        stopSpinning();
      }, reelIndex * stopDelayPerReel);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    isSpinning,
    animate,
    startSpinning,
    stopSpinning,
    reelIndex,
    stopDelayPerReel,
  ]);

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

  // Determine if a symbol at specific position is part of a winning line
  const isWinningPosition = useCallback(
    (rowIndex: number) => {
      if (!hasWinningSymbols) return false;

      // Check if the row index is in our winning positions
      return winningPositions.some(([_, row]) => row === rowIndex);
    },
    [hasWinningSymbols, winningPositions]
  );

  const visibleSymbols = getVisibleSymbols();

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawReelBackground} />
      <Graphics draw={drawMask} ref={maskRef} />

      <Container y={offset} mask={maskRef.current}>
        {visibleSymbols.map((symbolType, index) => {
          // The visible row index corresponds to the position (0 to symbolCount-1)
          const visibleRowIndex = index % symbolCount;
          const isWinning = isWinningPosition(visibleRowIndex);

          return (
            <Symbol
              key={`symbol-${index}-${totalSpins.current}`}
              x={width / 2}
              y={index * symbolHeight + symbolHeight / 2}
              width={width * 0.8}
              height={symbolHeight * 0.8}
              symbolType={symbolType}
              isWinning={isWinning && !isSpinning}
            />
          );
        })}
      </Container>

      {/* Win/lose effect overlay */}
      <Graphics draw={drawWinEffect} />
    </Container>
  );
};

export default Reel;
