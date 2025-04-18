import { Container, Graphics, Text } from "@pixi/react";
import {
  useCallback,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { TextStyle, Graphics as GraphicsType } from "pixi.js";
import ReelSet from "./ReelSet";
import SlotMachineController from "../../controllers/SlotMachineController";

const SlotMachine = forwardRef<SlotMachineRef, Dimension>(
  ({ x, y, width, height }, ref) => {
    const columns = 5;
    const rows = 3;

    const controllerRef = useRef(new SlotMachineController(columns, rows));
    const [gameState, setGameState] = useState(
      controllerRef.current.getState()
    );
    const [isSpinning, setIsSpinning] = useState(false);

    // Expose spin method to parent
    useImperativeHandle(ref, () => ({
      spin: async () => {
        if (isSpinning) return Promise.reject("Already spinning");

        setIsSpinning(true);
        return controllerRef.current
          .spin()
          .then((result) => {
            setGameState(controllerRef.current.getState());
            setIsSpinning(false);
            return result;
          })
          .catch((error) => {
            setIsSpinning(false);
            throw error;
          });
      },
      getState: () => gameState,
    }));

    // Calculate dimensions for each cell in the grid
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    const drawBackground = useCallback(
      (g: GraphicsType) => {
        g.clear();
        g.beginFill(0x000000, 0.6);
        g.drawRoundedRect(-width / 2, -height / 2, width, height, 16);
        g.endFill();
      },
      [width, height]
    );

    return (
      <Container position={[x, y]}>
        <Graphics draw={drawBackground} />

        <ReelSet
          x={-width / 2 + cellWidth / 2}
          y={-height / 2 + cellHeight / 2}
          columns={columns}
          rows={rows}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          isSpinning={isSpinning}
          reelPositions={gameState.reelPositions}
        />

        {/* Display win amount when applicable */}
        {gameState.lastWin > 0 && !isSpinning && (
          <Text
            text={`WIN: ${gameState.lastWin}`}
            anchor={0.5}
            position={[0, height / 2 + 40]}
            style={
              new TextStyle({
                fill: 0xffdd00,
                fontSize: 32,
                fontWeight: "bold",
                dropShadow: true,
                dropShadowColor: 0x000000,
                dropShadowDistance: 4,
              })
            }
          />
        )}
      </Container>
    );
  }
);

export default SlotMachine;
