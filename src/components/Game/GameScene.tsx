import { Container } from "@pixi/react";
import { useCallback, useEffect, useRef, useState } from "react";
import SlotMachine from "./SlotMachine";
import SpinButton from "./SpinButton";
import BalanceDisplay from "./BalanceDisplay";
import BetControls from "./BetControls";

const GameScene = ({ width, height }: Size) => {
  const slotMachineRef = useRef<SlotMachineRef>(null);
  const [gameState, setGameState] = useState<SlotMachineState>({
    isSpinning: false,
    reelPositions: [],
    balance: 1000,
    betAmount: 20,
    lastWin: 0,
    winningPositions: [],
  });

  // Get initial state from controller
  useEffect(() => {
    if (slotMachineRef.current) {
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (slotMachineRef.current) {
      slotMachineRef.current.spin().then(() => {
        // Update state after spin
        setGameState(slotMachineRef.current!.getState());
      });
    }
  }, []);

  const handleBetChange = useCallback((newBet: number) => {
    if (slotMachineRef.current) {
      slotMachineRef.current.setBet(newBet);
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  // Define layout dimensions
  const slotMachineWidth = width * 0.6;
  const slotMachineHeight = height * 0.6;

  // Calculate positions based on container size
  const slotMachinePosition = {
    x: width * 0.37,
    y: height * 0.5,
  };

  // Position UI elements on the right
  const rightPanelX = width * 0.85; // Center of right 30% of screen
  const balanceY = height * 0.3;
  const betControlsY = height * 0.45;
  const spinButtonY = height * 0.7;

  return (
    <Container>
      <SlotMachine
        ref={slotMachineRef}
        x={slotMachinePosition.x}
        y={slotMachinePosition.y}
        width={slotMachineWidth}
        height={slotMachineHeight}
        onStateUpdate={setGameState}
      />

      <BalanceDisplay
        x={rightPanelX}
        y={balanceY}
        balance={gameState.balance}
        lastWin={gameState.lastWin}
        isSpinning={gameState.isSpinning}
      />

      <BetControls
        x={rightPanelX}
        y={betControlsY}
        betAmount={gameState.betAmount}
        onChangeBet={handleBetChange}
        disabled={gameState.isSpinning}
      />

      <SpinButton
        handleSpin={handleSpin}
        disabled={
          gameState.isSpinning || gameState.balance < gameState.betAmount
        }
        isSpinning={gameState.isSpinning}
        x={rightPanelX}
        y={spinButtonY}
      />
    </Container>
  );
};

export default GameScene;
