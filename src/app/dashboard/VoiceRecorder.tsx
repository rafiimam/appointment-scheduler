import { useState, useRef } from 'react';
import { Button } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

interface VoiceRecorderProps {
  onRecordingComplete: (base64Audio: string) => void;
}

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onRecordingComplete(base64Audio);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      //console.error('Error accessing microphone:', error);
      alert('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <Button
      variant="outlined"
      color={isRecording ? "error" : "primary"}
      startIcon={isRecording ? <StopIcon /> : <MicIcon />}
      onClick={isRecording ? stopRecording : startRecording}
      fullWidth
      style={{ marginTop: '15px' }}
    >
      {isRecording ? 'Stop Recording' : 'Record Voice Note'}
    </Button>
  );
}