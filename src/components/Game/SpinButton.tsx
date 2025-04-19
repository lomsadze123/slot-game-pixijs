import { Container, Graphics, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useCallback } from "react";
import { Graphics as GraphicTypes } from "pixi.js";

interface SpinButtonProps extends Size {
  handleSpin: () => void;
  disabled?: boolean;
}

const SpinButton = ({
  width,
  height,
  handleSpin,
  disabled = false,
}: SpinButtonProps) => {
  const drawSpinButton = useCallback(
    (g: GraphicTypes) => {
      g.clear();
      g.beginFill(0x44aa33);
      g.lineStyle(3, 0xffffff);
      g.drawRoundedRect(-60, -30, 120, 60, 15);
      g.endFill();
    },
    [disabled]
  );

  return (
    <Container
      position={[width * 0.5, height * 0.85]}
      eventMode={disabled ? "none" : "static"}
      pointerdown={disabled ? undefined : handleSpin}
      alpha={disabled ? 0.7 : 1}
    >
      <Graphics draw={drawSpinButton} />
      <Text
        text="SPIN"
        anchor={0.5}
        style={
          new TextStyle({
            fill: 0xffffff,
            fontSize: 28,
            fontWeight: "bold",
          })
        }
      />
    </Container>
  );
};

export default SpinButton;
