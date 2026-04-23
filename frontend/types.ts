export type Point = {
  x: number;
  y: number;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}
