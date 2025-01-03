// ProgressBar.tsx
import React from "react";
import { View, Text } from "react-native";

interface ProgressBarProps {
  value: number;
  color: string;
  style?: object;
}

const ProgressBar = ({ value, color, style }: ProgressBarProps) => {
  return (
    <View style={[{ height: 6, backgroundColor: "#e0e0e0", borderRadius: 5, flexGrow: 1, maxWidth: 150 }, style]}>
      <View
        style={{
          width: `${value * 100}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: 5,
        }}
      />
    </View>
  );
};

export default ProgressBar;
