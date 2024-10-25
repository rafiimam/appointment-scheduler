import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useState, useRef } from 'react';

interface AudioPlayerProps {
  base64Audio: string;
}

export default function AudioPlayer({ base64Audio }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(base64Audio);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      onClick={togglePlay}
    >
      {isPlaying ? 'Pause' : 'Play'} Voice Note
    </Button>
  );
}