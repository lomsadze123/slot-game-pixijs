import { Container } from "@pixi/react";
import { useRef } from "react";
import Reel from "./Reel";
import { useSpinState } from "../../hooks/useSpinState";
import {
  generateInitialReelSymbols,
  getReelWinningPositions,
} from "../../utils/symbolUtils";

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
  // Track spinning state transitions
  useSpinState(isSpinning);

  // Initialize reel symbols
  const initialReelSymbols = useRef(generateInitialReelSymbols(columns, rows));

  return (
    <Container position={[x, y]}>
      {Array(columns)
        .fill(0)
        .map((_, columnIndex) => {
          // Get the target symbols for this reel
          const targetPositions = reelPositions
            ? reelPositions[columnIndex]
            : undefined;

          // Find winning positions in this reel
          const reelWinningPositions = getReelWinningPositions(
            columnIndex,
            winningPositions
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
