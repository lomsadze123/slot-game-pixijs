import { Container, Graphics } from "@pixi/react";
import { useCallback } from "react";
import { Graphics as GraphicTypes } from "pixi.js";

const SpinButton = ({
  handleSpin,
  disabled = false,
  isSpinning = false,
  x,
  y,
}: SpinButtonProps) => {
  const drawSpinButton = useCallback(
    (g: GraphicTypes) => {
      g.clear();

      const width = 280;
      const height = 140;
      const cornerRadius = 40;

      const buttonColor = isSpinning ? 0xe91e63 : 0x8bb93a;
      const shadowColor = isSpinning ? 0xb71c5b : 0x689f38;
      const darkGreenOverlay = 0x558b2f;

      // Bottom shadow
      g.beginFill(isSpinning ? 0x880e36 : 0x4c7634);
      g.lineStyle(0);
      g.drawRoundedRect(
        -(width / 2),
        -(height / 2) + 10,
        width,
        height,
        cornerRadius
      );
      g.endFill();

      // Middle layer
      g.beginFill(shadowColor);
      g.drawRoundedRect(
        -(width / 2),
        -(height / 2) + 5,
        width,
        height - 5,
        cornerRadius
      );
      g.endFill();

      // Main button
      g.beginFill(buttonColor);
      g.drawRoundedRect(
        -(width / 2),
        -(height / 2),
        width,
        height - 10,
        cornerRadius
      );
      g.endFill();

      // Inner dark overlay
      g.beginFill(darkGreenOverlay, 0.12);
      g.drawRoundedRect(
        -(width / 2) + 6,
        -(height / 2) + 6,
        width - 12,
        height - 22,
        cornerRadius - 6
      );
      g.endFill();

      if (isSpinning) {
        // Stop square
        const stopSize = 70;
        const stopCorner = 18;

        g.beginFill(0x9c1048);
        g.drawRoundedRect(
          -(stopSize / 2),
          -(stopSize / 2),
          stopSize,
          stopSize,
          stopCorner
        );
        g.endFill();
      } else {
        // Play triangle icon
        const triangleHeight = 80;
        const triangleShadowOffset = 4;

        // Shadow for triangle
        g.beginFill(0x33691e, 0.5);
        g.moveTo(
          -30 + triangleShadowOffset,
          -triangleHeight / 2 + triangleShadowOffset
        );
        g.lineTo(50 + triangleShadowOffset, 0 + triangleShadowOffset);
        g.lineTo(
          -30 + triangleShadowOffset,
          triangleHeight / 2 + triangleShadowOffset
        );
        g.closePath();
        g.endFill();

        // Main triangle
        g.beginFill(0x7ca142);
        g.moveTo(-30, -triangleHeight / 2);
        g.lineTo(50, 0);
        g.lineTo(-30, triangleHeight / 2);
        g.closePath();
        g.endFill();
      }
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
      <Graphics draw={drawSpinButton} />
    </Container>
  );
};

export default SpinButton;
