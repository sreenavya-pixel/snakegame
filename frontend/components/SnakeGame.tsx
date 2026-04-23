import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

const getInitialSnake = (): Point[] => [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(getInitialSnake());
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  // Use refs to track the *intended* next direction to prevent rapid double-turn self-collisions
  const directionRef = useRef<Direction>(Direction.UP);
  const nextDirectionRef = useRef<Direction>(Direction.UP);

  // Initialize food safely on mount
  useEffect(() => {
    setFood(generateFood(getInitialSnake()));
    const savedHighScore = localStorage.getItem('neonSnakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && !gameOver) {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused || gameOver) return;

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== Direction.DOWN) nextDirectionRef.current = Direction.UP;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== Direction.UP) nextDirectionRef.current = Direction.DOWN;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== Direction.RIGHT) nextDirectionRef.current = Direction.LEFT;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== Direction.LEFT) nextDirectionRef.current = Direction.RIGHT;
        break;
    }
  }, [isPaused, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const currentDir = nextDirectionRef.current;
      directionRef.current = currentDir; // Update the actual direction being processed
      setDirection(currentDir); // Sync state for UI if needed

      const newHead = { ...head };

      switch (currentDir) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        setFood(generateFood(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused]);

  useInterval(gameLoop, isPaused || gameOver ? null : speed);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPaused(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('neonSnakeHighScore', score.toString());
    }
  };

  const resetGame = () => {
    setSnake(getInitialSnake());
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    nextDirectionRef.current = Direction.UP;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(getInitialSnake()));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Score Board */}
      <div className="flex justify-between w-full max-w-[400px] mb-4 px-4 py-2 bg-neon-dark/80 border border-neon-pink rounded-lg shadow-neon-pink backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-xs text-neon-pink uppercase tracking-widest">Score</span>
          <span className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-neon-cyan uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3" /> High Score
          </span>
          <span className="text-2xl font-bold text-neon-cyan drop-shadow-[0_0_5px_rgba(5,217,232,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div 
          className="bg-black border-2 border-neon-cyan shadow-neon-cyan rounded-sm overflow-hidden"
          style={{
            width: GRID_SIZE * 20,
            height: GRID_SIZE * 20,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {/* Render Grid Cells */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = "w-full h-full ";
            if (isSnakeHead) {
              cellClass += "bg-neon-pink shadow-[0_0_10px_#ff2a6d] z-10 rounded-sm";
            } else if (isSnakeBody) {
              cellClass += "bg-neon-pink/70 border border-neon-pink/30 rounded-sm";
            } else if (isFood) {
              cellClass += "bg-neon-green shadow-[0_0_15px_#39ff14] rounded-full animate-pulse";
            } else {
              // Subtle grid lines
              cellClass += "border-[0.5px] border-gray-900/30";
            }

            return <div key={i} className={cellClass} />;
          })}
        </div>

        {/* Overlays */}
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {gameOver ? (
              <div className="text-center animate-bounce">
                <h2 className="text-4xl font-bold text-neon-pink mb-2 drop-shadow-neon-pink">GAME OVER</h2>
                <p className="text-white mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold rounded-full transition-all shadow-neon-cyan"
                >
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-neon-cyan mb-6 tracking-widest drop-shadow-neon-cyan">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-neon-pink text-white font-bold rounded-full hover:scale-105 transition-transform shadow-neon-pink"
                >
                  <Play className="w-6 h-6 fill-current" /> Resume
                </button>
                <p className="mt-4 text-gray-400 text-sm">Press Space to pause/resume</p>
                <p className="text-gray-400 text-sm">Use Arrow Keys or WASD to move</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
