import { useEffect, useRef } from 'react';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = 0.5;

    const playAudio = () => {
      if (audio.paused) {
        audio.play().catch(() => {
          // Autoplay blocked by browser policy, handled by interaction listeners below
        });
      }
    };

    // Try to play immediately
    playAudio();

    // Browser might block autoplay until user interacts. 
    // Listen for common interactions to start playback.
    const handleInteraction = () => {
      playAudio();
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return <audio ref={audioRef} src="/A1.wav" loop preload="auto" style={{ display: 'none' }} />;
}
