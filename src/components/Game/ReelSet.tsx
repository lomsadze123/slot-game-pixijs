import { Container, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
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

      {/* Display balance and bet */}
      <Text
        text="Balance: 1000"
        x={0}
        y={rows * cellHeight + 100}
        style={new TextStyle({ fill: 0xffffff, fontSize: 24 })}
      />
    </Container>
  );
};

export default ReelSet;
