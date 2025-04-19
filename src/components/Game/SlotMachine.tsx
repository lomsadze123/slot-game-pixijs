import { Container, Graphics } from "@pixi/react";
import {
  useCallback,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Graphics as GraphicsType } from "pixi.js";
import ReelSet from "./ReelSet";
import SlotMachineController from "../../controllers/SlotMachineController";

interface SlotMachineProps extends Dimension {
  onStateUpdate?: (state: SlotMachineState) => void;
}

const SlotMachine = forwardRef<SlotMachineRef, SlotMachineProps>(
  ({ x, y, width, height, onStateUpdate }, ref) => {
    const columns = 5;
    const rows = 3;

    const controllerRef = useRef(new SlotMachineController(columns, rows));
    const [gameState, setGameState] = useState(
      controllerRef.current.getState()
    );

    // When state changes, call the onStateUpdate callback
    useEffect(() => {
      if (onStateUpdate) {
        onStateUpdate(gameState);
      }
    }, [gameState, onStateUpdate]);

    // Expose spin method to parent
    useImperativeHandle(ref, () => ({
      spin: async () => {
        if (gameState.isSpinning) return Promise.reject("Already spinning");

        setGameState((prev) => ({ ...prev, isSpinning: true }));

        return controllerRef.current
          .spin()
          .then((result) => {
            const newState = controllerRef.current.getState();
            setGameState(newState);
            return result;
          })
          .catch((error) => {
            setGameState((prev) => ({ ...prev, isSpinning: false }));
            throw error;
          });
      },
      getState: () => gameState,
      setBet: (amount: number) => {
        controllerRef.current.setBet(amount);
        setGameState(controllerRef.current.getState());
      },
    }));

    // Calculate dimensions for each cell in the grid
    const cellWidth = width / columns;
    const cellHeight = height / rows;

    const drawBackground = useCallback(
      (g: GraphicsType) => {
        g.clear();
        g.beginFill(0x000000, 0.6);
        g.drawRoundedRect(-width / 2, -height / 2, width, height + 20, 16);
        g.endFill();
      },
      [width, height]
    );

    return (
      <Container position={[x, y]}>
        <Graphics draw={drawBackground} />

        <ReelSet
          x={-width / 2 + cellWidth / 20}
          y={-height / 2 + cellHeight / 20}
          columns={columns}
          rows={rows}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          isSpinning={gameState.isSpinning}
          reelPositions={gameState.reelPositions}
        />
      </Container>
    );
  }
);

export default SlotMachine;
