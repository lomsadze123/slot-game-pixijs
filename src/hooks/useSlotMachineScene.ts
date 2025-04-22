import { useCallback, useEffect, useRef, useState } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";

const useSlotMachineScene = () => {
  const slotMachineRef = useRef<SlotMachineRef>(null);
  const { startingBalance, betAmount, reelAnimationTime } = GAME_CONFIG;
  const [gameState, setGameState] = useState<SlotMachineState>({
    isSpinning: false,
    reelPositions: [],
    balance: startingBalance,
    betAmount,
    lastWin: 0,
    winningPositions: [],
  });
  // Add a separate UI disabled state with a longer duration
  const [uiDisabled, setUiDisabled] = useState(false);

  useEffect(() => {
    if (slotMachineRef.current) {
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (slotMachineRef.current) {
      setUiDisabled(true);

      slotMachineRef.current.spin().then(() => {
        // Update state after spin
        setGameState(slotMachineRef.current!.getState());

        // Keep UI disabled for longer duration to match reel animation
        setTimeout(() => {
          setUiDisabled(false);
        }, reelAnimationTime);
      });
    }
  }, [reelAnimationTime]);

  const handleBetChange = useCallback((newBet: number) => {
    if (slotMachineRef.current) {
      slotMachineRef.current.setBet(newBet);
      setGameState(slotMachineRef.current.getState());
    }
  }, []);

  return {
    gameState,
    setGameState,
    handleBetChange,
    handleSpin,
    uiDisabled,
    slotMachineRef,
  };
};

export default useSlotMachineScene;
