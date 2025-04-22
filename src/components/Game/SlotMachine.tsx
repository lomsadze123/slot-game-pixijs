import { Container, Graphics } from "@pixi/react";
import { forwardRef, useImperativeHandle, useEffect } from "react";
import ReelSet from "./ReelSet";
import { useSlotMachine } from "../../hooks/useSlotMachine";
import { useBalanceAnimation } from "../../hooks/useBalanceAnimation";
import { drawSlotMachineBackground } from "../../utils/graphics";
import { GAME_CONFIG } from "../../constants/gameConfig";

const SlotMachine = forwardRef<SlotMachineRef, SlotMachineProps>(
  ({ x, y, width, height, onStateUpdate }, ref) => {
    const { gameState, spin, setBet, getState } = useSlotMachine(
      GAME_CONFIG.columns,
      GAME_CONFIG.rows
    );
    const displayBalance = useBalanceAnimation(gameState.balance);

    const cellSizes = {
      cellWidth: width / GAME_CONFIG.columns,
      cellHeight: height / GAME_CONFIG.rows,
    };

    useEffect(() => {
      if (onStateUpdate) {
        onStateUpdate({
          ...gameState,
          balance: displayBalance,
        });
      }
    }, [gameState, onStateUpdate, displayBalance]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      spin,
      getState,
      setBet,
    }));

    return (
      <Container position={[x, y]}>
        <Graphics draw={(g) => drawSlotMachineBackground(g, width, height)} />
        <ReelSet
          x={-width / 2 + cellSizes.cellWidth / 20}
          y={-height / 2 + cellSizes.cellHeight / 20}
          columns={GAME_CONFIG.columns}
          rows={GAME_CONFIG.rows}
          cellWidth={cellSizes.cellWidth}
          cellHeight={cellSizes.cellHeight}
          isSpinning={gameState.isSpinning}
          reelPositions={gameState.reelPositions}
          winningPositions={gameState.winningPositions || []}
        />
      </Container>
    );
  }
);

export default SlotMachine;
