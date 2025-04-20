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

      // Extra large button dimensions
      const width = 280;
      const height = 140;
      const cornerRadius = 40;

      // Choose color based on spinning state
      const buttonColor = isSpinning ? 0xe91e63 : 0x8bc34a; // Bright red when spinning, green when not
      const shadowColor = isSpinning ? 0xb71c5b : 0x689f38;

      // Enhanced 3D effect with multiple layers
      // Bottom shadow (darkest)
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

      // Middle shadow layer
      g.beginFill(shadowColor);
      g.lineStyle(0);
      g.drawRoundedRect(
        -(width / 2),
        -(height / 2) + 5,
        width,
        height - 5,
        cornerRadius
      );
      g.endFill();

      // Main button background with rounded corners
      g.beginFill(buttonColor);
      g.lineStyle(0);
      g.drawRoundedRect(
        -(width / 2),
        -(height / 2),
        width,
        height - 10,
        cornerRadius
      );
      g.endFill();

      if (isSpinning) {
        // Stop square icon
        const stopSize = 70;
        const stopCorner = 18;

        // Use a darker red for the stop icon
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
        // Play triangle icon with lighter green
        const triangleHeight = 80;

        // Lighter green color for the play icon
        g.beginFill(0x7cb342); // Lighter, more visible green
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
