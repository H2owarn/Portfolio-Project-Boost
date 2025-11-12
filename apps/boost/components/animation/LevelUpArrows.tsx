import React, { useRef, useEffect } from "react";
import { Animated, View, Easing, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export const LevelUpArrows = ({ palette }: { palette: any }) => {
  const arrows = Array.from({ length: 30 });
  const anims = useRef(arrows.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((anim, i) => {
      const loop = () => {
        anim.setValue(0);
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 4500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
        ]).start(() => loop());
      };
      loop();
    });
  }, [anims]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {anims.map((anim, i) => {
        const startX = Math.random() * 400 - 200;
        const startY = Math.random() * 150 + 150;

        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [startY + 200, startY - 300],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: [{ translateX: startX }, { translateY }, { scale }],
              opacity,
            }}
          >
            <Svg width={18} height={50} viewBox="0 0 40 80">
              <Path
                d="M20 0 L40 30 H28 V80 H12 V30 H0 Z"
                fill={palette.primary + "aa"}
              />
            </Svg>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default LevelUpArrows;