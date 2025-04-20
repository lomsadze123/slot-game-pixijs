import { Container, Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import { Assets } from "pixi.js";
import { BG_ASSETS, SYMBOL_ASSETS } from "../../constants/pixiAssets";

const Symbol = ({ x, y, width, height, symbolType }: SymbolContainer) => {
  const [symbolLoaded, setSymbolLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  const safeSymbolType = symbolType % SYMBOL_ASSETS.length;
  const symbolPath = SYMBOL_ASSETS[safeSymbolType];
  const bgPath = BG_ASSETS[safeSymbolType];

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Assets.load(symbolPath);
        setSymbolLoaded(true);

        await Assets.load(bgPath);
        setBgLoaded(true);
      } catch (err) {
        console.error(
          `Failed to load assets for symbol ${safeSymbolType}`,
          err
        );
      }
    };

    loadAssets();
  }, [symbolPath, bgPath, safeSymbolType]);

  if (!symbolLoaded || !bgLoaded) {
    return null;
  }

  return (
    <Container position={[x, y]}>
      <Sprite
        texture={Assets.get(bgPath)}
        anchor={0.5}
        width={width * 2}
        height={height * 1.8}
      />

      <Sprite
        texture={Assets.get(symbolPath)}
        anchor={0.5}
        width={width}
        height={height}
      />
    </Container>
  );
};

export default Symbol;
