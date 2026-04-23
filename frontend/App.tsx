import React, { useState } from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { TRACKS } from './constants';

const App: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden font-mono">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Grid overlay for retro feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <header className="w-full p-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] tracking-tighter">
          NEON SYNTH SNAKE
        </h1>
        <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">Cybernetic Arcade Experience</p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-4 lg:p-12 z-10">
        
        {/* Left/Top Side: Music Player */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end order-2 lg:order-1">
          <MusicPlayer 
            tracks={TRACKS} 
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
          />
        </div>

        {/* Right/Center Side: Game */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-start order-1 lg:order-2">
          <SnakeGame />
        </div>

      </main>

      <footer className="w-full p-4 text-center text-gray-600 text-xs z-10">
        <p>Use Arrow Keys or WASD to move. Space to pause.</p>
        <p className="mt-1">Music tracks are placeholders for AI generated content.</p>
      </footer>
    </div>
  );
};

export default App;
