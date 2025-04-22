import { Graphics as GraphicsType } from "pixi.js";

export const drawSlotMachineBackground = (
  g: GraphicsType,
  width: number,
  height: number
) => {
  g.clear();
  g.beginFill(0x000000, 0.15);
  // outer rectangle
  g.drawRoundedRect(-width / 2, -height / 2, width + 10, height + 20, 16);
  g.endFill();
  // border
  g.lineStyle(2, 0xffffff, 0.3);
  g.drawRoundedRect(-width / 2, -height / 2, width + 10, height + 20, 16);
};

export const drawMask = (g: GraphicsType, width: number, height: number) => {
  g.clear();
  g.beginFill(0xffffff);
  g.drawRect(0, 0, width, height);
  g.endFill();
};

export const drawReelBackground = (
  g: GraphicsType,
  width: number,
  height: number
) => {
  g.clear();
  g.beginFill(0x333333, 0.2);
  g.drawRoundedRect(0, 0, width, height, 8);
  g.endFill();
};

export const drawWinEffect = (
  g: GraphicsType,
  width: number,
  height: number,
  isSpinning: Boolean,
  winningPositions: [number, number][],
  anyWinningSymbolsInGame: boolean,
  symbolCount: number,
  symbolHeight: number
) => {
  {
    g.clear();

    if (isSpinning || !anyWinningSymbolsInGame) {
      return;
    }

    // If this reel has no winning positions, blur the entire reel
    if (winningPositions.length === 0) {
      g.beginFill(0x000000, 0.7);
      g.drawRect(0, 0, width, height);
      g.endFill();
      return;
    }

    // For reels with winning positions, blur only the non-winning rows
    const winningRows = winningPositions.map(([_, rowIndex]) => rowIndex);

    // Draw blur for each row that is not winning
    for (let rowIndex = 0; rowIndex < symbolCount; rowIndex++) {
      if (!winningRows.includes(rowIndex)) {
        const rowY = rowIndex * symbolHeight;
        g.beginFill(0x000000, 0.7);
        g.drawRect(0, rowY, width, symbolHeight);
        g.endFill();
      }
    }
  }
};

export const drawSpinButton = (g: GraphicsType, isSpinning: boolean) => {
  g.clear();

  const shape = {
    width: 280,
    height: 140,
    cornerRadius: 40,
  };

  const buttonColor = isSpinning ? 0xe91e63 : 0x8bb93a;
  const shadowColor = isSpinning ? 0xb71c5b : 0x689f38;
  const darkGreenOverlay = 0x558b2f;

  // Bottom shadow
  g.beginFill(isSpinning ? 0x880e36 : 0x4c7634);
  g.lineStyle(0);
  g.drawRoundedRect(
    -(shape.width / 2),
    -(shape.height / 2) + 10,
    shape.width,
    shape.height,
    shape.cornerRadius
  );
  g.endFill();

  // Middle layer
  g.beginFill(shadowColor);
  g.drawRoundedRect(
    -(shape.width / 2),
    -(shape.height / 2) + 5,
    shape.width,
    shape.height - 5,
    shape.cornerRadius
  );
  g.endFill();

  // Main button
  g.beginFill(buttonColor);
  g.drawRoundedRect(
    -(shape.width / 2),
    -(shape.height / 2),
    shape.width,
    shape.height - 10,
    shape.cornerRadius
  );
  g.endFill();

  // Inner dark overlay
  g.beginFill(darkGreenOverlay, 0.12);
  g.drawRoundedRect(
    -(shape.width / 2) + 6,
    -(shape.height / 2) + 6,
    shape.width - 12,
    shape.height - 22,
    shape.cornerRadius - 6
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

    // Triangle shadow
    g.beginFill(0x33691e, 0.5);
    g.moveTo(
      -30 + triangleShadowOffset,
      -triangleHeight / 2 + triangleShadowOffset
    );
    g.lineTo(50 + triangleShadowOffset, triangleShadowOffset);
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
};
