import React, { useRef, useState, useEffect } from 'react';

// Dummy music file should be placed at public/dummy-music.mp3
const MUSIC_SRC = '/dummy-music.mp3';
const STORAGE_KEY = 'atlasmoth-music-preference';

const MusicToggle = () => {
  const audioRef = useRef(null);
  // Default to true, but check localStorage for returning visitors
  const [playing, setPlaying] = useState(() => {
    const savedPreference = localStorage.getItem(STORAGE_KEY);
    return savedPreference !== null ? savedPreference === 'true' : true;
  });
  const [error, setError] = useState(false);
  const [attemptedAutoplay, setAttemptedAutoplay] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const attemptPlay = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setPlaying(true);
      setError(false);
    } catch (e) {
      setPlaying(false);
      // Only show error if it's not an autoplay attempt
      if (attemptedAutoplay) {
        setError(true);
      }
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    
    const newPlayingState = !playing;
    setUserInteracted(true);
    
    if (newPlayingState) {
      setAttemptedAutoplay(false); // Reset flag when user explicitly toggles
      attemptPlay();
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
    
    // Save preference to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newPlayingState.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  };
  
  // Try to autoplay when component mounts
  useEffect(() => {
    if (audioRef.current && !attemptedAutoplay) {
      setAttemptedAutoplay(true);
      attemptPlay();
      
      // Set up document-wide click listener to enable audio after user interaction
      // This helps on mobile devices where autoplay is strictly blocked
      if (!userInteracted) {
        const enableAudioOnInteraction = () => {
          if (!userInteracted && playing && audioRef.current) {
            attemptPlay();
            setUserInteracted(true);
          }
        };
        
        document.addEventListener('click', enableAudioOnInteraction, { once: true });
        document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
        
        return () => {
          document.removeEventListener('click', enableAudioOnInteraction);
          document.removeEventListener('touchstart', enableAudioOnInteraction);
        };
      }
    }
  }, [attemptedAutoplay, playing, userInteracted]);

  // Sync state if user manually pauses audio
  const handlePause = () => setPlaying(false);
  const handlePlay = () => setPlaying(true);
  const handleError = () => setError(true);

  return (
    <>
      <button
        type="button"
        aria-label={error ? 'Music unavailable' : (playing ? 'Mute music' : 'Play music')}
        className={`z-10 bg-background/60 hover:bg-background/80 rounded-full p-1 shadow-md border-primary focus:outline-none focus:ring-2 focus:ring-primary transition ${error ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={error ? undefined : toggleMusic}
        tabIndex={error ? -1 : 0}
        title={error ? 'Music unavailable' : (playing ? 'Mute music' : 'Play music')}
      >
        {error ? (
          // Error icon
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-red-500" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : playing ? (
          // Volume on icon
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-[#FBF7BA]" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8v4h4l5 5V3L7 8H3z" fill="currentColor"/>
            <path d="M14.5 12.5A4.5 4.5 0 0014.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16.5 15.5A8 8 0 0016.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          // Volume off icon
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-[#FBF7BA]" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8v4h4l5 5V3L7 8H3z" fill="currentColor"/>
            <path d="M15 9l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        onPause={handlePause}
        onPlay={handlePlay}
        onError={handleError}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default MusicToggle;
