interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

type Dimension = Size & Position;
