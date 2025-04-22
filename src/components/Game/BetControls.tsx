import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Graphics as GraphicsType } from "pixi.js";
import { useCallback } from "react";
import { GAME_CONFIG } from "../../constants/gameConfig";

const BetControls = ({
  x,
  y,
  betAmount,
  onChangeBet,
  disabled,
}: BetControlsProps) => {
  const drawBackground = useCallback((g: GraphicsType) => {
    g.clear();
    g.beginFill(0x1a1a3a, 0.7);
    g.lineStyle(1, 0x4a4a8a, 0.5);
    g.drawRoundedRect(-140, -25, 280, 110, 10);
    g.endFill();
  }, []);

  const drawButton = useCallback(
    (g: GraphicsType, isPlus: boolean) => {
      g.clear();

      const buttonDimensions = {
        width: 45,
        height: 45,
        radius: 6,
      };

      g.beginFill(disabled ? 0x333355 : 0x2a2a4a);
      g.lineStyle(2, 0x6c63ff, 0.1);
      g.drawRoundedRect(
        -buttonDimensions.width / 2,
        -buttonDimensions.height / 2,
        buttonDimensions.width,
        buttonDimensions.height,
        buttonDimensions.radius
      );
      g.endFill();

      // Draw '+' or '-' symbol
      g.lineStyle(3, 0xffffff, 1);
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
      onChangeBet(betAmount + GAME_CONFIG.betStep);
    }
  }, [betAmount, onChangeBet, disabled]);

  const handleDecreaseBet = useCallback(() => {
    if (!disabled && betAmount > GAME_CONFIG.minBet) {
      onChangeBet(betAmount - GAME_CONFIG.betStep);
    }
  }, [betAmount, onChangeBet, disabled]);

  const labelStyle = new TextStyle({
    fill: 0x9090ff,
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Arial",
  });

  const amountStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Arial",
  });

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawBackground} />

      <Text
        text={`$${betAmount.toString()}`}
        position={[-100, 50]}
        anchor={[0.5, 0.5]}
        style={amountStyle}
      />

      <Container
        position={[40, 30]}
        eventMode={disabled ? "none" : "static"}
        cursor="pointer"
        pointerdown={handleDecreaseBet}
      >
        <Graphics draw={(g) => drawButton(g, false)} />
      </Container>

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
