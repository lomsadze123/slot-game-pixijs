export const SYMBOL_ASSETS = [
  "images/symbols/a.png",
  "images/symbols/alien.png",
  "images/symbols/apollo.png",
  "images/symbols/cosmo-head.png",
  "images/symbols/j.png",
  "images/symbols/k.png",
  "images/symbols/loop.png",
  "images/symbols/o.png",
  "images/symbols/rock.png",
  "images/symbols/scatter.png",
  "images/symbols/ten.png",
  "images/symbols/wild.png",
];

export const BG_ASSETS = SYMBOL_ASSETS.map((path) => {
  // Extract the filename without extension
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const nameWithoutExt = filename.split(".")[0];

  // Create the background path
  return `images/symbol_bgs/${nameWithoutExt}_bg.png`;
});
