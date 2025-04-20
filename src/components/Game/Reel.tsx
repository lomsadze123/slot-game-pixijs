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
  const finalPositionsRef = useRef<number[] | null>(null);
  const reelHasWinningSymbolsRef = useRef(false);

  const symbolHeight = height / symbolCount;

  // Animation timing constants
  const startDelayPerReel = 150;
  const stopDelayPerReel = 300;
  const spinSpeed = 7;
  const baseDuration = 1000 / spinSpeed; // Base duration for one symbol movement

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

  // Normal spinning animation - constant speed
  const spinOneSymbol = useCallback(() => {
    if (!spinningRef.current) return;
    totalSpins.current++;

    const from = { y: 0 };
    const to = { y: -symbolHeight };

    new Tween(from)
      .to(to, baseDuration)
      .easing(Easing.Sinusoidal.InOut)
      .onUpdate(() => setOffset(from.y))
      .onComplete(() => {
        // Reset position and cycle symbols
        setOffset(0);
        // (move first to end)
        activeSymbolsRef.current = [
          ...activeSymbolsRef.current.slice(1),
          activeSymbolsRef.current[0],
        ];

        if (spinningRef.current) {
          if (stoppingRef.current) {
            beginStopSequence();
          } else {
            spinOneSymbol(); // Continue spinning
          }
        }
      })
      .start();
  }, [baseDuration, symbolHeight]);

  // Prepare the reel to show the final positions when stopping
  const prepareStopPositions = useCallback(() => {
    if (!targetPositions || !Array.isArray(targetPositions)) {
      // If no target positions, just continue with random results
      return;
    }
    // Create a new array of symbols that will ensure the visible area shows targetPositions
    const newSymbols = [...targetPositions];
    // Add extra symbols at the end for smooth animation
    // (we'll only care about the visible ones but need the extras for animation)
    for (let i = 0; i < symbolCount; i++) {
      newSymbols.push(Math.floor(Math.random() * 8));
    }
    finalPositionsRef.current = newSymbols;
  }, [targetPositions, symbolCount]);

  const beginStopSequence = useCallback(() => {
    if (finalPositionsRef.current === null && targetPositions) {
      prepareStopPositions();
    }
    const slowdownSpins = 4;
    let currentSpin = 0;
    const performSlowSpin = () => {
      if (currentSpin >= slowdownSpins) {
        // Final adjustment to ensure correct positions are shown
        if (finalPositionsRef.current) {
          activeSymbolsRef.current = [...finalPositionsRef.current];
        }
        // Final bounce and stop
        new Tween({ y: -symbolHeight * 0.15 })
          .to({ y: 0 }, 300)
          .easing(Easing.Back.Out)
          .onUpdate(({ y }) => setOffset(y))
          .onComplete(() => {
            spinningRef.current = false;
            stoppingRef.current = false;
            setOffset(0);
            finalPositionsRef.current = null;
          })
          .start();
        return;
      }
      // Calculate progressively longer duration
      const slowdownFactor = 1.5 + currentSpin * 0.8;
      const duration = baseDuration * slowdownFactor;
      const from = { y: 0 };
      const to = { y: -symbolHeight };
      // If we're on the final spin before stopping, prepare to show the correct symbols
      if (currentSpin === slowdownSpins - 1 && finalPositionsRef.current) {
        // On the penultimate spin, set up the activeSymbols to properly transition to final position
        const adjustedSymbols = [
          ...finalPositionsRef.current.slice(1),
          finalPositionsRef.current[0],
        ];
        activeSymbolsRef.current = adjustedSymbols;
      }
      new Tween(from)
        .to(to, duration) // Progressively slower
        .easing(Easing.Sinusoidal.InOut)
        .onUpdate(() => setOffset(from.y))
        .onComplete(() => {
          setOffset(0);
          activeSymbolsRef.current = [
            ...activeSymbolsRef.current.slice(1),
            activeSymbolsRef.current[0],
          ];
          currentSpin++;
          performSlowSpin(); // Continue with next slower spin
        })
        .start();
    };
    // Start the slowdown sequence
    performSlowSpin();
  }, [symbolHeight, baseDuration, targetPositions, prepareStopPositions]);

  const startSpinning = useCallback(() => {
    if (spinningRef.current) return;
    spinningRef.current = true;
    stoppingRef.current = false;
    totalSpins.current = 0;
    finalPositionsRef.current = null;
    // Cancel any existing animations
    removeAll();
    setTimeout(() => {
      // Initial bounce
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

  const getVisibleSymbols = () => {
    // We need symbolCount + 2 symbols to ensure smooth scrolling
    const visibleSymbols = [];
    for (let i = 0; i < symbolCount + 2; i++) {
      visibleSymbols.push(
        activeSymbolsRef.current[i % activeSymbolsRef.current.length]
      );
    }
    return visibleSymbols;
  };

  // Determine if a symbol at specific position is part of a winning line
  const isWinningPosition = (rowIndex: number) => {
    if (!hasWinningSymbols) return false;

    // Check if the row index is in our winning positions
    return winningPositions.some(([_, row]) => row === rowIndex);
  };

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
