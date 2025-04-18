import { Container, Graphics, Text } from "@pixi/react";
import { useCallback } from "react";
import { TextStyle, Graphics as GraphicTypes } from "pixi.js";

// Placeholder until we have actual symbol assets
const Symbol = ({ x, y, width, height, symbolType }: SymbolContainer) => {
  const colors = [0xff3e4d, 0x2bd9fe, 0x7ed321, 0xffff00, 0xc86edf];

  const drawSymbol = useCallback(
    (g: GraphicTypes) => {
      g.clear();
      g.beginFill(colors[symbolType % colors.length]);
      g.drawRoundedRect(-width / 2, -height / 2, width, height, 8);
      g.endFill();
    },
    [width, height, symbolType, colors]
  );

  const textStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 24,
    fontWeight: "bold",
  });

  return (
    <Container position={[x, y]}>
      <Graphics draw={drawSymbol} />
      <Text text={`${symbolType}`} anchor={0.5} style={textStyle} />
    </Container>
  );
};

export default Symbol;
