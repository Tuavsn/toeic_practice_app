import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

type AudioInfo = {
  uri: string;
  title?: string;
  resourceIndex?: number;
  questionId?: string;
};

type AudioContextType = {
  currentSound: Audio.Sound | null;
  currentAudioInfo: AudioInfo | null;
  isPlaying: boolean;
  playAudio: (
    uri: string,
    title?: string,
    resourceIndex?: number,
    questionId?: string
  ) => Promise<boolean>;
  stopCurrentAudio: () => Promise<boolean>;
  setIsPlaying: (playing: boolean) => void;
};

const AudioManagerContext = createContext<AudioContextType>({
  currentSound: null,
  currentAudioInfo: null,
  isPlaying: false,
  playAudio: async () => false,
  stopCurrentAudio: async () => false,
  setIsPlaying: () => { },
});

export const AudioManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [currentAudioInfo, setCurrentAudioInfo] = useState<AudioInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio mode once
  useEffect(() => {
    (async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (err) {
        console.error("Error initializing audio:", err);
      }
    })();
  }, []);

  // Play or toggle
  const playAudio = async (
    uri: string,
    title?: string,
    resourceIndex?: number,
    questionId?: string
  ) => {
    // Toggle existing sound
    if (
      currentAudioInfo?.uri === uri &&
      currentAudioInfo.resourceIndex === resourceIndex &&
      currentAudioInfo.questionId === questionId &&
      currentSound
    ) {
      setIsPlaying((prev) => !prev);
      return true;
    }

    // Stop any existing sound
    await stopCurrentAudio();

    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, staysActiveInBackground: true }
      );
      setCurrentSound(sound);
      setCurrentAudioInfo({ uri, title, resourceIndex, questionId });
      setIsPlaying(status.isPlaying);
      return true;
    } catch (err) {
      console.error("Error playing audio:", err);
      return false;
    }
  };

  // Stop and cleanup
  const stopCurrentAudio = async () => {
    if (!currentSound) return false;
    try {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      setCurrentSound(null);
      setCurrentAudioInfo(null);
      setIsPlaying(false);
      return true;
    } catch (err) {
      console.error("Error stopping audio:", err);
      return false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  return (
    <AudioManagerContext.Provider
      value={{
        currentSound,
        currentAudioInfo,
        isPlaying,
        playAudio,
        stopCurrentAudio,
        setIsPlaying,
      }}
    >
      {children}
    </AudioManagerContext.Provider>
  );
};

export const useAudioManager = () => useContext(AudioManagerContext);
