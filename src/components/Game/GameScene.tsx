import { Container } from "@pixi/react";
import { useCallback, useRef } from "react";
import SlotMachine from "./SlotMachine";
import SpinButton from "./SpinButton";

const GameScene = ({ width, height }: Size) => {
  const slotMachineRef = useRef<SlotMachineRef>(null);

  const handleSpin = useCallback(() => {
    if (slotMachineRef.current) {
      slotMachineRef.current.spin();
    }
  }, []);

  // Calculate positions based on container size
  const slotMachinePosition = {
    x: width * 0.5,
    y: height * 0.5,
  };

  return (
    <Container>
      {/* Background elements here */}

      <SlotMachine
        ref={slotMachineRef}
        x={slotMachinePosition.x}
        y={slotMachinePosition.y}
        width={width * 0.7}
        height={height * 0.6}
      />

      <SpinButton handleSpin={handleSpin} width={width} height={height} />

      {/* UI controls here */}
    </Container>
  );
};

export default GameScene;
