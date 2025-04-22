import { Container, Graphics } from "@pixi/react";
import { useCallback } from "react";
import { Graphics as GraphicTypes } from "pixi.js";
import { drawSpinButton } from "../../utils/graphics";

const SpinButton = ({
  handleSpin,
  disabled = false,
  isSpinning = false,
  x,
  y,
}: SpinButtonProps) => {
  const draw = useCallback(
    (g: GraphicTypes) => {
      drawSpinButton(g, isSpinning);
    },
    [isSpinning, disabled]
  );

  return (
    <Container
      position={[x, y]}
      eventMode={disabled ? "none" : "static"}
      cursor="pointer"
      pointerdown={disabled ? undefined : handleSpin}
      alpha={disabled ? 0.6 : 1}
    >
      <Graphics draw={draw} />
    </Container>
  );
};

export default SpinButton;
