import React, { createContext, useContext, useState } from "react";
import { Audio } from "expo-av";

// Tạo context để quản lý âm thanh toàn cục
const AudioManagerContext = createContext<any>(null);

// Tạo provider để chia sẻ trạng thái âm thanh cho các component con
export const AudioManagerProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);

    // Hàm dừng và giải phóng âm thanh đang phát
    const stopCurrentAudio = async () => {
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            setCurrentSound(null);
        }
    };

    // Hàm phát âm thanh mới
    const playAudio = async (uri: string) => {
        // Dừng âm thanh hiện tại trước khi phát âm thanh mới
        await stopCurrentAudio();
        
        try {
            const { sound } = await Audio.Sound.createAsync({ uri });
            setCurrentSound(sound);
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                    setCurrentSound(null);
                }
            });
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };

    return (
        <AudioManagerContext.Provider value={{ playAudio, stopCurrentAudio }}>
            {children}
        </AudioManagerContext.Provider>
    );
};

// Hook sử dụng trong các component để phát âm thanh
export const useAudioManager = () => useContext(AudioManagerContext);
