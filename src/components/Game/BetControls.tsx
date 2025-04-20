import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle, Graphics as GraphicsType } from "pixi.js";
import { useCallback } from "react";

interface BetControlsProps extends Position {
  betAmount: number;
  onChangeBet: (amount: number) => void;
  disabled: boolean;
}

const BetControls = ({
  x,
  y,
  betAmount,
  onChangeBet,
  disabled,
}: BetControlsProps) => {
  const drawButton = useCallback(
    (g: GraphicsType, isPlus: boolean) => {
      g.clear();
      g.beginFill(disabled ? 0x555555 : 0x44aa33);
      g.lineStyle(2, 0xffffff);
      g.drawCircle(0, 0, 20);
      g.endFill();

      // Draw '+' or '-' symbol
      g.lineStyle(3, 0xffffff);
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

  const textStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 24,
    fontWeight: "bold",
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowDistance: 2,
  });

  return (
    <Container position={[x, y]}>
      <Text text="BET" anchor={[0.5, 1.5]} style={textStyle} />

      <Container
        position={[-60, 0]}
        eventMode={disabled ? "none" : "static"}
        cursor="pointer"
        pointerdown={handleDecreaseBet}
      >
        <Graphics draw={(g) => drawButton(g, false)} />
      </Container>

      <Text text={`${betAmount}`} anchor={[0.5, 0.5]} style={textStyle} />

      <Container
        position={[60, 0]}
        eventMode={disabled ? "none" : "static"}
        cursor="pointer"
        pointerdown={handleIncreaseBet}
      >
        <Graphics draw={(g) => drawButton(g, true)} />
      </Container>
    </Container>
  );
};

export default BetControls;
