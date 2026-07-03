import { useEffect, useRef } from 'react';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    let fader: NodeJS.Timeout | null = null;
    let isUserMuted = false;

    const fadeAudioIn = () => {
      if (isUserMuted) return;
      if (fader) clearInterval(fader);
      audio.volume = 0;
      const fadeDuration = 5000;
      const fadeSteps = 50;
      const stepTime = fadeDuration / fadeSteps;
      const volumeStep = 0.25 / fadeSteps;
      
      let currentVolume = 0;
      fader = setInterval(() => {
        currentVolume += volumeStep;
        if (currentVolume >= 0.25) {
          audio.volume = 0.25;
          if (fader) clearInterval(fader);
        } else {
          audio.volume = Math.min(0.25, currentVolume);
        }
      }, stepTime);
    };

    const playAudio = async () => {
      if (!audio.paused || isUserMuted) return true;
      
      try {
        await audio.play();
        fadeAudioIn();
        return true;
      } catch (err) {
        // Autoplay blocked by browser policy
        return false;
      }
    };

    const toggleMute = () => {
      if (isUserMuted) {
        // Unmute and fade in
        isUserMuted = false;
        if (audio.paused) {
          playAudio();
        } else {
          fadeAudioIn();
        }
      } else {
        // Mute
        isUserMuted = true;
        if (fader) clearInterval(fader);
        audio.volume = 0;
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    const handleInteraction = async () => {
      if (isUserMuted) return;
      const success = await playAudio();
      if (success) {
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('wheel', handleInteraction);
        window.removeEventListener('mousemove', handleInteraction);
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('touchend', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
      }
    };

    // Try to play immediately (might succeed on desktop if previously interacted)
    playAudio().then(success => {
      if (!success) {
        // Only add listeners if autoplay was blocked
        window.addEventListener('scroll', handleInteraction, { passive: true });
        window.addEventListener('wheel', handleInteraction, { passive: true });
        window.addEventListener('mousemove', handleInteraction, { passive: true });
        window.addEventListener('click', handleInteraction, { passive: true });
        window.addEventListener('touchstart', handleInteraction, { passive: true });
        window.addEventListener('touchend', handleInteraction, { passive: true });
        window.addEventListener('keydown', handleInteraction, { passive: true });
      }
    });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('touchend', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('keydown', handleKeydown);
      if (fader) clearInterval(fader);
    };
  }, []);

  return <audio ref={audioRef} src="/A1.wav" loop preload="auto" style={{ display: 'none' }} />;
}
