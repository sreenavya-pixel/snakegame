import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks, currentTrackIndex, setCurrentTrackIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md bg-neon-dark/80 border border-neon-cyan rounded-xl p-6 shadow-neon-cyan backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/20 rounded-full shadow-neon-cyan">
            <Music className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wider drop-shadow-[0_0_8px_rgba(5,217,232,0.8)]">
              {currentTrack.title}
            </h2>
            <p className="text-neon-pink text-sm font-semibold tracking-widest uppercase">
              {currentTrack.artist}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-neon-cyan transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2 w-full bg-gray-800 rounded-full mb-6 cursor-pointer overflow-hidden border border-gray-700"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink shadow-neon-pink transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <button 
          onClick={handlePrev}
          className="p-2 text-neon-cyan hover:text-white hover:shadow-neon-cyan rounded-full transition-all"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-neon-pink text-white rounded-full shadow-neon-pink hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-2 text-neon-cyan hover:text-white hover:shadow-neon-cyan rounded-full transition-all"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      {/* Track List */}
      <div className="mt-4 border-t border-gray-800 pt-4">
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Playlist</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
          {tracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${
                index === currentTrackIndex 
                  ? 'bg-neon-cyan/10 border-l-2 border-neon-cyan text-neon-cyan' 
                  : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <span className="text-sm truncate pr-4">{track.title}</span>
              <span className="text-xs opacity-50">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
    </div>
  );
};
