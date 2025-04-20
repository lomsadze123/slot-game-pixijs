import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Text as PIXIText, Graphics as GraphicsType } from "pixi.js";
import { useEffect, useRef, useCallback } from "react";

const BalanceDisplay = ({
  x,
  y,
  balance,
  lastWin,
  isSpinning,
}: BalanceDisplayProps) => {
  const winTextRef = useRef<PIXIText>(null);

  useEffect(() => {
    if (lastWin > 0 && !isSpinning && winTextRef.current) {
      // Create a win animation
      const animate = () => {
        if (!winTextRef.current) return;

        winTextRef.current.scale.set(
          1 + Math.sin(Date.now() / 200) * 0.1,
          1 + Math.sin(Date.now() / 200) * 0.1
        );
        requestAnimationFrame(animate);
      };

      const animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
        if (winTextRef.current) {
          winTextRef.current.scale.set(1, 1);
        }
      };
    }
  }, [lastWin, isSpinning]);

  // Draw background panel - matching the size and style of BetControls
  const drawBackground = useCallback((g: GraphicsType) => {
    g.clear();
    // Dark blue background with rounded corners, same as BetControls
    g.beginFill(0x1a1a3a, 0.95);
    g.lineStyle(1, 0x4a4a8a, 0.5);
    g.drawRoundedRect(-140, -25, 280, 70, 10); // Made height slightly shorter since we don't need buttons
    g.endFill();
  }, []);

  // Label text style - matching BetControls
  const labelStyle = new TextStyle({
    fill: 0x9090ff,
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "Arial",
  });

  // Amount text style - matching BetControls
  const amountStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Arial",
  });

  const winStyle = new TextStyle({
    fill: 0xffdd00,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Arial",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowDistance: 2,
  });

  return (
    <Container position={[x, y]}>
      {/* Background panel */}
      <Graphics draw={drawBackground} />

      {/* Balance label - positioned like BetControls label */}
      <Text
        text="BALANCE"
        position={[-65, 10]}
        anchor={[0.5, 0.5]}
        style={labelStyle}
      />

      {/* Balance amount */}
      <Text
        text={`${balance}`}
        position={[60, 10]}
        anchor={[0.5, 0.5]}
        style={amountStyle}
      />

      {/* Win display below the balance display when there's a win */}
      {lastWin > 0 && !isSpinning && (
        <Container position={[0, 70]}>
          <Text
            ref={winTextRef}
            text={`WIN: ${lastWin}`}
            anchor={[0.5, 0]}
            style={winStyle}
          />
        </Container>
      )}
    </Container>
  );
};

export default BalanceDisplay;
