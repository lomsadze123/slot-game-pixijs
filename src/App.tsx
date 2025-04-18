import { useState } from "react";
import { Stage } from "@pixi/react";
import useResize from "./hooks/useResize";
import Background from "./components/UI/Background";
import GameScene from "./components/Game/GameScene";

const App = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useResize({ setDimensions });

  return (
    <main>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        options={{
          autoDensity: true,
          resizeTo: window,
        }}
      >
        <Background width={dimensions.width} height={dimensions.height} />

        <GameScene width={dimensions.width} height={dimensions.height} />
      </Stage>
    </main>
  );
};

export default App;
