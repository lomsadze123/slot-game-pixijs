import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Text as PIXIText, Graphics as GraphicsType } from "pixi.js";
import { useEffect, useRef, useCallback } from "react";
import { hslToHex } from "../../helper/hslToHex";

const BalanceDisplay = ({
  x,
  y,
  balance,
  lastWin,
  showWinAnimation = false,
}: BalanceDisplayProps) => {
  const winTextRef = useRef<PIXIText>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (showWinAnimation && lastWin > 0 && winTextRef.current) {
      // Create a win animation
      const animate = () => {
        if (!winTextRef.current || !showWinAnimation) return;

        // Pulse effect
        const pulse = 1 + Math.sin(Date.now() / 200) * 0.1;
        winTextRef.current.scale.set(pulse, pulse);

        // Rainbow color cycling for win text
        const hue = (Date.now() / 50) % 360;
        winTextRef.current.tint = hslToHex(hue, 80, 60);

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (winTextRef.current) {
          winTextRef.current.scale.set(1, 1);
          winTextRef.current.tint = 0xffdd00;
        }
      };
    }
  }, [showWinAnimation, lastWin]);

  const drawBackground = useCallback((g: GraphicsType) => {
    g.clear();
    g.beginFill(0x1a1a3a, 0.95);
    g.lineStyle(1, 0x4a4a8a, 0.5);
    g.drawRoundedRect(-140, -25, 280, 70, 10);
    g.endFill();
  }, []);

  const labelStyle = new TextStyle({
    fill: 0x9090ff,
    fontSize: 24,
    fontWeight: "500",
    fontFamily: "Arial",
  });

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
      <Graphics draw={drawBackground} />

      <Text
        text="BALANCE"
        position={[-65, 10]}
        anchor={[0.5, 0.5]}
        style={labelStyle}
      />

      <Text
        text={`${balance}`}
        position={[60, 10]}
        anchor={[0.5, 0.5]}
        style={amountStyle}
      />

      {lastWin > 0 && showWinAnimation && (
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
