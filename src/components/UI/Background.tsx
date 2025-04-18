import { Container, Graphics, Sprite } from "@pixi/react";
import { Graphics as PixiGraphicsType, Texture } from "pixi.js";
import { useCallback, useEffect, useState } from "react";

interface BackgroundProps {
  width: number;
  height: number;
}

const createGradientTexture = (width: number, height: number): Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return Texture.EMPTY;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0b0c1c");
  gradient.addColorStop(0.5, "#1a1042");
  gradient.addColorStop(1, "#3a0f4a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return Texture.from(canvas);
};

const Background = ({ width, height }: BackgroundProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [bgTexture, setBgTexture] = useState<Texture>(Texture.EMPTY);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 1.2,
        speed: Math.random() * 0.05 + 0.01,
        angle: Math.random() * Math.PI * 2,
      });
    }
    setStars(newStars);
    setBgTexture(createGradientTexture(width, height));
  }, [width, height]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          const dx = Math.cos(star.angle) * star.speed;
          const dy = Math.sin(star.angle) * star.speed;

          let newX = star.x + dx;
          let newY = star.y + dy;

          // Wrap around edges
          if (newX < 0) newX = width;
          if (newX > width) newX = 0;
          if (newY < 0) newY = height;
          if (newY > height) newY = 0;

          return { ...star, x: newX, y: newY };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height]);

  const drawStars = useCallback(
    (g: PixiGraphicsType | null) => {
      if (!g) return;
      g.clear();

      stars.forEach((star) => {
        g.beginFill(0xffffff, star.alpha);
        g.drawCircle(star.x, star.y, star.size);
        g.endFill();
      });
    },
    [stars]
  );

  return (
    <Container>
      <Sprite texture={bgTexture} width={width} height={height} />
      <Graphics draw={drawStars} />
    </Container>
  );
};

export default Background;
