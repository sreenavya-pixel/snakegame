import { Track } from './types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20; // pixels
export const INITIAL_SPEED = 150; // ms per tick
export const SPEED_INCREMENT = 2; // ms decrease per food eaten
export const MIN_SPEED = 50;

// Using reliable public domain/test audio URLs as placeholders for "AI Generated" music
export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Genesis (AI Gen)',
    artist: 'SynthMind Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 'track-2',
    title: 'Cybernetic Dreams (AI Gen)',
    artist: 'Neural Network Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 'track-3',
    title: 'Digital Horizon (AI Gen)',
    artist: 'Deep Learning Gamma',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];
