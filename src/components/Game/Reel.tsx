import { Container, Graphics } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import Symbol from "./Symbol";
import { useReelAnimation } from "../../hooks/useReelAnimation";
import {
  drawMask,
  drawReelBackground,
  drawWinEffect,
} from "../../utils/graphics";
import { useAnimationFrame } from "../../hooks/useAnimationFrame";
import { GAME_CONFIG } from "../../constants/gameConfig";

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
  const maskRef = useRef<GraphicsType>(null);
  const symbolHeight = height / symbolCount;
  const hasWinningSymbols = winningPositions.length > 0;
  const reelHasWinningSymbolsRef = useRef(false);
  const { stopDelayPerReel, startDelayPerReel } = GAME_CONFIG;

  const {
    offset,
    spinningRef,
    stoppingRef,
    startSpinning,
    stopSpinning,
    getVisibleSymbols,
    setInitialSymbols,
    totalSpins,
  } = useReelAnimation({
    symbolHeight,
    symbolCount,
    reelIndex,
    startDelayPerReel,
    targetPositions,
    symbols,
  });

  // Initialize symbols
  useEffect(() => {
    setInitialSymbols(symbols);
  }, [symbols, setInitialSymbols]);

  // Keep track of winning state for animations
  useEffect(() => {
    reelHasWinningSymbolsRef.current = hasWinningSymbols;
  }, [hasWinningSymbols]);

  const drawMaskCallback = useCallback(
    (g: GraphicsType) => drawMask(g, width, height),
    [width, height]
  );

  const drawReelBackgroundCallback = useCallback(
    (g: GraphicsType) => drawReelBackground(g, width, height),
    [width, height]
  );

  const drawWinEffectCallback = useCallback(
    (g: GraphicsType) =>
      drawWinEffect(
        g,
        width,
        height,
        isSpinning,
        winningPositions,
        anyWinningSymbolsInGame,
        symbolCount,
        symbolHeight
      ),
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

  // Animation frame hook
  useAnimationFrame({
    isSpinning,
    reelIndex,
    stopDelayPerReel,
    startSpinning,
    stopSpinning,
    spinningRef,
    stoppingRef,
  });

  const visibleSymbols = getVisibleSymbols();

  const isWinningPosition = (rowIndex: number): boolean => {
    if (!hasWinningSymbols) return false;

    // Check if the row index is in our winning positions
    return winningPositions.some(([_, row]) => row === rowIndex);
  };

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawReelBackgroundCallback} />
      <Graphics draw={drawMaskCallback} ref={maskRef} />

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
      <Graphics draw={drawWinEffectCallback} />
    </Container>
  );
};

export default Reel;
