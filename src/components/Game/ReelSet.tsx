import { Container } from "@pixi/react";
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
}: ReelGrid) => {
  return (
    <Container position={[x, y]}>
      {Array(columns)
        .fill(0)
        .map((_, index) => (
          <Reel
            key={`reel-${index}`}
            x={index * cellWidth}
            y={0}
            width={cellWidth * 0.9}
            height={rows * cellHeight}
            symbolCount={rows}
            isSpinning={isSpinning}
            symbols={reelPositions[index]}
          />
        ))}
    </Container>
  );
};

export default ReelSet;
