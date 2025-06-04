import React, { useCallback } from 'react';
import { Resource, ResourceType } from '@/types/global.type';
import { TouchableOpacity, Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAudioManager } from "@/context/AudioContext";

interface RenderResourceProps {
  resource: Resource;
  resourceIndex: number;
  questionId?: string;
  primaryColor?: string;
}

const RenderResource = ({ resource, resourceIndex, questionId, primaryColor = "#004B8D" }: RenderResourceProps) => {
  const { playAudio, currentAudioInfo, isPlaying, stopCurrentAudio } = useAudioManager();

  // Check if this resource is currently playing
  const isThisResourcePlaying =
    currentAudioInfo?.questionId === questionId &&
    currentAudioInfo?.resourceIndex === resourceIndex;

  // Use useCallback to prevent unnecessary re-renders
  const handlePlayAudio = useCallback(() => {
    // If this is the currently playing resource, toggle play/pause
    if (isThisResourcePlaying) {
      if (isPlaying) {
        stopCurrentAudio();
      } else {
        const title = `Audio ${resourceIndex + 1}`;
        playAudio(resource.content, title, resourceIndex, questionId);
      }
    } else {
      // Otherwise, play this audio
      const title = `Audio ${resourceIndex + 1}`;
      playAudio(resource.content, title, resourceIndex, questionId);
    }
  }, [resource.content, resourceIndex, questionId, isThisResourcePlaying, isPlaying]);

  switch (resource.type) {
    case ResourceType.IMAGE:
      return (
        <View style={{
          marginBottom: 12,
          borderRadius: 8,
          overflow: 'hidden',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}>
          <Image
            source={{ uri: resource.content }}
            style={{
              width: '100%',
              height: 200,
              resizeMode: 'contain',
              backgroundColor: '#f5f5f5',
            }}
          />
        </View>
      );
    case ResourceType.AUDIO:
      return (
        <View style={{
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
          padding: 12,
          width: '100%',
        }}>
          <TouchableOpacity
            onPress={handlePlayAudio}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: primaryColor,
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Ionicons
                  name={isThisResourcePlaying && isPlaying ? "pause" : "play"}
                  size={22}
                  color="white"
                />
              </View>
              <Text style={{ fontSize: 15, color: '#333' }}>
                {`Audio ${resourceIndex + 1}`}
              </Text>
            </View>

            {isThisResourcePlaying && (
              <View style={{
                backgroundColor: 'rgba(0, 75, 141, 0.1)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '500' }}>
                  {isPlaying ? "Now Playing" : "Paused"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    case ResourceType.PARAGRAPH:
      return (
        <Text style={{
          marginBottom: 12,
          fontSize: 15,
          lineHeight: 22,
          fontStyle: 'italic',
          color: '#444',
          backgroundColor: '#f9f9f9',
          padding: 12,
          borderRadius: 8,
          borderLeftWidth: 3,
          borderLeftColor: primaryColor,
        }}>
          {resource.content}
        </Text>
      );
    default:
      return null;
  }
};

export default React.memo(RenderResource); // Memoize to prevent unnecessary re-renders