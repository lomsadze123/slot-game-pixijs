import { Container, Text } from "@pixi/react";
import { TextStyle, Text as PIXIText } from "pixi.js";
import { useEffect, useRef } from "react";

interface BalanceDisplayProps extends Position {
  balance: number;
  lastWin: number;
  isSpinning: boolean;
}

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

  const balanceStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 24,
    fontWeight: "bold",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowDistance: 2,
  });

  const winStyle = new TextStyle({
    fill: 0xffdd00,
    fontSize: 32,
    fontWeight: "bold",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowDistance: 4,
  });

  return (
    <Container position={[x, y]}>
      <Text
        text={`BALANCE: ${balance}`}
        anchor={[0, 0.5]}
        style={balanceStyle}
      />

      {lastWin > 0 && !isSpinning && (
        <Text
          ref={winTextRef}
          text={`WIN: ${lastWin}`}
          anchor={[0, 1.5]}
          style={winStyle}
        />
      )}
    </Container>
  );
};

export default BalanceDisplay;
