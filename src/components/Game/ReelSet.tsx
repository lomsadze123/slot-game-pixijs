import { Container } from "@pixi/react";
import { useCallback, useRef, useEffect } from "react";
import Reel from "./Reel";

const ReelSet = ({
  x,
  y,
  columns,
  rows,
  cellWidth,
  cellHeight,
  isSpinning,
  reelPositions,
  winningPositions = [],
}: ReelGrid) => {
  const spinningRef = useRef(isSpinning);
  const isStoppingRef = useRef(false);

  const generateRandomSymbols = useCallback((count: number) => {
    return Array.from({ length: count * 3 }, () =>
      Math.floor(Math.random() * 7)
    );
  }, []);

  // Reset stopping counter when spinning starts or stops
  useEffect(() => {
    if (isSpinning && !spinningRef.current) {
      isStoppingRef.current = false;
    }

    if (!isSpinning && spinningRef.current) {
      isStoppingRef.current = true;
    }

    spinningRef.current = isSpinning;
  }, [isSpinning]);

  const initialReelSymbols = useRef(
    Array(columns)
      .fill(null)
      .map(() => generateRandomSymbols(rows + 2))
  );

  return (
    <Container position={[x, y]}>
      {Array(columns)
        .fill(0)
        .map((_, columnIndex) => {
          // Get the target symbols for this reel - these are what must be shown in the visible area of the reel after it stops spinning
          const targetPositions = reelPositions
            ? reelPositions[columnIndex]
            : undefined;

          // Find winning positions in this reel
          const reelWinningPositions = winningPositions.filter(
            ([colIndex]) => colIndex === columnIndex
          );

          return (
            <Reel
              key={`reel-${columnIndex}`}
              x={columnIndex * cellWidth}
              y={0}
              width={cellWidth * 0.95}
              height={cellHeight * rows}
              symbolCount={rows}
              symbols={initialReelSymbols.current[columnIndex]}
              isSpinning={isSpinning}
              reelIndex={columnIndex}
              targetPositions={targetPositions}
              winningPositions={reelWinningPositions}
              anyWinningSymbolsInGame={winningPositions.length > 0}
            />
          );
        })}
    </Container>
  );
};

export default ReelSet;
