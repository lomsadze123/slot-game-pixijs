import { Stage } from "@pixi/react";
import { useState } from "react";
import useResize from "./hooks/useResize";
import Background from "./components/UI/Background";

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
      </Stage>
    </main>
  );
};

export default App;
