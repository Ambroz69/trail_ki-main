import React, { useState, useRef, useEffect } from 'react';
import Cookies from "universal-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const cookies = new Cookies();
const token = cookies.get("SESSION_TOKEN");

const AudioRecorder = ({ onSave, pointId, existingAudio, blob, reset}) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(blob || null);
  const [audioPath, setAudioPath] = useState(existingAudio ? `${backendUrl}${existingAudio}` : null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (reset) {
      setAudioBlob(null);
      setAudioPath(existingAudio ? `${backendUrl}${existingAudio}` : null);
    }
  }, [reset]);

  useEffect(() => {
    if (blob) {
      setAudioBlob(blob);
    }
  }, [blob]);

  useEffect(() => {
    if (existingAudio) {
      setAudioPath(`${backendUrl}${existingAudio}`);
    }
  }, [existingAudio]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audio = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audio);
      onSave(audio, pointId); // Pass to parent component
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const removeAudio = async () => {
    if (existingAudio) { // Only send request if audio file exists on the server
      try {
        const response = await fetch(`${backendUrl}/trails/delete-audio`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ existingAudio }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Failed to delete audio');
        console.log('Audio deleted:', result);

      } catch (error) {
        console.error('Error deleting audio:', error);
      }
    }
    setAudioBlob(null);
    setAudioPath(null);
    onSave(null);
  };

  return (
    <div>
      {audioBlob ? (
        <div>
          <audio controls src={URL.createObjectURL(audioBlob)} type="audio/wav"></audio>
          <button onClick={removeAudio} className="btn btn-warning">Remove</button>
        </div>
      ) : audioPath ? (
        <div>
          <audio controls src={audioPath} type="audio/wav"></audio>
          <button onClick={removeAudio} className="btn btn-warning">Remove</button>
        </div>
      ) : (
        <button className={recording ? 'btn btn-danger' : 'btn btn-primary'} onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;