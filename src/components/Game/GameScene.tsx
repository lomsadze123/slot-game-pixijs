import { Container } from "@pixi/react";
import SlotMachine from "./SlotMachine";
import SpinButton from "./SpinButton";
import BalanceDisplay from "./BalanceDisplay";
import BetControls from "./BetControls";
import useSlotMachineScene from "../../hooks/useSlotMachineScene";

const GameScene = ({ width, height }: Size) => {
  const {
    gameState,
    setGameState,
    handleBetChange,
    handleSpin,
    uiDisabled,
    slotMachineRef,
  } = useSlotMachineScene();

  const uiLayout = {
    rightPanel: {
      x: width * 0.85, // Shared X for all right panel elements
      balance: { y: height * 0.3 },
      betControls: { y: height * 0.45 },
      spinButton: { y: height * 0.7 },
    },
    slotMachine: {
      x: width * 0.37,
      y: height * 0.5,
      width: width * 0.6,
      height: height * 0.6,
    },
  };

  return (
    <Container>
      <SlotMachine
        ref={slotMachineRef}
        x={uiLayout.slotMachine.x}
        y={uiLayout.slotMachine.y}
        width={uiLayout.slotMachine.width}
        height={uiLayout.slotMachine.height}
        onStateUpdate={setGameState}
      />

      <BalanceDisplay
        x={uiLayout.rightPanel.x}
        y={uiLayout.rightPanel.balance.y}
        balance={gameState.balance}
        lastWin={gameState.lastWin}
        isSpinning={uiDisabled}
      />

      <BetControls
        x={uiLayout.rightPanel.x}
        y={uiLayout.rightPanel.betControls.y}
        betAmount={gameState.betAmount}
        onChangeBet={handleBetChange}
        disabled={uiDisabled}
      />

      <SpinButton
        handleSpin={handleSpin}
        disabled={uiDisabled || gameState.balance < gameState.betAmount}
        isSpinning={uiDisabled}
        x={uiLayout.rightPanel.x}
        y={uiLayout.rightPanel.spinButton.y}
      />
    </Container>
  );
};

export default GameScene;
