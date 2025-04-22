import { useCallback, useEffect, useRef } from "react";
import { update } from "@tweenjs/tween.js";

export const useAnimationFrame = ({
  isSpinning,
  reelIndex,
  stopDelayPerReel,
  startSpinning,
  stopSpinning,
  spinningRef,
  stoppingRef,
}: AnimationFrameRef) => {
  const animationFrameRef = useRef<number | null>(null);

  const animate = useCallback((time: number) => {
    update(time);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    if (isSpinning && !spinningRef.current) {
      startSpinning();
    } else if (!isSpinning && spinningRef.current && !stoppingRef.current) {
      setTimeout(() => {
        stopSpinning();
      }, reelIndex * stopDelayPerReel);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [
    isSpinning,
    animate,
    startSpinning,
    stopSpinning,
    reelIndex,
    stopDelayPerReel,
  ]);

  return animationFrameRef;
};
