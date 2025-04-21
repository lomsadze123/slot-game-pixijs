export const hslToHex = (h: number, s: number, l: number): number => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };

  const r = f(0);
  const g = f(8);
  const b = f(4);

  return (r << 16) + (g << 8) + b;
};
