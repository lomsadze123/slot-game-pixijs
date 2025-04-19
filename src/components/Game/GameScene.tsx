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

  // Calculate positions based on container size
  const slotMachinePosition = {
    x: width * 0.5,
    y: height * 0.5,
  };

  return (
    <Container>
      <SlotMachine
        ref={slotMachineRef}
        x={slotMachinePosition.x}
        y={slotMachinePosition.y}
        width={width * 0.7}
        height={height * 0.6}
        onStateUpdate={setGameState}
      />

      <BalanceDisplay
        x={width * 0.2}
        y={height * 0.8}
        balance={gameState.balance}
        lastWin={gameState.lastWin}
        isSpinning={gameState.isSpinning}
      />

      <BetControls
        x={width * 0.8}
        y={height * 0.8}
        betAmount={gameState.betAmount}
        onChangeBet={handleBetChange}
        disabled={gameState.isSpinning}
      />

      <SpinButton
        handleSpin={handleSpin}
        width={width}
        height={height}
        disabled={
          gameState.isSpinning || gameState.balance < gameState.betAmount
        }
      />
    </Container>
  );
};

export default GameScene;
