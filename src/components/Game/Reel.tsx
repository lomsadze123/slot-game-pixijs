import { Container, Graphics } from "@pixi/react";
import { Graphics as GraphicTypes } from "pixi.js";
import { useCallback, useState, useEffect, useRef } from "react";
import Symbol from "./Symbol";

const Reel = ({
  x,
  y,
  width,
  height,
  symbolCount,
  isSpinning,
  symbols,
}: ReelSymbolContainer) => {
  // Track vertical offset for spinning animation
  const [offset, setOffset] = useState(0);
  // Reference for the mask
  const maskRef = useRef<GraphicTypes>(null);

  // Simple spinning animation using useEffect
  useEffect(() => {
    if (!isSpinning) return;

    let animationId: number;
    let currentOffset = 0;
    const speed = 30; // pixels per frame

    const animate = () => {
      currentOffset += speed;

      // When we've moved a full symbol height, reset and shift the symbols
      if (currentOffset >= height / symbolCount) {
        currentOffset = 0;
        // This would actually be handled by the controller
      }

      setOffset(currentOffset);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isSpinning, height, symbolCount]);

  // Create mask for the reel to prevent overflow
  const drawMask = useCallback(
    (g: GraphicTypes) => {
      g.clear();
      g.beginFill(0xffffff);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [width, height]
  );

  const drawReelBackground = useCallback(
    (g: GraphicTypes) => {
      g.clear();
      g.beginFill(0x333333, 0.5);
      g.drawRoundedRect(0, 0, width, height, 8);
      g.endFill();
    },
    [width, height]
  );

  const symbolHeight = height / symbolCount;

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawReelBackground} />

      {/* Create a mask */}
      <Graphics draw={drawMask} ref={maskRef} />

      {/* Apply the mask to the symbols container */}
      <Container y={isSpinning ? offset : 0} mask={maskRef.current}>
        {symbols.map((symbolType, index) => (
          <Symbol
            key={`symbol-${index}`}
            x={width / 2}
            y={index * symbolHeight + symbolHeight / 2}
            width={width * 0.8}
            height={symbolHeight * 0.8}
            symbolType={symbolType}
          />
        ))}
      </Container>
    </Container>
  );
};

export default Reel;
