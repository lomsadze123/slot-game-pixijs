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
  const initialSymbolsRef = useRef<number[]>([...symbols]);
  const spinningRef = useRef(false);
  const stoppingRef = useRef(false);
  const totalSpins = useRef(0);
  const reelHasWinningSymbolsRef = useRef(false);

  // Store the target positions we need to transition to when stopping
  const finalPositionsRef = useRef<number[] | null>(null);
  const spinSpeed = 7;
  const spinSpeedRef = useRef(spinSpeed);

  const symbolHeight = height / symbolCount;

  // Animation timing constants
  const startDelayPerReel = 150;
  const stopDelayPerReel = 300;
  const baseDuration = 500 / spinSpeed; // Base duration for one symbol movement

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

    // Minimum number of spins needed is at least 3 plus the reel index to ensure visual effect of sequential stopping
    return 3 + reelIndex;
  }, [targetPositions, reelIndex]);

  // Prepare the reel to show the final positions when stopping
  const prepareStopPositions = useCallback(() => {
    if (!targetPositions || !Array.isArray(targetPositions)) {
      // If no target positions, just continue with random results
      return;
    }

    // Create a prediction of how the reel will look after remaining spins
    const spinCount = calculateRemainingSpins();
    const currentSymbols = [...activeSymbolsRef.current];

    // Simulate the rotations that will happen during remaining spins
    let simulatedSymbols = [...currentSymbols];
    for (let i = 0; i < spinCount; i++) {
      simulatedSymbols = [...simulatedSymbols.slice(1), simulatedSymbols[0]];
    }

    // Calculate the target positions to ensure smooth transition
    const targetSequence = [...targetPositions];

    // We need to ensure the symbols that will be visible after spinning match the target positions we want to show
    const finalSequence = [];

    // First add some symbols above the visible area (these will be scrolled through)
    for (let i = 0; i < symbolCount; i++) {
      finalSequence.push(simulatedSymbols[i]);
    }

    // Then add our target positions for the visible area
    for (let i = 0; i < symbolCount; i++) {
      finalSequence.push(targetSequence[i]);
    }

    // Finally add some buffer symbols for smooth animation
    for (let i = 0; i < symbolCount; i++) {
      finalSequence.push(Math.floor(Math.random() * 8));
    }

    finalPositionsRef.current = finalSequence;

    // Start the slowdown process
    spinSpeedRef.current = spinSpeed;
  }, [targetPositions, symbolCount, calculateRemainingSpins]);

  // Normal spinning animation - constant speed
  const spinOneSymbol = useCallback(() => {
    if (!spinningRef.current) return;
    totalSpins.current++;

    // Gradually slow down if we're stopping
    const duration = stoppingRef.current
      ? baseDuration * (1 + (totalSpins.current % 5) * 0.5)
      : baseDuration;

    const from = { y: 0 };
    const to = { y: -symbolHeight };

    new Tween(from)
      .to(to, duration)
      .easing(Easing.Sinusoidal.InOut)
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

  // Execute the final stop with precise alignment
  const performFinalStop = useCallback(() => {
    if (!finalPositionsRef.current) return;

    // Switch to the final target sequence
    activeSymbolsRef.current = [...finalPositionsRef.current];

    // Do a final bounce animation to simulate slight overshooting and bouncing back
    const from = { y: -symbolHeight * 0.2 };
    const to = { y: 0 };

    new Tween(from)
      .to(to, 400)
      .easing(Easing.Back.Out)
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

    // Store current symbols as initial before animation starts
    initialSymbolsRef.current = [...activeSymbolsRef.current];

    setTimeout(() => {
      // Initial bounce effect - this creates the anticipation effect
      const bounce = { y: 0 };
      new Tween(bounce)
        .to({ y: -symbolHeight * 0.15 }, 100)
        .easing(Easing.Quadratic.Out)
        .yoyo(true)
        .repeat(1)
        .onUpdate(() => setOffset(bounce.y))
        .onComplete(() => {
          // Start actual spinning immediately after this reel's bounce
          spinOneSymbol();
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
