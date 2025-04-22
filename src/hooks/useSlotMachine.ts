import { useRef, useState } from "react";
import SlotMachineController from "../controllers/SlotMachineController";

export const useSlotMachine = (columns: number, rows: number) => {
  const controllerRef = useRef(new SlotMachineController(columns, rows));
  const [gameState, setGameState] = useState<SlotMachineState>(
    controllerRef.current.getState()
  );

  const spin = async () => {
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
  };

  const setBet = (amount: number) => {
    controllerRef.current.setBet(amount);
    setGameState(controllerRef.current.getState());
  };

  return {
    gameState,
    spin,
    setBet,
    getState: () => gameState,
  };
};
