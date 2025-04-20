import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Graphics as GraphicsType } from "pixi.js";
import { useCallback } from "react";

const BetControls = ({
  x,
  y,
  betAmount,
  onChangeBet,
  disabled,
}: BetControlsProps) => {
  // Draw background panel
  const drawBackground = useCallback((g: GraphicsType) => {
    g.clear();
    // Dark blue background with rounded corners
    g.beginFill(0x1a1a3a, 0.7);
    g.lineStyle(1, 0x4a4a8a, 0.5);
    g.drawRoundedRect(-140, -25, 280, 110, 10);
    g.endFill();
  }, []);

  // Draw +/- buttons
  const drawButton = useCallback(
    (g: GraphicsType, isPlus: boolean) => {
      g.clear();

      // Button size
      const width = 45;
      const height = 45;
      const radius = 6;

      // Background with slight rounding
      g.beginFill(disabled ? 0x333355 : 0x2a2a4a); // button fill
      g.lineStyle(2, 0x6c63ff, 0.1); // stronger, cleaner border
      g.drawRoundedRect(-width / 2, -height / 2, width, height, radius);
      g.endFill();

      // Draw '+' or '-' symbol
      g.lineStyle(3, 0xffffff, 1); // white line, thicker
      g.moveTo(-8, 0);
      g.lineTo(8, 0);

      if (isPlus) {
        g.moveTo(0, -8);
        g.lineTo(0, 8);
      }
    },
    [disabled]
  );

  const handleIncreaseBet = useCallback(() => {
    if (!disabled) {
      onChangeBet(betAmount + 10);
    }
  }, [betAmount, onChangeBet, disabled]);

  const handleDecreaseBet = useCallback(() => {
    if (!disabled && betAmount > 10) {
      onChangeBet(betAmount - 10);
    }
  }, [betAmount, onChangeBet, disabled]);

  // Label text style
  const labelStyle = new TextStyle({
    fill: 0x9090ff,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Arial",
  });

  // Amount text style
  const amountStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Arial",
  });

  return (
    <Container position={[x, y]}>
      {/* Background panel */}
      <Graphics draw={drawBackground} />

      {/* Bet amount with dollar sign */}
      <Text
        text={`$${betAmount.toString()}`}
        position={[-100, 50]}
        anchor={[0.5, 0.5]}
        style={amountStyle}
      />

      {/* Decrease button */}
      <Container
        position={[40, 30]}
        eventMode={disabled ? "none" : "static"}
        cursor="pointer"
        pointerdown={handleDecreaseBet}
      >
        <Graphics draw={(g) => drawButton(g, false)} />
      </Container>

      {/* Increase button */}
      <Container
        position={[100, 30]}
        eventMode={disabled ? "none" : "static"}
        cursor="pointer"
        pointerdown={handleIncreaseBet}
      >
        <Graphics draw={(g) => drawButton(g, true)} />
      </Container>

      <Text
        text="BET AMOUNT"
        position={[-65, 10]}
        anchor={[0.5, 0.5]}
        style={labelStyle}
      />
    </Container>
  );
};

export default BetControls;
